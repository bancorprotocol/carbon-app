import { FC } from 'react';
import { cn } from 'utils/helpers';
import { useNavigate } from '@tanstack/react-router';
import { useWagmi } from 'libs/wagmi';
import style from './index.module.css';
import { getEnsAddressIfAny } from 'libs/queries';

interface Props {
  search: string;
}
export const SuggestionEmpty: FC<Props> = ({ search }) => {
  const nav = useNavigate({ from: '/explore/$slug' });
  const { provider } = useWagmi();

  const navigate = async () => {
    const slug = await getEnsAddressIfAny(provider, search);
    nav({ params: { slug } });
  };

  return (
    <button
      type="button"
      onClick={navigate}
      className={cn(
        style.empty,
        'px-30 py-10 text-start hover:bg-white/20 focus-visible:bg-white/10',
      )}
    >
      {search}
    </button>
  );
};
