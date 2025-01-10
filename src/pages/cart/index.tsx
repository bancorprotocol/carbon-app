import { useEffect, useState } from 'react';
import { lsService } from 'services/localeStorage';

export const CartPage = () => {
  const [cart, setCart] = useState(lsService.getItem('cart') ?? []);
  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key !== lsService.keyFormatter('cart')) return;
      const next = JSON.parse(event.newValue ?? '[]');
      setCart(next);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  });

  if (!cart.length) return;
};
