import Image from "next/image";
import Link from "next/link";
import { AuthPanel } from "./auth-panel";

export default function SignInPage() {
  return <main className="auth-visual-page">
    <Image src="/hero-communaute-mixte.webp" alt="Un groupe de jeunes femmes partage un moment joyeux autour de la Bible" fill priority sizes="100vw" className="auth-visual-image" />
    <div className="auth-visual-shade" />
    <Link href="/" className="auth-visual-brand"><Image src="/logo-coeur-de-disciple.png" alt="" width={54} height={54}/><span>Cœur de Disciple</span></Link>
    <section className="auth-visual-story" aria-label="Présentation"><p className="home-kicker home-kicker-light">Enracinées dans la Parole</p><h2>Un espace pour grandir.<br/><em>Jamais seule.</em></h2><p>Retrouvez un rythme qui vous ressemble et une communauté qui vous porte.</p><blockquote>« Demeurez en moi, et je demeurerai en vous. » <span>Jean 15.4</span></blockquote></section>
    <section className="auth-panel-wrap"><AuthPanel /></section>
  </main>;
}
