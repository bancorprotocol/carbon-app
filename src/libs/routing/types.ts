import { ToOptions } from '@tanstack/react-router';

export type Pathnames = Exclude<ToOptions['to'], undefined | '' | './' | '../'>;
