import Image from "next/image";

export default function Home() {
  return (
    <main className="landing-page">
      <Image
        src="/uvodni-stranka.png"
        alt="Vokalova.archi – nový web právě připravujeme"
        fill
        priority
        sizes="100vw"
        className="landing-image"
      />
    </main>
  );
}
