/**
 * Tests pour useResponsiveValue hook
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useResponsiveValue from '../useResponsiveValue';
import useBreakpoint from '../useBreakpoint';

// Mock du hook useBreakpoint
vi.mock('../useBreakpoint');

describe('useResponsiveValue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait retourner la valeur xs pour mobile', () => {
    useBreakpoint.mockReturnValue({
      breakpoint: 'xs',
      isDesktop: false,
      isTablet: false,
      isMobile: true,
    });

    const { result } = renderHook(() =>
      useResponsiveValue({
        xs: 10,
        md: 20,
        lg: 30,
      })
    );

    expect(result.current).toBe(10);
  });

  it('devrait retourner la valeur md pour tablet', () => {
    useBreakpoint.mockReturnValue({
      breakpoint: 'md',
      isDesktop: false,
      isTablet: true,
      isMobile: false,
    });

    const { result } = renderHook(() =>
      useResponsiveValue({
        xs: 10,
        md: 20,
        lg: 30,
      })
    );

    expect(result.current).toBe(20);
  });

  it('devrait retourner la valeur lg pour desktop', () => {
    useBreakpoint.mockReturnValue({
      breakpoint: 'lg',
      isDesktop: true,
      isTablet: false,
      isMobile: false,
    });

    const { result } = renderHook(() =>
      useResponsiveValue({
        xs: 10,
        md: 20,
        lg: 30,
      })
    );

    expect(result.current).toBe(30);
  });

  it('devrait utiliser la valeur la plus proche si le breakpoint exact n\'existe pas', () => {
    useBreakpoint.mockReturnValue({
      breakpoint: 'xl',
      isDesktop: true,
      isTablet: false,
      isMobile: false,
    });

    const { result } = renderHook(() =>
      useResponsiveValue({
        xs: 10,
        md: 20,
        lg: 30,
        // pas de xl défini
      })
    );

    // Devrait retourner lg car c'est le plus proche
    expect(result.current).toBe(30);
  });

  it('devrait accepter des valeurs de types différents', () => {
    useBreakpoint.mockReturnValue({
      breakpoint: 'md',
      isDesktop: false,
      isTablet: true,
      isMobile: false,
    });

    const { result } = renderHook(() =>
      useResponsiveValue({
        xs: '0.7rem',
        md: '0.85rem',
        lg: '1rem',
      })
    );

    expect(result.current).toBe('0.85rem');
  });

  it('devrait gérer les valeurs d\'objet', () => {
    useBreakpoint.mockReturnValue({
      breakpoint: 'lg',
      isDesktop: true,
      isTablet: false,
      isMobile: false,
    });

    const { result } = renderHook(() =>
      useResponsiveValue({
        xs: { width: 100, height: 60 },
        md: { width: 200, height: 80 },
        lg: { width: 300, height: 100 },
      })
    );

    expect(result.current).toEqual({ width: 300, height: 100 });
  });
});
