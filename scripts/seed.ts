/**
 * Database Seeder
 * Script untuk mengimpor data wilayah dari kode-wilayah.csv ke database
 * 
 * Jalankan dengan: npx tsx scripts/seed.ts
 */

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'adm4',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin0123',
});

interface WilayahData {
  provinces: Map<string, string>;
  regencies: Map<string, { provinceCode: string; name: string }>;
  districts: Map<string, { regencyCode: string; name: string }>;
  villages: Map<string, { districtCode: string; name: string }>;
}

/**
 * Parse kode wilayah untuk menentukan level
 * 11 = provinsi
 * 11.01 = kabupaten
 * 11.01.01 = kecamatan
 * 11.01.01.2001 = desa
 */
function getLevel(code: string): 'province' | 'regency' | 'district' | 'village' {
  const parts = code.split('.');
  switch (parts.length) {
    case 1: return 'province';
    case 2: return 'regency';
    case 3: return 'district';
    case 4: return 'village';
    default: throw new Error(`Invalid code format: ${code}`);
  }
}

/**
 * Mendapatkan parent code
 */
function getParentCode(code: string): string {
  const parts = code.split('.');
  parts.pop();
  return parts.join('.');
}

/**
 * Parse CSV file dan kelompokkan berdasarkan level
 */
async function parseCSV(filePath: string): Promise<WilayahData> {
  const data: WilayahData = {
    provinces: new Map(),
    regencies: new Map(),
    districts: new Map(),
    villages: new Map(),
  };

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineCount = 0;

  for await (const line of rl) {
    lineCount++;
    
    // Skip empty lines
    if (!line.trim()) continue;

    // Parse CSV line (format: code,name)
    const commaIndex = line.indexOf(',');
    if (commaIndex === -1) {
      console.warn(`Skipping invalid line ${lineCount}: ${line}`);
      continue;
    }

    const code = line.substring(0, commaIndex).trim();
    const name = line.substring(commaIndex + 1).trim();

    const level = getLevel(code);

    switch (level) {
      case 'province':
        data.provinces.set(code, name);
        break;
      case 'regency':
        data.regencies.set(code, {
          provinceCode: getParentCode(code),
          name,
        });
        break;
      case 'district':
        data.districts.set(code, {
          regencyCode: getParentCode(code),
          name,
        });
        break;
      case 'village':
        data.villages.set(code, {
          districtCode: getParentCode(code),
          name,
        });
        break;
    }
  }

  return data;
}

/**
 * Insert data ke database dengan batch
 */
async function seedDatabase(data: WilayahData) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    
    // Temporarily disable foreign key checks for faster import
    await client.query('SET CONSTRAINTS ALL DEFERRED');

    // 1. Insert provinces
    console.log(`Inserting ${data.provinces.size} provinces...`);
    for (const [code, name] of data.provinces) {
      await client.query(
        'INSERT INTO provinces (code, name) VALUES ($1, $2) ON CONFLICT (code) DO UPDATE SET name = $2',
        [code, name]
      );
    }
    console.log('✓ Provinces inserted');

    // 2. Insert regencies
    console.log(`Inserting ${data.regencies.size} regencies...`);
    let regencyCount = 0;
    for (const [code, { provinceCode, name }] of data.regencies) {
      await client.query(
        'INSERT INTO regencies (code, province_code, name) VALUES ($1, $2, $3) ON CONFLICT (code) DO UPDATE SET name = $3',
        [code, provinceCode, name]
      );
      regencyCount++;
      if (regencyCount % 100 === 0) {
        process.stdout.write(`\r  Progress: ${regencyCount}/${data.regencies.size}`);
      }
    }
    console.log('\n✓ Regencies inserted');

    // 3. Insert districts
    console.log(`Inserting ${data.districts.size} districts...`);
    let districtCount = 0;
    for (const [code, { regencyCode, name }] of data.districts) {
      await client.query(
        'INSERT INTO districts (code, regency_code, name) VALUES ($1, $2, $3) ON CONFLICT (code) DO UPDATE SET name = $3',
        [code, regencyCode, name]
      );
      districtCount++;
      if (districtCount % 500 === 0) {
        process.stdout.write(`\r  Progress: ${districtCount}/${data.districts.size}`);
      }
    }
    console.log('\n✓ Districts inserted');

    // 4. Insert villages - skip ones with missing district
    console.log(`Inserting ${data.villages.size} villages...`);
    let villageCount = 0;
    let skippedCount = 0;
    
    for (const [code, { districtCode, name }] of data.villages) {
      // Check if district exists
      if (!data.districts.has(districtCode)) {
        skippedCount++;
        continue;
      }
      
      try {
        await client.query(
          'INSERT INTO villages (code, district_code, name) VALUES ($1, $2, $3) ON CONFLICT (code) DO UPDATE SET name = $3',
          [code, districtCode, name]
        );
        villageCount++;
        if (villageCount % 5000 === 0) {
          process.stdout.write(`\r  Progress: ${villageCount}/${data.villages.size - skippedCount}`);
        }
      } catch (err) {
        skippedCount++;
      }
    }
    console.log(`\n✓ Villages inserted (${skippedCount} skipped due to missing district)`);

    await client.query('COMMIT');
    console.log('\n✅ Database seeding completed!');

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Verify data counts
 */
async function verifyData() {
  const result = await pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM provinces) as provinces,
      (SELECT COUNT(*) FROM regencies) as regencies,
      (SELECT COUNT(*) FROM districts) as districts,
      (SELECT COUNT(*) FROM villages) as villages
  `);
  
  console.log('\n📊 Data Summary:');
  console.log(`   Provinces: ${result.rows[0].provinces}`);
  console.log(`   Regencies: ${result.rows[0].regencies}`);
  console.log(`   Districts: ${result.rows[0].districts}`);
  console.log(`   Villages:  ${result.rows[0].villages}`);
}

async function main() {
  console.log('🌱 Starting database seeder...\n');

  const csvPath = path.join(__dirname, '../docs/kode-wilayah.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  try {
    console.log('📖 Reading CSV file...');
    const data = await parseCSV(csvPath);
    
    console.log('\n📊 Parsed data:');
    console.log(`   Provinces: ${data.provinces.size}`);
    console.log(`   Regencies: ${data.regencies.size}`);
    console.log(`   Districts: ${data.districts.size}`);
    console.log(`   Villages:  ${data.villages.size}`);
    console.log('');

    await seedDatabase(data);
    await verifyData();

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
