import { NavLink } from 'react-router-dom';
import useAppContent from '../../hooks/useAppContent.js';
import './header.styles.scss';

const Header = () => {
  const { data } = useAppContent();
  const brandName = data?.brand?.name ?? 'GlowFix';
  const pages = data?.uiSpec?.pages ?? [];

  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <NavLink to="/" className="header-brand" aria-label={`${brandName} home`}>
          <span className="brand-mark">{brandName.toLowerCase()}</span>
          <span className="brand-dot" aria-hidden="true" />
        </NavLink>
        <nav aria-label="Primary" className="header-nav">
          <ul className="header-nav-list">
            {pages.map((page) => (
              <li key={page.path} className="header-nav-item">
                <NavLink
                  to={page.path}
                  className={({ isActive }) => (isActive ? 'header-nav-link is-active' : 'header-nav-link')}
                >
                  {page.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
