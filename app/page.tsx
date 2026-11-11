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

  function start(restart: boolean) {
    const player = video.current;
    if (!player) return;
    player.muted = true;
    if (restart) player.currentTime = 0;
    if (player.ended && !restart) { setPlaying(false); return; }
    void player.play().catch(() => setFallback(true));
  }

  useEffect(() => {
    function begin(restart = false) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        video.current?.pause();
        setPlaying(false);
      } else {
        start(restart);
      }
    }
    function restore(event: PageTransitionEvent) {
      if (event.persisted) begin(true);
    }
    const frame = requestAnimationFrame(() => begin());
    window.addEventListener("pageshow", restore);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pageshow", restore);
    };
  }, []);

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
