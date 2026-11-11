"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [finished, setFinished] = useState(false);

  const [docked, setDocked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!finished) return;
    const timer = window.setTimeout(() => setDocked(true), 1450);
    return () => window.clearTimeout(timer);
  }, [finished]);

  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context) return;

    // Decode offscreen so the browser never overlays playback controls on the hero.
    const decoder = document.createElement("video");
    decoder.muted = true;
    decoder.playsInline = true;
    decoder.preload = "auto";
    let frame = 0;
    let startTime = 0;
    let previousTime = -1;
    let done = false;
    let timeout = 0;

    function finish() {
      done = true;
      decoder.pause();
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
      setFinished(true);
    }

    function render(now: number) {
      if (done || !context) return;
      if (decoder.readyState >= 2 && !decoder.seeking) {
        if (!startTime) startTime = now;
        if (previousTime !== decoder.currentTime) {
          context.drawImage(decoder, 0, 0, 1080, 1080);
          previousTime = decoder.currentTime;
        }
        const elapsed = (now - startTime) / 1000;
        if (decoder.ended || elapsed >= decoder.duration) {
          finish();
          return;
        }
        if (elapsed - decoder.currentTime > 0.1) decoder.currentTime = elapsed;
      }
      frame = requestAnimationFrame(render);
    }

    function start() {
      done = false;
      previousTime = -1;
      startTime = 0;
      setFinished(false);
      setDocked(false);
      setMenuOpen(false);
      context?.clearRect(0, 0, 1080, 1080);
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
      decoder.load();
      void decoder.play().catch(() => { /* render advances frames when autoplay is blocked */ });
      frame = requestAnimationFrame(render);
      timeout = window.setTimeout(finish, 18000);
    }

    function restore(event: PageTransitionEvent) {
      if (event.persisted) start();
    }
    decoder.src = "/atelier-intro.mp4";
    decoder.addEventListener("error", finish);
    window.addEventListener("pageshow", restore);
    start();
    return () => {
      done = true;
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
      decoder.removeEventListener("error", finish);
      window.removeEventListener("pageshow", restore);
      decoder.pause();
      decoder.removeAttribute("src");
      decoder.load();
    };
  }, []);

  return (
    <main id="uvod" data-docked={docked}>
      <a className="wordmark" data-visible={finished} href="#uvod" inert={!finished}>VOKALOVA.ARCHI</a>
      <div className="site-menu" hidden={!docked} onKeyDown={event => {
        if (event.key === "Escape") {
          setMenuOpen(false);
          menuButton.current?.focus();
        }
      }}>
        <button ref={menuButton} aria-expanded={menuOpen} aria-controls="navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Zavřít" : "Menu"}</button>
        <nav id="navigation" aria-label="Hlavní navigace" hidden={!menuOpen} onClick={() => setMenuOpen(false)}>
          <a href="#atelier">Ateliér</a><a href="#spoluprace">Spolupráce</a><a href="#projekty">Projekty</a><a href="#kontakt">Kontakt</a>
        </nav>
      </div>
      <section className="landing-page" data-finished={finished}>
        <canvas ref={canvas} width={1080} height={1080} className="intro-video" aria-hidden="true" />
      <div className="welcome" inert={!finished} data-playing={!finished}>
        <div className="welcome-title">

          <h1>Vítejte</h1>
        </div>
      </div>
      </section>
      <section className="editorial" id="atelier">
        <h2>Ateliér</h2>
        <div><h3>Romana Vokálová</h3><p>Architektura a interiéry.</p>
        <a href="https://www.instagram.com/vokalova.archi/">Instagram @vokalova.archi ↗</a></div>
      </section>
      <section className="editorial" id="spoluprace">
        <h2>Spolupráce</h2>
        <div><h3>První setkání</h3><p>Jaký prostor řešíte a co by se v něm mělo změnit? Napište pár slov o své představě. Pokud máte půdorys nebo fotografie, můžete je přiložit.</p><a href="#kontakt">Spojit se s ateliérem ↓</a></div>
      </section>
      <section className="editorial" id="projekty">
        <h2>Projekty</h2>
        <Link className="project-card" href="/projekty/obytny-interier">
          <Image src="/atelier-final.jpg" width={2160} height={2160} alt="Obytný prostor s kamenným kuchyňským ostrůvkem a nízkými stolky" sizes="(max-width: 700px) 92vw, 65vw" />
          <span>Obytný interiér ↗</span><small>Vizualizace</small>
        </Link>
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
