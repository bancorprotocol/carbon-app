// Required for TON. Unfortunately we cannot use it only if TON
import { Buffer } from 'buffer/';
globalThis.Buffer = Buffer as any;

if (typeof global === 'undefined') {
  (window as any).global = globalThis;
}

export {};
