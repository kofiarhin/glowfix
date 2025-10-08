import './slider-control.styles.scss';

const SliderControl = ({ value, min, max, step, onChange, disabled = false }) => {
  return (
    <div className="slider-control">
      <label className="slider-label" htmlFor="smoothness-slider">
        Smoothness
      </label>
      <input
        id="smoothness-slider"
        className="slider-input"
        type="range"
        aria-label="Smoothness"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        disabled={disabled}
      />
      <span className="slider-value" aria-live="polite">{value}</span>
    </div>
  );
};

export default SliderControl;
