import { afterEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { resetDomain, setDomain, useDomain } from './useDomain';

afterEach(() => {
  resetDomain();
  window.localStorage.clear();
});

describe('useDomain', () => {
  it('defaults to systems', () => {
    const { result } = renderHook(() => useDomain());
    expect(result.current[0]).toBe('systems');
  });

  it('updates every consumer when the domain changes', () => {
    const a = renderHook(() => useDomain());
    const b = renderHook(() => useDomain());

    act(() => a.result.current[1]('ai'));

    expect(a.result.current[0]).toBe('ai');
    expect(b.result.current[0]).toBe('ai');
  });

  it('persists the choice to storage', () => {
    const { result } = renderHook(() => useDomain());
    act(() => result.current[1]('ai'));
    expect(window.localStorage.getItem('dn:domain')).toBe('"ai"');
  });

  it('ignores an unknown value', () => {
    const { result } = renderHook(() => useDomain());
    act(() => {
      result.current[1]('ai');
      setDomain('nonsense' as never);
    });
    expect(result.current[0]).toBe('systems');
  });
});
