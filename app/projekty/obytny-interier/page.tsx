import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Obytný interiér | Vokalova.archi" };

export default function Interior() {
  return (
    <main className="project-detail">
      <header><Link href="/#projekty">← Projekty</Link><Link href="/">VOKALOVA.ARCHI</Link></header>
      <h1>Obytný interiér</h1>
      <p>Vizualizace otevřeného prostoru propojuje kuchyň s obývací částí. Výrazná kresba kamene na ostrůvku se opakuje na zadní stěně kuchyně.</p>
      <Image src="/atelier-final.jpg" alt="Celkový pohled na kuchyň a posezení v obytném interiéru" width={2160} height={2160} sizes="90vw" />
      <Link href="/#kontakt">Kontaktovat ateliér ↗</Link>
    </main>
  );
}
