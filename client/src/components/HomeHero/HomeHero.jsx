import useAppContent from '../../hooks/useAppContent.js';
import Button from '../Button/Button.jsx';
import './home-hero.styles.scss';

const HomeHero = () => {
  const { data } = useAppContent();
  const brand = data?.brand;
  const project = data?.project;

  return (
    <section className="home-hero">
      <div className="hero-copy">
        <h1 className="hero-title">{brand?.tagline}</h1>
        <p className="hero-subtitle">{project?.description}</p>
        <div className="hero-actions">
          <Button variant="primary" to="/editor">
            Launch Editor
          </Button>
          <Button variant="outline" to="/about">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
