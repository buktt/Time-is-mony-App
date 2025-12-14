import { CURRENCIES } from '../../types';
import './CurrencyPicker.css';

interface CurrencyPickerProps {
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

export const CurrencyPicker = ({ currency, onCurrencyChange }: CurrencyPickerProps) => {
  return (
    <div className="currency-picker">
      <span className="settings-section-title">Currency</span>
      <div className="currency-grid">
        {CURRENCIES.map((c) => (
          <button
            key={c.code}
            className={`currency-option ${currency === c.code ? 'selected' : ''}`}
            onClick={() => onCurrencyChange(c.code)}
          >
            <span className="currency-symbol">{c.symbol}</span>
            <span className="currency-code">{c.code}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

