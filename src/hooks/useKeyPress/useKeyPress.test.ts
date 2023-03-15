import { act, renderHook } from '@testing-library/react';
import { useKeyPress } from '.';

describe('useKeyPress', () => {
  it('Should update the keyPressed state when esc key is pressed', () => {
    const { result } = renderHook(() => useKeyPress());
    expect(result.current.keyPressed).toBe('');

    act(() => {
      const keyboardEvent = new KeyboardEvent('keydown', { key: 'esc' });
      document.dispatchEvent(keyboardEvent);
    });
    expect(result.current.keyPressed).toBe('esc');
  });

  it('Should remove the event listener when the component unmounts', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    const { unmount } = renderHook(() => useKeyPress());
    expect(removeEventListenerSpy).not.toHaveBeenCalled();
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});
