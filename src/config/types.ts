import * as v from 'valibot';
import { AppConfigSchema } from './configSchema';

export type AppConfig = v.InferOutput<typeof AppConfigSchema>;
