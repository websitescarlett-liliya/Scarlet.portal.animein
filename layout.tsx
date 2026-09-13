import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/config';
import '@/styles/globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.metaTitle || settings.siteName,
    description: settings.metaDescription || settings.description || undefined,
    icons: settings.faviconUrl ? [{ url: settings.faviconUrl }] : undefined,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  // Semua warna UI (button, link, hover, badge) memakai var(--primary) di globals.css
  // dan tailwind.config.js — jadi cukup 1 titik injeksi di sini untuk apply ke
  // seluruh situs tanpa perlu ubah komponen manapun.
  const themeStyle = `
    :root {
      --primary: ${settings.primaryColorHex};
      --container-width: ${settings.containerWidth};
      --card-radius: ${settings.cardRadius};
    }
  `;

  const bodyBgStyle: React.CSSProperties = {};
  if (settings.bgType === 'image' && settings.bgUrl) {
    bodyBgStyle.backgroundImage = `url(${settings.bgUrl})`;
    bodyBgStyle.backgroundRepeat = settings.bgMode === 'repeat' ? 'repeat' : 'no-repeat';
    bodyBgStyle.backgroundSize = settings.bgMode === 'cover' ? 'cover' : 'auto';
    bodyBgStyle.backgroundAttachment = settings.bgMode === 'fixed' ? 'fixed' : 'scroll';
    if (settings.bgMode === 'blur') bodyBgStyle.filter = 'blur(4px)';
  }

  return (
    <html lang="id" className={settings.themeMode === 'light' ? '' : 'dark'}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
        {settings.gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${settings.gaId}');`,
              }}
            />
          </>
        )}
      </head>
      <body
        style={bodyBgStyle}
        className={settings.animationsOn ? '' : 'motion-reduce'}
      >
        {settings.bgType === 'video' && settings.bgUrl && (
          <video
            className="fixed inset-0 -z-10 h-full w-full object-cover"
            src={settings.bgUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        <div style={{ maxWidth: 'var(--container-width)' }} className="mx-auto">
          {children}
        </div>
        {/* Tidak ada slot iklan/popunder di manapun dalam layout ini. */}
      </body>
    </html>
  );
}
