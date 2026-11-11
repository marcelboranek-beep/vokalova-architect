"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [finished, setFinished] = useState(false);

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
    <main>
      <section className="landing-page" data-finished={finished}>
        <canvas ref={canvas} width={1080} height={1080} className="intro-video" aria-hidden="true" />
      <div className="welcome" inert={!finished} data-playing={!finished}>
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
