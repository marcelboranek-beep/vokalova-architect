"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  function start() {
    const player = video.current;
    if (!player) return;
    player.muted = true;
    player.currentTime = 0;
    void player.play().catch(() => setPlaying(false));
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
      <video ref={video} className="intro-video" src="/uvod-5s.mp4"
        poster="/uvod-start.jpg" preload="auto" muted playsInline aria-hidden="true"
        onPlaying={() => setPlaying(true)} onEnded={() => setPlaying(false)}
        onError={() => setPlaying(false)} onPause={() => setPlaying(false)} />

      <div className="welcome" inert={playing} data-playing={playing}>
        <button className="replay" type="button" onClick={start}>Přehrát animaci</button>
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
