import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { StepCreateAccount } from './Stepcreateaccount';
import { StepPassword } from './Steppassword';
import { StepVerifyEmail } from './Stepverifyemail';
import { api } from '../../services/api';
import './RegisterPage.css';

export interface RegisterFormData {
  fullName: string;
  laboratory: string;
  email: string;
  password: string;
}

export const RegisterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Step 1 data
  const [fullName, setFullName] = useState('');
  const [laboratory, setLaboratory] = useState('');
  const [email, setEmail] = useState('');

  // Step 2 data
  const [password, setPassword] = useState('');

  const handleStep1Continue = useCallback(() => {
    setCurrentStep(2);
    setServerError(null);
  }, []);

  const handleStep2Back = useCallback(() => {
    setCurrentStep(1);
    setServerError(null);
  }, []);

  const handleStep2Submit = useCallback(
    async (pwd: string) => {
      setPassword(pwd);
      setIsLoading(true);
      setServerError(null);

      try {
        await api.register({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password: pwd,
          laboratory: laboratory.trim() || undefined,
        });

        // Registration successful â†’ show email verification step
        setCurrentStep(3);
      } catch (err: any) {
        const msg =
          err?.message || 'Ha ocurrido un error al crear tu cuenta. IntÃ©ntalo de nuevo.';
        setServerError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [fullName, laboratory, email],
  );

  const handleResendEmail = useCallback(async () => {
    // TODO: implement resend verification email endpoint
    // For now this is a placeholder
  }, [email]);

  return (
    <div className="register-page">
      {/* Header */}
      <header className="register-header">
        <Link to="/login" className="register-header__logo">
          <svg
            className="register-header__logo-icon"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="8" fill="#1a2b6d" />
            <circle cx="16" cy="12" r="4" fill="#fff" opacity="0.9" />
            <circle cx="10" cy="20" r="3" fill="#fff" opacity="0.7" />
            <circle cx="22" cy="20" r="3" fill="#fff" opacity="0.7" />
            <circle cx="16" cy="24" r="2" fill="#fff" opacity="0.5" />
          </svg>
          <span className="register-header__logo-text">Biotasys</span>
        </Link>

        <div className="register-header__right">
          <button className="register-header__help-btn" title="Ayuda" aria-label="Ayuda">
            ?
          </button>
          <button className="register-header__lang-btn" aria-label="Cambiar idioma">
            EspaÃ±ol
            <svg
              className="register-header__lang-chevron"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M4.427 6.427a.75.75 0 011.06-.073L8 8.574l2.513-2.22a.75.75 0 11.994 1.123l-3 2.651a.75.75 0 01-.994 0l-3-2.651a.75.75 0 01-.086-1.077z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="register-content">
        <div className="register-card">
          {/* Stepper â€” only show for steps 1 & 2 */}
          {currentStep !== 3 && (
            <div
              className="register-stepper"
              role="progressbar"
              aria-valuenow={currentStep}
              aria-valuemin={1}
              aria-valuemax={2}
            >
              <div
                className={`register-stepper__bar ${
                  currentStep >= 1 ? 'register-stepper__bar--active' : ''
                }`}
              />
              <div
                className={`register-stepper__bar ${
                  currentStep >= 2 ? 'register-stepper__bar--active' : ''
                }`}
              />
            </div>
          )}

          {/* Step 1 */}
          {currentStep === 1 && (
            <StepCreateAccount
              fullName={fullName}
              setFullName={setFullName}
              laboratory={laboratory}
              setLaboratory={setLaboratory}
              email={email}
              setEmail={setEmail}
              onContinue={handleStep1Continue}
            />
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <StepPassword
              email={email}
              onSubmit={handleStep2Submit}
              onBack={handleStep2Back}
              isLoading={isLoading}
              error={serverError}
            />
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <StepVerifyEmail email={email} onResend={handleResendEmail} />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="register-footer">
        <div className="register-footer__links">
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            TÃ©rminos
          </a>
          <span className="register-footer__sep">|</span>
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            PolÃ­tica de privacidad
          </a>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;
