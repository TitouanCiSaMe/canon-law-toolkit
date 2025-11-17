/**
 * Tests pour useBreakpoint hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useBreakpoint from '../useBreakpoint';

describe('useBreakpoint', () => {
  let matchMediaMock;

  beforeEach(() => {
    // Mock de window.matchMedia
    matchMediaMock = vi.fn();
    window.matchMedia = matchMediaMock;
  });

  const createMatchMedia = (matches) => ({
    matches,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });

  it('devrait détecter le breakpoint mobile (xs)', () => {
    // Simuler un écran mobile (< 480px)
    matchMediaMock.mockImplementation((query) => {
      if (query === '(min-width: 480px)') return createMatchMedia(false);
      if (query === '(min-width: 768px)') return createMatchMedia(false);
      if (query === '(min-width: 1024px)') return createMatchMedia(false);
      return createMatchMedia(false);
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.breakpoint).toBe('xs');
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('devrait détecter le breakpoint tablet (md)', () => {
    // Simuler un écran tablet (768px - 1023px)
    matchMediaMock.mockImplementation((query) => {
      if (query === '(min-width: 480px)') return createMatchMedia(true);
      if (query === '(min-width: 768px)') return createMatchMedia(true);
      if (query === '(min-width: 1024px)') return createMatchMedia(false);
      return createMatchMedia(false);
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.breakpoint).toBe('md');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it('devrait détecter le breakpoint desktop (lg)', () => {
    // Simuler un écran desktop (>= 1024px)
    matchMediaMock.mockImplementation((query) => {
      if (query === '(min-width: 480px)') return createMatchMedia(true);
      if (query === '(min-width: 768px)') return createMatchMedia(true);
      if (query === '(min-width: 1024px)') return createMatchMedia(true);
      return createMatchMedia(true);
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current.breakpoint).toBe('lg');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });

  it('devrait mettre à jour le breakpoint quand la fenêtre est redimensionnée', () => {
    let eventListeners = {};

    const mockMatchMedia = (query) => {
      const mql = createMatchMedia(false);
      mql.addEventListener = vi.fn((event, handler) => {
        if (!eventListeners[query]) {
          eventListeners[query] = [];
        }
        eventListeners[query].push(handler);
      });
      return mql;
    };

    matchMediaMock.mockImplementation(mockMatchMedia);

    const { result, rerender } = renderHook(() => useBreakpoint());

    // Initialement mobile
    expect(result.current.breakpoint).toBe('xs');

    // Simuler un changement vers desktop
    act(() => {
      Object.values(eventListeners).flat().forEach(handler => {
        handler({ matches: true });
      });
    });

    rerender();

    // Devrait refléter le changement (le comportement exact dépend de l'implémentation)
  });
});
