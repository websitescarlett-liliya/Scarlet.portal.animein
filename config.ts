// Konfigurasi global. ENABLE_ADS harus SELALU false — jangan pernah diubah
// atau ditambahkan slot iklan apapun di komponen manapun di project ini.
export const ENABLE_ADS = process.env.NEXT_PUBLIC_ENABLE_ADS === 'true' ? false : false;

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface SiteSettings {
  siteName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  description: string | null;
  primaryColorHex: string;
  bgType: 'none' | 'image' | 'video';
  bgUrl: string | null;
  bgMode: 'repeat' | 'cover' | 'fixed' | 'blur';
  themeMode: 'dark' | 'light' | 'auto';
  containerWidth: string;
  cardRadius: string;
  animationsOn: boolean;
  defaultServer: string | null;
  autoplay: boolean;
  skipIntroSeconds: number;
  commentsEnabled: boolean;
  bookmarkEnabled: boolean;
  scheduleEnabled: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  gaId: string | null;
}

// Dipanggil di server component (layout.tsx) agar tema ter-apply saat SSR,
// mencegah "flash" warna default sebelum tema custom termuat.
export async function getSiteSettings(): Promise<SiteSettings> {
  const res = await fetch(`${API_URL}/settings`, {
    next: { revalidate: 60 }, // cache 60 detik, admin bisa ubah tanpa deploy ulang
  });
  if (!res.ok) {
    throw new Error('Gagal memuat pengaturan situs');
  }
  return res.json();
}
