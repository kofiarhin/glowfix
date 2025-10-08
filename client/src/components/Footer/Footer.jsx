import useAppContent from '../../hooks/useAppContent.js';
import './footer.styles.scss';

const Footer = () => {
  const { data } = useAppContent();
  const mission = data?.brand?.mission ?? '';
  const domain = data?.brand?.domain ?? '';

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-brand">{mission}</p>
        <p className="footer-meta">© {new Date().getFullYear()} {domain}</p>
      </div>
    </footer>
  );
};

export default Footer;
