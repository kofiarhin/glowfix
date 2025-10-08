import HomeHero from '../../components/HomeHero/HomeHero.jsx';
import './home.styles.scss';

const Home = () => {
  return (
    <div className="home-page">
      <HomeHero />
      <section className="home-highlights">
        <article className="highlight-card">
          <h2 className="highlight-title">Private by design</h2>
          <p className="highlight-copy">GlowFix runs entirely in your browser — zero uploads, zero waiting.</p>
        </article>
        <article className="highlight-card">
          <h2 className="highlight-title">Cinematic finish</h2>
          <p className="highlight-copy">Adjust smoothing with precision controls tuned for portraits.</p>
        </article>
        <article className="highlight-card">
          <h2 className="highlight-title">Ready in seconds</h2>
          <p className="highlight-copy">Upload, polish, and download in moments with canvas acceleration.</p>
        </article>
      </section>
    </div>
  );
};

export default Home;
