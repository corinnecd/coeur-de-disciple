import Image from "next/image";
import Link from "next/link";
import {
  BookOpenText,
  HeartHandshake,
  MessageCircleHeart,
  Play,
  Sparkles,
} from "lucide-react";

const practices = [
  {
    icon: BookOpenText,
    title: "Méditer",
    text: "Entrer dans la Parole avec un parcours guidé, clair et accessible.",
  },
  {
    icon: Sparkles,
    title: "Mettre en pratique",
    text: "Transformer chaque lecture en un pas concret dans la vie quotidienne.",
  },
  {
    icon: MessageCircleHeart,
    title: "Partager",
    text: "Avancer entourée, déposer une prière et célébrer chaque progrès.",
  },
];

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="hero-title">
        <Image
          src="/hero-communaute-mixte.webp"
          alt="Un groupe de femmes de différentes origines et générations partage un moment joyeux autour de la Bible"
          fill
          priority
          sizes="100vw"
          className="home-hero-image"
        />
        <div className="home-hero-shade" />

        <nav className="home-nav" aria-label="Navigation principale">
          <Link href="/" className="home-brand" aria-label="Accueil Cœur de Disciple">
            <Image
              src="/logo-coeur-de-disciple.png"
              alt=""
              width={46}
              height={46}
              className="home-brand-logo"
            />
            <span>Cœur de Disciple</span>
          </Link>
          <div className="home-nav-links">
            <a href="#vision">La vision</a>
            <a href="#parcours">Le parcours</a>
            <a href="#communaute">La communauté</a>
          </div>
          <Link href="/connexion" className="home-nav-cta">
            Se connecter
          </Link>
        </nav>

        <div className="home-hero-content">
          <p className="home-kicker home-kicker-light">Une foi qui se vit</p>
          <h1 id="hero-title">
            Grandir en Dieu.
            <span>Ensemble.</span>
          </h1>
          <p className="home-hero-copy">
            Un espace vivant pour méditer la Parole, fortifier sa foi et marcher
            avec une communauté de femmes qui s’encouragent vraiment.
          </p>
          <div className="home-hero-actions">
            <Link href="/connexion" className="home-button home-button-sun">
              Commencer mon parcours
            </Link>
            <a href="#vision" className="home-text-link">
              <span className="home-play"><Play size={14} fill="currentColor" /></span>
              Découvrir la vision
            </a>
          </div>
        </div>

        <div className="home-hero-note" aria-label="Méditation mise en avant">
          <span>Méditation du jour</span>
          <strong>Demeurer dans sa présence</strong>
          <small>Jean 15.4–5</small>
        </div>

        <div className="home-scroll-cue" aria-hidden="true">
          <span />
          Défiler pour découvrir
        </div>
      </section>

      <div className="home-ribbon" aria-hidden="true">
        <div>
          <span>Méditer</span><i>✦</i><span>S’ancrer</span><i>✦</i>
          <span>Oser</span><i>✦</i><span>Partager</span><i>✦</i>
          <span>Grandir</span><i>✦</i><span>Méditer</span><i>✦</i>
          <span>S’ancrer</span><i>✦</i><span>Oser</span><i>✦</i>
        </div>
      </div>

      <section id="vision" className="home-manifesto">
        <div className="home-section-shell home-manifesto-grid">
          <div className="home-sticky-heading">
            <p className="home-kicker">Notre vision</p>
            <h2>La foi ne se collectionne pas. Elle se vit.</h2>
            <p>
              Cœur de Disciple relie la vérité biblique au cœur, puis le cœur à
              l’action. Chaque jour devient une occasion de grandir avec grâce.
            </p>
          </div>

          <div id="parcours" className="home-practices">
            {practices.map(({ icon: Icon, title, text }) => (
              <article className="home-practice" key={title}>
                <div className="home-practice-icon"><Icon size={24} /></div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-hands" aria-labelledby="hands-title">
        <Image
          src="/mains-rencontre.webp"
          alt="Deux mains de carnations différentes s’approchent dans une lumière dorée"
          fill
          sizes="100vw"
          className="home-hands-image"
        />
        <div className="home-hands-shade" />
        <div className="home-hands-copy">
          <p className="home-kicker home-kicker-light">Une rencontre qui transforme</p>
          <h2 id="hands-title">Entre sa main et la nôtre, il y a un pas de foi.</h2>
          <p>
            Dieu ne nous appelle pas à rester spectatrices. Il nous invite à
            répondre, avancer et devenir des disciples qui portent sa lumière.
          </p>
          <a href="#communaute" className="home-button home-button-outline">
            Faire ce premier pas
          </a>
        </div>
      </section>

      <section id="communaute" className="home-community">
        <div className="home-section-shell">
          <div className="home-community-heading">
            <div>
              <p className="home-kicker">Une communauté vivante</p>
              <h2>Différentes histoires. Un même élan.</h2>
            </div>
            <p>
              Ici, la diversité est une force. Les générations, les cultures et
              les parcours se rencontrent pour apprendre, prier et avancer ensemble.
            </p>
          </div>

          <div className="home-community-stage">
            <div className="home-community-photo">
              <Image
                src="/hero-communaute-mixte.webp"
                alt="Des femmes de différentes générations rient et partagent un moment de foi"
                fill
                sizes="(max-width: 768px) 100vw, 68vw"
                className="home-community-image"
              />
              <div className="home-photo-label">
                <HeartHandshake size={22} />
                <span><strong>Avancer ensemble</strong>Sans comparaison. Avec bienveillance.</span>
              </div>
            </div>

            <aside className="home-journey-card" aria-label="Exemple de parcours dans l’application">
              <p className="home-card-label">Votre espace</p>
              <h3>Un chemin simple, jour après jour.</h3>
              <div className="home-card-progress"><span /></div>
              <ul>
                <li><span>01</span><strong>Lire</strong><small>Un passage essentiel</small></li>
                <li><span>02</span><strong>Écouter</strong><small>Ce que Dieu révèle</small></li>
                <li><span>03</span><strong>Agir</strong><small>Un pas concret aujourd’hui</small></li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="home-final-cta">
        <div className="home-final-orbit" aria-hidden="true" />
        <div className="home-final-content">
          <p className="home-kicker home-kicker-light">Prête à commencer ?</p>
          <h2>Votre prochain pas peut changer toute la suite.</h2>
          <p>Rejoignez Cœur de Disciple et commencez un parcours qui s’incarne dans votre quotidien.</p>
          <Link href="/connexion" className="home-button home-button-ivory">
            Rejoindre la communauté
          </Link>
        </div>
      </section>
    </main>
  );
}
