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

  function start() {
    const player = video.current;
    if (!player) return;
    player.muted = true;
    player.currentTime = 0;
    void player.play().catch(() => setFallback(true));
  }

  useEffect(() => {
    function begin() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setPlaying(false);
      } else {
        start();
      }
    }
    function restore(event: PageTransitionEvent) {
      if (event.persisted) begin();
    }
    const frame = requestAnimationFrame(begin);
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
      <video ref={video} className="intro-video"
        poster="/uvod-start.jpg" preload="auto" muted playsInline aria-hidden="true"
        onPlaying={() => setPlaying(true)} onEnded={() => setPlaying(false)}
        onError={() => setFallback(true)}>
        <source src="/uvod-5s.mp4" media="(max-width: 600px) and (max-resolution: 1dppx)" type="video/mp4" />
        <source src="/uvod-hd.mp4" type="video/mp4" onError={() => setFallback(true)} />
      </video>
      )}

      <div className="welcome" inert={playing} data-playing={playing}>
        <a className="contact-link" href="#kontakt">Kontakt</a>
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
