import { API_URL } from '@/lib/config';

async function getHomeData() {
  const res = await fetch(`${API_URL}/anime?limit=12`, { next: { revalidate: 120 } });
  if (!res.ok) return { items: [] };
  return res.json();
}

export default async function HomePage() {
  const { items } = await getHomeData();

  return (
    <main className="px-4 py-6">
      {/* Banner slider — untuk implementasi penuh, pakai Swiper.js atau Framer Motion
          carousel di sini, sumber data dari anime dengan flag `featured` */}
      <section className="mb-8 h-64 rounded-card bg-zinc-800 flex items-center justify-center">
        <p className="opacity-60">Banner slider anime unggulan</p>
      </section>

      <SectionTitle>Sedang Tayang</SectionTitle>
      <AnimeGrid items={items} />

      <SectionTitle>Anime Terbaru</SectionTitle>
      <AnimeGrid items={items} />

      <SectionTitle>Populer</SectionTitle>
      <AnimeGrid items={items} />

      <SectionTitle>Jadwal Rilis Mingguan</SectionTitle>
      <WeeklySchedule />
    </main>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 mt-8 text-lg font-bold">{children}</h2>;
}

function AnimeGrid({ items }: { items: any[] }) {
  if (!items?.length) {
    return <p className="text-sm opacity-60">Belum ada data. Tambahkan anime lewat /admin.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((anime) => (
        <a key={anime.id} href={`/anime/${anime.slug}`} className="card block bg-zinc-900">
          <div className="aspect-[2/3] w-full rounded-t-card bg-zinc-800 bg-cover bg-center"
               style={{ backgroundImage: anime.posterUrl ? `url(${anime.posterUrl})` : undefined }} />
          <div className="p-2">
            <p className="line-clamp-2 text-sm font-medium">{anime.title}</p>
            <p className="text-xs opacity-60">★ {anime.score ?? '-'}</p>
          </div>
        </a>
      ))}
    </div>
  );
}

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jumat", 'Sabtu'];

function WeeklySchedule() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
      {DAYS.map((day) => (
        <div key={day} className="card bg-zinc-900 p-3">
          <p className="mb-2 text-sm font-semibold link-primary">{day}</p>
          <p className="text-xs opacity-50">Belum ada jadwal</p>
        </div>
      ))}
    </div>
  );
}
