/**
 * HamburgerButton - Bouton menu hamburger pour mobile
 *
 * Bouton animé avec transformation en X quand le menu est ouvert
 *
 * @component
 */

import React from 'react';
import { globalTheme } from '../theme/globalTheme';

/**
 * HamburgerButton component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - État du menu (ouvert/fermé)
 * @param {Function} props.onClick - Callback au clic
 * @param {string} props.ariaLabel - Label pour accessibilité
 */
const HamburgerButton = ({
  isOpen = false,
  onClick,
  ariaLabel = 'Toggle menu'
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 2000,
        width: '48px',
        height: '48px',
        background: isOpen
          ? 'rgba(120, 53, 15, 0.95)'
          : 'linear-gradient(135deg, #78350F 0%, #92400E 100%)',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        padding: '0',
        boxShadow: globalTheme.shadows.elevated,
        transition: globalTheme.transitions.normal
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = globalTheme.shadows.strong;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = globalTheme.shadows.elevated;
      }}
    >
      {/* Ligne 1 */}
      <span style={{
        display: 'block',
        width: '24px',
        height: '3px',
        background: '#F7FAFC',
        borderRadius: '2px',
        transition: 'all 0.3s ease',
        transform: isOpen ? 'rotate(45deg) translateY(8px)' : 'rotate(0) translateY(0)'
      }} />

      {/* Ligne 2 (disparaît quand ouvert) */}
      <span style={{
        display: 'block',
        width: '24px',
        height: '3px',
        background: '#F7FAFC',
        borderRadius: '2px',
        transition: 'all 0.3s ease',
        opacity: isOpen ? '0' : '1',
        transform: isOpen ? 'translateX(-10px)' : 'translateX(0)'
      }} />

      {/* Ligne 3 */}
      <span style={{
        display: 'block',
        width: '24px',
        height: '3px',
        background: '#F7FAFC',
        borderRadius: '2px',
        transition: 'all 0.3s ease',
        transform: isOpen ? 'rotate(-45deg) translateY(-8px)' : 'rotate(0) translateY(0)'
      }} />
    </button>
  );
};

export default HamburgerButton;
