import { customTwMerge } from '.';
import { describe, it, expect } from 'vitest';

describe('Custom Tailwind Merge', () => {
  describe('font size and color', () => {
    it('should not merge color and size', () => {
      expect(customTwMerge('text-14 text-primary')).toEqual(
        customTwMerge('text-14 text-primary'),
      );
    });
    it('should not merge color and size', () => {
      expect(customTwMerge('text-primary text-14')).toEqual(
        customTwMerge('text-primary text-14'),
      );
    });
    it('should merge different colors', () => {
      expect(customTwMerge('text-white text-primary')).toEqual(
        customTwMerge('text-primary'),
      );
      expect(
        customTwMerge('text-background-50 text-primaryGradient-first'),
      ).toEqual(customTwMerge('text-primaryGradient-first'));
    });
    it('should merge different sizes', () => {
      expect(customTwMerge('text-14 text-16')).toEqual(
        customTwMerge('text-16'),
      );
    });
  });
  describe('borderRadius', () => {
    it('should merge different sizes', () => {
      expect(customTwMerge('rounded-14 rounded-16')).toEqual(
        customTwMerge('rounded-16'),
      );
    });
    it('should merge sizes with numbers and names', () => {
      expect(customTwMerge('rounded-14 rounded-full')).toEqual(
        customTwMerge('rounded-full'),
      );
    });
  });
  describe('border', () => {
    it('should merge different colors', () => {
      expect(customTwMerge('border border-primary')).toEqual(
        customTwMerge('border border-primary'),
      );
    });
    it('should merge different colors', () => {
      expect(customTwMerge('border border-white border-primary')).toEqual(
        customTwMerge('border border-primary'),
      );
    });
    it('should merge different colors', () => {
      expect(
        customTwMerge('border border-primary/60 border-background-800'),
      ).toEqual(customTwMerge('border border-background-800'));
    });
    it('should not merge colors and sizes', () => {
      expect(customTwMerge('border border-5 border-background-800')).toEqual(
        customTwMerge('border border-5 border-background-800'),
      );
    });
  });
  describe('opacity', () => {
    it('should merge different sizes', () => {
      expect(customTwMerge('opacity-5 opacity-10')).toEqual(
        customTwMerge('opacity-10'),
      );
    });
  });
  describe('spacing', () => {
    describe('space', () => {
      it('should merge different sizes in space x', () => {
        expect(customTwMerge('space-x-14 space-x-16')).toEqual(
          customTwMerge('space-x-16'),
        );
      });
      it('should merge different sizes in space y', () => {
        expect(customTwMerge('space-y-14 space-y-16')).toEqual(
          customTwMerge('space-y-16'),
        );
      });
      it('should not merge different sizes in space x and y', () => {
        expect(customTwMerge('space-x-14 space-y-16')).toEqual(
          customTwMerge('space-x-14 space-y-16'),
        );
      });
    });
    describe('margin', () => {
      it('should merge different sizes with m', () => {
        expect(customTwMerge('m-5 m-10')).toEqual(customTwMerge('m-10'));
      });
      it('should merge different sizes with mx', () => {
        expect(customTwMerge('mx-5 mx-10')).toEqual(customTwMerge('mx-10'));
      });
      it('should merge different sizes with m before mx', () => {
        expect(customTwMerge('m-5 mx-10')).toEqual(customTwMerge('m-5 mx-10'));
      });
      it('should merge different sizes with mx before m', () => {
        expect(customTwMerge('mx-5 m-10')).toEqual(customTwMerge('m-10'));
      });
      it('should merge different sizes with mx before mr', () => {
        expect(customTwMerge('mx-5 mr-10')).toEqual(
          customTwMerge('mx-5 mr-10'),
        );
      });
      it('should merge different sizes with mr before mx', () => {
        expect(customTwMerge('mr-10 mx-5')).toEqual(customTwMerge('mx-5'));
      });
      it('should merge different sizes with my', () => {
        expect(customTwMerge('my-5 my-10')).toEqual(customTwMerge('my-10'));
      });
      it('should merge different sizes with m before my', () => {
        expect(customTwMerge('m-5 my-10')).toEqual(customTwMerge('m-5 my-10'));
      });
      it('should merge different sizes with my before m', () => {
        expect(customTwMerge('my-5 m-10')).toEqual(customTwMerge('m-10'));
      });
      it('should merge different sizes with my before mt', () => {
        expect(customTwMerge('my-5 mt-10')).toEqual(
          customTwMerge('my-5 mt-10'),
        );
      });
      it('should merge different sizes with pt before py', () => {
        expect(customTwMerge('pt-10 py-5')).toEqual(customTwMerge('py-5'));
      });
      it('should merge different margin-auto', () => {
        expect(customTwMerge('m-auto m-5')).toEqual(customTwMerge('m-5'));
      });
      it('should merge different margin-auto', () => {
        expect(customTwMerge('m-5 m-auto')).toEqual(customTwMerge('m-auto'));
      });
      it('should merge different margin-auto', () => {
        expect(customTwMerge('my-5 m-auto')).toEqual(customTwMerge('m-auto'));
      });
      it('should merge different margin-auto', () => {
        expect(customTwMerge('m-auto my-5')).toEqual(
          customTwMerge('m-auto my-5'),
        );
      });
    });
    describe('padding', () => {
      it('should merge different sizes with p', () => {
        expect(customTwMerge('p-5 p-10')).toEqual(customTwMerge('p-10'));
      });
      it('should merge different sizes with px', () => {
        expect(customTwMerge('px-5 px-10')).toEqual(customTwMerge('px-10'));
      });
      it('should merge different sizes with p before px', () => {
        expect(customTwMerge('p-5 px-10')).toEqual(customTwMerge('p-5 px-10'));
      });
      it('should merge different sizes with px before p', () => {
        expect(customTwMerge('px-5 p-10')).toEqual(customTwMerge('p-10'));
      });
      it('should merge different sizes with px before pr', () => {
        expect(customTwMerge('px-5 pr-10')).toEqual(
          customTwMerge('px-5 pr-10'),
        );
      });
      it('should merge different sizes with pr before px', () => {
        expect(customTwMerge('pr-10 px-5')).toEqual(customTwMerge('px-5'));
      });
      it('should merge different sizes with py', () => {
        expect(customTwMerge('py-5 py-10')).toEqual(customTwMerge('py-10'));
      });
      it('should merge different sizes with p before py', () => {
        expect(customTwMerge('p-5 py-10')).toEqual(customTwMerge('p-5 py-10'));
      });
      it('should merge different sizes with py before p', () => {
        expect(customTwMerge('py-5 p-10')).toEqual(customTwMerge('p-10'));
      });
      it('should merge different sizes with py before pt', () => {
        expect(customTwMerge('py-5 pt-10')).toEqual(
          customTwMerge('py-5 pt-10'),
        );
      });
      it('should merge different sizes with pt before py', () => {
        expect(customTwMerge('pt-10 py-5')).toEqual(customTwMerge('py-5'));
      });
    });
  });
  describe('animate', () => {
    it('should merge different default animations', () => {
      expect(customTwMerge('animate-spin animate-none')).toEqual(
        customTwMerge('animate-none'),
      );
    });
    it('should merge different non-default animations', () => {
      expect(customTwMerge('animate-spin animate-slideUp')).toEqual(
        customTwMerge('animate-slideUp'),
      );
    });
  });
  describe('font weight', () => {
    it('should merge different sizes', () => {
      expect(customTwMerge('font-weight-300 font-weight-500')).toEqual(
        customTwMerge('font-weight-500'),
      );
    });
    it('should not merge size with family', () => {
      expect(
        customTwMerge('font-weight-300 font-weight-500 font-mono'),
      ).toEqual(customTwMerge('font-weight-500 font-mono'));
    });
  });
  describe('size and height/width', () => {
    it('should merge different sizes', () => {
      expect(customTwMerge('size-5 size-10')).toEqual(customTwMerge('size-10'));
    });
    it('should merge different sizes with size before h', () => {
      expect(customTwMerge('size-5 h-10')).toEqual(
        customTwMerge('size-5 h-10'),
      );
    });
    it('should merge different sizes with h before size', () => {
      expect(customTwMerge('h-10 size-5')).toEqual(customTwMerge('size-5'));
    });
    it('should merge different sizes with size before w', () => {
      expect(customTwMerge('size-5 w-10')).toEqual(
        customTwMerge('size-5 w-10'),
      );
    });
    it('should merge different sizes with w before size', () => {
      expect(customTwMerge('w-10 size-5')).toEqual(customTwMerge('size-5'));
    });
  });
  describe('max width', () => {
    it('should merge different sizes', () => {
      expect(customTwMerge('max-w-0 max-w-xl')).toEqual(
        customTwMerge('max-w-xl'),
      );
    });
    it('should merge different sizes', () => {
      expect(customTwMerge('max-w-xl max-w-full')).toEqual(
        customTwMerge('max-w-full'),
      );
    });
  });
  describe('transformBox', () => {
    it('should merge different transform-box', () => {
      expect(customTwMerge('transformBox-fill transformBox-stroke')).toEqual(
        'transformBox-stroke',
      );
      expect(customTwMerge('transformBox-content transformBox-fill')).toEqual(
        'transformBox-fill',
      );
    });
  });
});
