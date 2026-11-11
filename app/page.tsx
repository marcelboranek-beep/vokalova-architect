"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!loaded) return;
    const timeout = window.setTimeout(() => setPlaying(false), 5000);
    return () => clearTimeout(timeout);
  }, [loaded]);

  return (
    <main>
      <section className="landing-page">
      <picture>
        <source media="(prefers-reduced-motion: reduce)" srcSet="/interier-final.jpg" />
        <Image src="/interier-animace.webp" alt="" fill unoptimized loading="eager"
        fetchPriority="high" className="intro-video"
        onLoad={() => {
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
          else setLoaded(true);
        }} onError={() => setPlaying(false)} />
      </picture>

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
