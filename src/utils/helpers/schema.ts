import * as v from 'valibot';

export const toBoolean = v.coerce(v.boolean(), Boolean);
export const toString = v.coerce(v.string(), String);
export const toNumber = v.coerce(v.number(), Number);
