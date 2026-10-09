// Minimal typing for the only Node API used by the SSR entry (`src/entry-server.tsx`).
// The project does not depend on @types/node.
declare module "node:stream" {
  interface WritableOptions {
    write(
      chunk: string | Uint8Array,
      encoding: string,
      callback: (error?: Error | null) => void
    ): void;
    final?(callback: (error?: Error | null) => void): void;
  }

  export class Writable {
    constructor(options?: WritableOptions);
  }
}
