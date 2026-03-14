import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

interface StepCreateAccountProps {
  fullName: string;
  setFullName: (v: string) => void;
  laboratory: string;
  setLaboratory: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  onContinue: () => void;
}

const CheckIcon: React.FC = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export const StepCreateAccount: React.FC<StepCreateAccountProps> = ({
  fullName,
  setFullName,
  laboratory,
  setLaboratory,
  email,
  setEmail,
  onContinue,
}) => {
  const isNameValid = fullName.trim().length >= 2;
  const isLabValid = laboratory.trim().length >= 2;
  const isEmailValid = useMemo(() => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  }, [email]);

  const canContinue = isNameValid && isLabValid && isEmailValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canContinue) onContinue();
  };

  return (
    <div className="step-create">
      <h1 className="step-create__title">Crea tu cuenta</h1>
      <p className="step-create__subtitle">
        Introduzca sus datos de contacto para comenzar el registro en el sistema.
      </p>

      <form className="step-create__form" onSubmit={handleSubmit} noValidate>
        {/* Nombre completo */}
        <div className="reg-field">
          <label className="reg-field__label reg-field__label--required">
            Nombre completo
          </label>
          <div className="reg-field__input-wrap">
            <input
              className={`reg-field__input ${isNameValid ? 'reg-field__input--valid' : ''}`}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Elena Mendoza GarcÃ­a"
              autoComplete="name"
              autoFocus
            />
            {isNameValid && (
              <span className="reg-field__check">
                <CheckIcon />
              </span>
            )}
          </div>
        </div>

        {/* Nombre del centro */}
        <div className="reg-field">
          <label className="reg-field__label reg-field__label--required">
            Nombre del centro en el que opera
          </label>
          <div className="reg-field__input-wrap">
            <input
              className={`reg-field__input ${isLabValid ? 'reg-field__input--valid' : ''}`}
              type="text"
              value={laboratory}
              onChange={(e) => setLaboratory(e.target.value)}
              placeholder="BiomeSense"
              autoComplete="organization"
            />
            {isLabValid && (
              <span className="reg-field__check">
                <CheckIcon />
              </span>
            )}
          </div>
        </div>

        {/* Correo corporativo */}
        <div className="reg-field">
          <label className="reg-field__label reg-field__label--required">
            Correo corporativo
          </label>
          <div className="reg-field__input-wrap">
            <input
              className={`reg-field__input ${isEmailValid ? 'reg-field__input--valid' : ''}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ContraseÃ±a"
              autoComplete="email"
            />
            {isEmailValid && (
              <span className="reg-field__check">
                <CheckIcon />
              </span>
            )}
          </div>
          {isEmailValid && (
            <span className="reg-field__hint">Coincide (respuesta tiempo real)</span>
          )}
        </div>

        {/* Continue button */}
        <button className="reg-btn" type="submit" disabled={!canContinue}>
          Continuar
        </button>
      </form>

      {/* Login link */}
      <p className="step-create__login-link">
        Â¿Ya tiene cuenta?
        <Link to="/login">Accede aquÃ­</Link>
      </p>
    </div>
  );
};
