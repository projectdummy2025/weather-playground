/**
 * Debug script untuk test BMKG API dan parsing
 * Usage: npx tsx scripts/debug-bmkg.ts [adm4_code]
 */

import { fetchWeatherForecast, flattenWeatherData } from '../src/lib/bmkg';
import { transformToHourlyForecast } from '../src/services/interpreter';

const adm4 = process.argv[2] || '91.05.16.2001';

async function debugBMKG() {
    console.log('🔍 Testing BMKG API for:', adm4);
    console.log('─'.repeat(60));

    // 1. Test API call
    const response = await fetchWeatherForecast(adm4);

    if (!response) {
        console.error('❌ Failed to fetch data');
        return;
    }

    console.log('✅ API Response received');
    console.log(`   Location: ${response.lokasi.desa}, ${response.lokasi.kecamatan}`);
    console.log(`   Days: ${response.data.length}`);

    // 2. Test flattening
    const flatData = flattenWeatherData(response);
    console.log(`\n📊 Flattened data: ${flatData.length} forecasts`);

    // 3. Show sample
    if (flatData.length > 0) {
        console.log('\n🔬 Sample data (first forecast):');
        const sample = flatData[0];
        console.log(JSON.stringify(sample, null, 2));
    }

    // 4. Test parsing
    const parsed = flatData.map(transformToHourlyForecast);
    const valid = parsed.filter(p => p !== null);
    const invalid = parsed.length - valid.length;

    console.log(`\n✨ Parsing results:`);
    console.log(`   Valid: ${valid.length}`);
    console.log(`   Invalid/Skipped: ${invalid}`);

    if (valid.length > 0) {
        console.log('\n📅 Valid forecast hours:');
        valid.forEach(f => {
            if (f) {
                console.log(`   ${f.localDatetime} - ${f.hour}:00 - ${f.weatherDesc}`);
            }
        });
    }
}

debugBMKG().catch(console.error);
