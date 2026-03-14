import React, { useState, useCallback, useMemo } from 'react';

interface StepPasswordProps {
  email: string;
  onSubmit: (password: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}

type Strength = 'empty' | 'weak' | 'fair' | 'good' | 'excellent';

const STRENGTH_LABELS: Record<Strength, string> = {
  empty: '',
  weak: 'Débil',
  fair: 'Regular',
  good: 'Buena',
  excellent: 'Excelente',
};

const EyeOpen = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2.5 10s3-6 7.5-6 7.5 6 7.5 6-3 6-7.5 6-7.5-6-7.5-6z" />
    <circle cx="10" cy="10" r="2.5" />
  </svg>
);

const EyeClosed = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2.5 10s3-6 7.5-6 7.5 6 7.5 6-3 6-7.5 6-7.5-6-7.5-6z" />
    <circle cx="10" cy="10" r="2.5" />
    <line x1="3" y1="3" x2="17" y2="17" />
  </svg>
);

const CheckMark = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
      clipRule="evenodd"
    />
  </svg>
);

export const StepPassword: React.FC<StepPasswordProps> = ({
  onSubmit,
  onBack,
  isLoading,
  error,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validation = useMemo(
    () => ({
      minLength: password.length >= 12,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[^A-Za-z0-9]/.test(password),
    }),
    [password],
  );

  const passedCount = Object.values(validation).filter(Boolean).length;

  const strength: Strength = useMemo(() => {
    if (passedCount === 0) return 'empty';
    if (passedCount === 1) return 'weak';
    if (passedCount === 2) return 'fair';
    if (passedCount === 3) return 'good';
    return 'excellent';
  }, [passedCount]);

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const allValid = passedCount === 4;
  const canSubmit = allValid && passwordsMatch && termsAccepted && !isLoading;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;
      await onSubmit(password);
    },
    [canSubmit, password, onSubmit],
  );

  return (
    <div className="step-password">
      <h1 className="step-password__title">Configure su contraseña</h1>
      <p className="step-password__subtitle">
        Establezca una contraseña segura para acceder a la información de su cuenta.
      </p>

      {error && <div className="reg-error-banner">{error}</div>}

      <form className="step-password__form" onSubmit={handleSubmit} noValidate>
        <div className="reg-field">
          <label className="reg-field__label reg-field__label--required">
            Contraseña
          </label>
          <div className="reg-field__input-wrap">
            <input
              className="reg-field__input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              autoComplete="new-password"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="button"
              className="reg-field__toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOpen /> : <EyeClosed />}
            </button>
          </div>

          {password.length > 0 && (
            <div className="strength-meter">
              <div className="strength-meter__row">
                {[1, 2, 3, 4].map((seg) => (
                  <div
                    key={seg}
                    className={`strength-meter__bar ${
                      seg <= passedCount ? 'strength-meter__bar--filled' : ''
                    }`}
                    data-level={seg <= passedCount ? strength : undefined}
                  />
                ))}
                <span className="strength-meter__text">
                  Seguridad: <strong data-level={strength}>{STRENGTH_LABELS[strength]}</strong>
                </span>
              </div>
            </div>
          )}

          <div className="validation-list">
            {([
              { key: 'minLength' as const, label: '12 caracteres' },
              { key: 'hasUppercase' as const, label: '1 mayúscula' },
              { key: 'hasNumber' as const, label: '1 número' },
              { key: 'hasSymbol' as const, label: '1 carácter especial' },
            ] as const).map(({ key, label }) => (
              <div
                key={key}
                className={`validation-list__item ${
                  validation[key] ? 'validation-list__item--pass' : ''
                }`}
              >
                {validation[key] ? <CheckMark /> : <svg viewBox="0 0 16 16" fill="none" />}
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="reg-field">
          <label className="reg-field__label reg-field__label--required">
            Repetir contraseña
          </label>
          <div className="reg-field__input-wrap">
            <input
              className={`reg-field__input ${
                confirmPassword.length > 0 && !passwordsMatch
                  ? 'reg-field__input--error'
                  : ''
              }`}
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Contraseña"
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="reg-field__toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
              aria-label={showConfirmPassword ? 'Ocultar' : 'Mostrar'}
            >
              {showConfirmPassword ? <EyeOpen /> : <EyeClosed />}
            </button>
          </div>
          {confirmPassword.length > 0 && passwordsMatch && (
            <span className="reg-field__hint">Coincide (respuesta tiempo real)</span>
          )}
          {confirmPassword.length > 0 && !passwordsMatch && (
            <span className="reg-field__hint reg-field__hint--error">
              Las contraseñas no coinciden
            </span>
          )}
        </div>

        <div className="reg-terms">
          <input
            className="reg-terms__checkbox"
            type="checkbox"
            id="reg-terms-check"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            disabled={isLoading}
          />
          <label className="reg-terms__text" htmlFor="reg-terms-check">
            He leído y acepto la{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Política de Privacidad
            </a>{' '}
            y los{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Términos de Servicio
            </a>
          </label>
        </div>

        <button className="reg-btn" type="submit" disabled={!canSubmit}>
          {isLoading && <span className="reg-btn__spinner" />}
          {isLoading ? 'Activando...' : 'Activar y entrar'}
        </button>
      </form>

      <button
        className="step-password__back"
        onClick={onBack}
        type="button"
        disabled={isLoading}
      >
        <svg viewBox="0 0 16 16" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M11.354 1.646a.5.5 0 010 .708L5.707 8l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z"
            clipRule="evenodd"
          />
        </svg>
        Volver a <strong>Información de cuenta</strong>
      </button>
    </div>
  );
};
