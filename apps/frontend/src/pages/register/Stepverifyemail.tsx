import React, { useState, useCallback } from 'react';

interface StepVerifyEmailProps {
  email: string;
  onResend: () => Promise<void>;
}

export const StepVerifyEmail: React.FC<StepVerifyEmailProps> = ({ email, onResend }) => {
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = useCallback(async () => {
    setIsResending(true);
    try {
      await onResend();
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } finally {
      setIsResending(false);
    }
  }, [onResend]);

  return (
    <div className="step-verify">
      <div className="step-verify__card">
        <h1 className="step-verify__title">Revise su correo electrónico</h1>

        <p className="step-verify__text">
          Le hemos enviado un enlace de verificación a{' '}
          <a className="step-verify__email-link" href={`mailto:${email}`}>
            {email}
          </a>{' '}
          <span style={{ verticalAlign: 'super', fontSize: '10px', color: '#1a2b6d' }}>↗</span>{' '}
          Utilice el botón del correo para activar su cuenta.
        </p>

        <p className="step-verify__hint">
          Si no lo encuentra, revise la carpeta de spam o correo no deseado.
        </p>

        <button
          className="step-verify__resend-btn"
          onClick={handleResend}
          disabled={isResending}
        >
          {isResending ? 'Enviando...' : resent ? '¡Correo reenviado!' : 'Reenviar correo'}
        </button>
      </div>
    </div>
  );
};
