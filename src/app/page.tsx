/**
 * Homepage - Pencarian Lokasi
 * Halaman utama untuk mencari dan memilih lokasi
 */

import { SearchBar } from '@/components/location';

export default function HomePage() {
  return (
    <main className="px-4 py-8 pb-16">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          ☁️ Cumulus
        </h1>
        <p className="text-slate-600">
          Prakiraan cuaca untuk aktivitas harianmu
        </p>
      </div>
      
      {/* Search Box */}
      <div className="mb-8">
        <SearchBar 
          placeholder="Cari desa atau kelurahan..." 
          autoFocus 
        />
        <p className="text-sm text-slate-500 text-center mt-3">
          Ketik nama desa/kelurahan untuk melihat prakiraan cuaca
        </p>
      </div>
      
      {/* Feature highlights */}
      <div className="space-y-4">
        <FeatureCard
          emoji="🟢"
          title="Jam Aman vs Jam Risiko"
          description="Lihat kapan waktu terbaik untuk aktivitas luar ruangan"
        />
        <FeatureCard
          emoji="📝"
          title="Ringkasan Bahasa Awam"
          description="Informasi cuaca tanpa jargon meteorologi yang membingungkan"
        />
        <FeatureCard
          emoji="📍"
          title="Prakiraan Per Desa"
          description="Data spesifik untuk lokasi tempat tinggalmu"
        />
      </div>
    </main>
  );
}

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
}

function FeatureCard({ emoji, title, description }: FeatureCardProps) {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
      <div className="text-2xl">{emoji}</div>
      <div>
        <h3 className="font-medium text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}
