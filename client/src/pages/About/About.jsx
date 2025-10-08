import useAppContent from '../../hooks/useAppContent.js';
import './about.styles.scss';

const About = () => {
  const { data } = useAppContent();
  const mission = data?.brand?.mission;
  const privacyMessage = "All edits happen in your browser.";

  return (
    <div className="about-page">
      <section className="about-section">
        <h1 className="about-title">Why GlowFix?</h1>
        <p className="about-copy">{mission}</p>
      </section>
      <section className="about-section">
        <h2 className="about-subtitle">Privacy first</h2>
        <p className="about-copy">{privacyMessage}</p>
      </section>
      <section className="about-section">
        <h2 className="about-subtitle">FAQ</h2>
        <details className="about-faq" open>
          <summary className="about-question">How does smoothing work?</summary>
          <p className="about-answer">GlowFix uses a canvas-based blur stack to gently blend skin textures while keeping edges crisp.</p>
        </details>
        <details className="about-faq">
          <summary className="about-question">Is my photo uploaded?</summary>
          <p className="about-answer">No. Everything runs locally on your device. When you close the tab, your photo is gone.</p>
        </details>
      </section>
    </div>
  );
};

export default About;
