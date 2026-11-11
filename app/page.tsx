"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  const [fallback, setFallback] = useState(false);
  const [fallbackLoaded, setFallbackLoaded] = useState(false);

  useEffect(() => {
    if (!fallbackLoaded) return;
    const timer = window.setTimeout(() => setPlaying(false), 5000);
    return () => clearTimeout(timer);
  }, [fallbackLoaded]);

  useEffect(() => {
    const player = video.current;
    if (!player || fallback) return;

    let timer = 0;
    let manuallySeeking = false;
    let lastTime = player.currentTime;
    let lastAdvance = performance.now();
    let lastTick = lastAdvance;
    let lastSeek = lastAdvance;

    function watch() {
      if (!player || document.hidden) return;
      const now = performance.now();
      const delta = Math.min((now - lastTick) / 1000, 0.15);
      lastTick = now;

      if (player.ended || (manuallySeeking && player.currentTime >= player.duration - 0.04)) {
        setPlaying(false);
        window.clearInterval(timer);
        return;
      }
      if (player.readyState < 2 || !Number.isFinite(player.duration)) return;

      if (lastTime !== player.currentTime) {
        lastTime = player.currentTime;
        lastAdvance = now;
      }
      if (!manuallySeeking && now - lastAdvance > 800) {
        manuallySeeking = true;
        player.pause();
        lastSeek = now;
      }
      if (manuallySeeking && !player.seeking) {
        player.currentTime = Math.min(player.duration - 0.02, player.currentTime + delta);
        lastSeek = now;
      } else if (manuallySeeking && now - lastSeek > 2000) {
        setFallback(true);
      }
    }

    function begin() {
      if (!player) return;
      setPlaying(true);
      manuallySeeking = false;
      lastAdvance = lastTick = lastSeek = performance.now();
      player.muted = true;
      void player.play().catch(() => {
        // Seeking can display successive frames even when Safari blocks autoplay.
        manuallySeeking = true;
        lastSeek = performance.now();
      });
      window.clearInterval(timer);
      timer = window.setInterval(watch, 50);
    }

    function restore(event: PageTransitionEvent) {
      if (event.persisted && player) {
        player.currentTime = 0;
        begin();
      }
    }
    begin();
    window.addEventListener("pageshow", restore);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("pageshow", restore);
    };
  }, [fallback]);

  return (
    <main>
      <section className="landing-page">
      {fallback ? (
        <Image src="/interier-animace.webp" alt="" fill unoptimized loading="eager" className="intro-video"
          onLoad={() => setFallbackLoaded(true)} onError={() => setPlaying(false)} />
      ) : (
      <video ref={video} className="intro-video" autoPlay src="/uvod-hd.mp4"
        poster="/uvod-start.jpg" preload="auto" muted playsInline aria-hidden="true"
        onPlaying={() => setPlaying(true)} onEnded={() => setPlaying(false)}
        onError={() => setFallback(true)} />
      )}

      <div className="welcome" inert={playing} data-playing={playing}>
        <div className="welcome-title">
          <div className="brand">VOKALOVA.ARCHI</div>
          <h1>Vítejte</h1>
        </div>
      </div>
      </section>
      <footer id="kontakt" aria-labelledby="kontakt-title">
        <h2 id="kontakt-title">Kontakt</h2>
        <address>
          <span>Romana Vokálová</span>
          <a href="mailto:hello@vokalova.archi">hello@vokalova.archi</a>
          <a href="tel:+420608505478">608 505 478</a>
        </address>
      </footer>
    </main>
  );
}
