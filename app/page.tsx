import Image from "next/image";

const menuItems = ["ARCHITEKTURA", "INTERIÉRY", "LIDÉ", "PROSTOR"];

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.2 3.5 5.7 2.3a1.6 1.6 0 0 0-2 .7c-2.4 4.9 3.4 14.8 11.9 18.3a1.7 1.7 0 0 0 2-.5l2-2.5a1.6 1.6 0 0 0-.3-2.3l-3.5-2.6a1.6 1.6 0 0 0-2.1.2l-1.3 1.4c-2.4-1.3-4.1-3.2-5.2-5.7l1.5-1.1a1.6 1.6 0 0 0 .5-2Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="landing-page">
      <Image
        src="/interier-pozadi.png"
        alt="Moderní interiér kuchyně a obývacího prostoru"
        fill
        priority
        sizes="100vw"
        className="landing-image"
      />

      <div className="page-content">
        <header className="site-header">
          <div className="brand" aria-label="Vokalova.archi">
            VOKALOVA.ARCHI
          </div>

          <nav className="site-nav" aria-label="Hlavní navigace">
            {menuItems.map((item, index) => (
              <span className="nav-group" key={item}>
                <button type="button" className="nav-item">
                  {item}
                </button>
                {index < menuItems.length - 1 && (
                  <span className="nav-separator" aria-hidden="true">
                    /
                  </span>
                )}
              </span>
            ))}
          </nav>
        </header>

        <section className="hero" aria-labelledby="hero-title">
          <h1 id="hero-title">
            Nový web
            <br />
            právě připravujeme.
          </h1>
          <span className="accent-line" aria-hidden="true" />
          <p className="intro">
            Mezitím se mi můžete ozvat.
            <br />
            Ráda proberu vaše představy
            <br />
            o prostoru, který dává smysl.
          </p>

          <address className="contacts">
            <a href="mailto:hello@vokalova.archi">
              <MailIcon />
              <span>hello@vokalova.archi</span>
            </a>
            <a href="tel:+420608505478">
              <PhoneIcon />
              <span>608 505 478</span>
            </a>
          </address>
        </section>

        <footer className="site-footer">
          <div className="signature">
            <strong>Romana Vokálová</strong>
            <span>ARCHITEKTURA &amp; INTERIÉRY</span>
          </div>
          <div className="coming-soon">
            <span>BRZY ZDE BUDE VÍCE</span>
            <i aria-hidden="true" />
          </div>
        </footer>
      </div>
    </main>
  );
}
