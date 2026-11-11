"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    let active = true;
    function finish() {
      if (active) {
        setPlaying(false);
        player?.pause();
      }
    }

    const timeout = window.setTimeout(finish, 6500);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = requestAnimationFrame(() => {
      if (reducedMotion) return finish();
      player.muted = true;
      player.src = "/padani.mp4";
      void player.play().catch(finish);
    });

    return () => {
      active = false;
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main>
      <section className="landing-page">
      <video hidden={!playing} ref={video} className="intro-video" muted playsInline aria-hidden="true"
        onEnded={() => setPlaying(false)}
        onError={() => setPlaying(false)} />

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
