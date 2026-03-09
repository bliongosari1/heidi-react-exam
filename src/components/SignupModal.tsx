import React from 'react';
import './SignupModal.css';

interface SignupModalProps {
  isOpen: boolean;
  onSignUp: () => void;
  onClose?: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onSignUp, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="signup-modal-overlay">
      <div className="signup-modal">
        <div className="signup-modal-logo">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="24" fill="#FEF3C7"/>
            <path d="M24 12C18.5 12 14 16.5 14 22C14 27.5 18.5 32 24 32C29.5 32 34 27.5 34 22C34 16.5 29.5 12 24 12ZM24 28C20.7 28 18 25.3 18 22C18 18.7 20.7 16 24 16C27.3 16 30 18.7 30 22C30 25.3 27.3 28 24 28Z" fill="#EAB308"/>
          </svg>
        </div>

        <h2 className="signup-modal-title">Keep your clinical research connected</h2>
        <p className="signup-modal-subtitle">
          Stay organised across your evidence, notes and answer history.
        </p>

        <ul className="signup-modal-features">
          <li className="signup-modal-feature">
            <span className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="9" stroke="#6B7280" strokeWidth="2"/>
                <path d="M10 5V10L13 13" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <div className="feature-content">
              <span className="feature-title">Revisit previous answers.</span>
              <span className="feature-description">Access your past lookups to continue your research</span>
            </div>
          </li>
          <li className="signup-modal-feature">
            <span className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="16" height="12" rx="2" stroke="#6B7280" strokeWidth="2"/>
                <path d="M6 8H14M6 12H10" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <div className="feature-content">
              <span className="feature-title">Control your sources.</span>
              <span className="feature-description">Choose the guidelines and studies that inform your answers</span>
            </div>
          </li>
          <li className="signup-modal-feature">
            <span className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="2" width="14" height="16" rx="2" stroke="#6B7280" strokeWidth="2"/>
                <path d="M7 6H13M7 10H13M7 14H10" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <div className="feature-content">
              <span className="feature-title">Strengthen your documentation.</span>
              <span className="feature-description">Add evidence to your notes to support every decision.</span>
            </div>
          </li>
        </ul>

        <button className="signup-modal-button" onClick={onSignUp}>
          Sign up for free
        </button>

        <p className="signup-modal-disclaimer">
          Heidi Evidence is intended for registered healthcare professionals only
        </p>
      </div>
    </div>
  );
};

export default SignupModal;
