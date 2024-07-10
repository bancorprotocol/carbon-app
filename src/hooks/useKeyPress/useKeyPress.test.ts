import { useKeyPress } from '.';
import { test, expect, vi, describe } from 'vitest';
import { renderHook, act } from 'libs/testing-library';

describe('useKeyPress', () => {
  test('Should update the keyPressed state when esc key is pressed', () => {
    const { result } = renderHook(() => useKeyPress());
    expect(result.current.keyPressed).toBe('');

    act(() => {
      const keyboardEvent = new KeyboardEvent('keydown', { key: 'esc' });
      document.dispatchEvent(keyboardEvent);
    });
    expect(result.current.keyPressed).toBe('esc');
  });

  test('Should remove the event listener when the component unmounts', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = renderHook(() => useKeyPress());
    expect(removeEventListenerSpy).not.toHaveBeenCalled();
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});
