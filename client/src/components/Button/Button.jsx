import { Link } from 'react-router-dom';
import './button.styles.scss';

const Button = ({ onClick, children, variant = 'primary', type = 'button', disabled = false, to }) => {
  const className = `app-button app-button-${variant}`;
  if (to) {
    return (
      <Link to={to} className={className} aria-disabled={disabled ? 'true' : 'false'}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
