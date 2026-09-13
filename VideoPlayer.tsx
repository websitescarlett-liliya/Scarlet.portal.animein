'use client';

import { useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
import Hls from 'hls.js';
import 'plyr/dist/plyr.css';
import { API_URL } from '@/lib/config';

interface ServerOption {
  id: string;
  serverName: string;
  quality: string; // P360 | P480 | P720 | P1080 | P4K
  url: string;
  isHls: boolean;
}

interface VideoPlayerProps {
  episodeId: string;
  servers: ServerOption[];
  subtitleVttUrl?: string | null;
  skipIntro?: { start: number; end: number } | null;
  autoplay: boolean;
  nextEpisodeUrl?: string | null; // untuk auto-next
  resumeAtSeconds?: number;
}

const QUALITY_LABEL: Record<string, string> = {
  P360: '360p',
  P480: '480p',
  P720: '720p',
  P1080: '1080p',
  P4K: '4K',
};

export default function VideoPlayer({
  episodeId,
  servers,
  subtitleVttUrl,
  skipIntro,
  autoplay,
  nextEpisodeUrl,
  resumeAtSeconds = 0,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const plyrRef = useRef<Plyr | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [currentServer, setCurrentServer] = useState(servers[0]);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportMessage, setReportMessage] = useState('');

  // Setup Plyr + HLS setiap kali server/kualitas berganti
  useEffect(() => {
    if (!videoRef.current || !currentServer) return;
    const video = videoRef.current;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (currentServer.isHls && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(currentServer.url);
      hls.attachMedia(video);
      hlsRef.current = hls;
    } else {
      video.src = currentServer.url;
    }

    if (!plyrRef.current) {
      plyrRef.current = new Plyr(video, {
        autoplay,
        settings: ['captions', 'quality', 'speed'],
        quality: {
          default: 720,
          options: servers.map((s) => Number(s.quality.replace(/\D/g, '')) || 0),
          forced: true,
          onChange: (q: number) => {
            const match = servers.find((s) => s.quality.includes(String(q)));
            if (match) setCurrentServer(match);
          },
        },
        captions: { active: !!subtitleVttUrl, update: true },
      });
    }

    if (resumeAtSeconds > 0) {
      video.currentTime = resumeAtSeconds;
    }

    // Simpan progress tonton tiap 10 detik (dipakai untuk "Riwayat Nonton" & "Sedang Ditonton")
    const progressInterval = setInterval(() => {
      if (!video.paused) {
        fetch(`${API_URL}/watch-history`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            episodeId,
            progressSeconds: Math.floor(video.currentTime),
          }),
        }).catch(() => {});
      }
    }, 10000);

    // Skip intro/outro
    const handleTimeUpdate = () => {
      if (skipIntro && video.currentTime >= skipIntro.start && video.currentTime < skipIntro.end) {
        setShowSkipIntro(true);
      } else {
        setShowSkipIntro(false);
      }
    };
    video.addEventListener('timeupdate', handleTimeUpdate);

    // Auto next episode saat video selesai
    const handleEnded = () => {
      if (nextEpisodeUrl) {
        window.location.href = nextEpisodeUrl;
      }
    };
    video.addEventListener('ended', handleEnded);

    return () => {
      clearInterval(progressInterval);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentServer]);

  useEffect(() => {
    return () => {
      plyrRef.current?.destroy();
      hlsRef.current?.destroy();
    };
  }, []);

  const submitErrorReport = async () => {
    await fetch(`${API_URL}/error-reports`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ episodeId, message: reportMessage }),
    });
    setShowReportModal(false);
    setReportMessage('');
  };

  return (
    <div className="w-full">
      <div className="relative">
        <video ref={videoRef} playsInline crossOrigin="anonymous">
          {subtitleVttUrl && (
            <track kind="subtitles" src={subtitleVttUrl} srcLang="id" label="Indonesia" default />
          )}
        </video>

        {showSkipIntro && skipIntro && (
          <button
            className="btn-primary absolute bottom-20 right-4 px-4 py-2 text-sm font-medium"
            onClick={() => {
              if (videoRef.current) videoRef.current.currentTime = skipIntro.end;
            }}
          >
            Lewati Intro
          </button>
        )}
      </div>

      {/* Ganti server */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-sm opacity-70">Server:</span>
        {servers.map((s) => (
          <button
            key={s.id}
            onClick={() => setCurrentServer(s)}
            className={`rounded px-3 py-1 text-sm ${
              currentServer?.id === s.id ? 'btn-primary' : 'bg-zinc-700 text-white'
            }`}
          >
            {s.serverName} · {QUALITY_LABEL[s.quality]}
          </button>
        ))}

        <button
          className="ml-auto rounded bg-zinc-800 px-3 py-1 text-sm text-white"
          onClick={() => setShowReportModal(true)}
        >
          🚩 Lapor Error
        </button>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="card w-full max-w-md bg-zinc-900 p-4">
            <h3 className="mb-2 font-semibold">Lapor Masalah Episode</h3>
            <textarea
              className="w-full rounded bg-zinc-800 p-2 text-sm"
              rows={4}
              placeholder="Jelaskan masalahnya (video tidak muncul, subtitle salah, dll)"
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
            />
            <div className="mt-3 flex justify-end gap-2">
              <button className="px-3 py-1 text-sm" onClick={() => setShowReportModal(false)}>
                Batal
              </button>
              <button className="btn-primary px-3 py-1 text-sm" onClick={submitErrorReport}>
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
