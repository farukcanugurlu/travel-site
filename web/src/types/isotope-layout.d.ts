// src/types/isotope-layout.d.ts
declare module "isotope-layout" {
  export default class Isotope {
    constructor(
      element: Element | string,
      options?: {
        itemSelector?: string;
        layoutMode?: string;
        percentPosition?: boolean;
        masonry?: Record<string, unknown>;
        [key: string]: unknown;
      }
    );

    arrange(opts?: Record<string, unknown>): void;
    layout(): void;
    reloadItems(): void;
    destroy(): void;
  }
}
