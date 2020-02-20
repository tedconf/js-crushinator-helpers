declare module 'ted-crushinator-helpers' {
  import { CrushConfig } from 'ted-crushinator-helpers/lib/crush-config';
  export const imageHosts: string[];
  export const config: {
    defaults: boolean;
    host: string;
  };
  export function crushable(url: string): boolean;
  export function uncrush(url: string): string;
  export function crush(url: string, options?: CrushConfig): string;
  export default crush;
}

declare module 'ted-crushinator-helpers/lib/crush-config' {
  import { CropOptions } from 'ted-crushinator-helpers/lib/crop-option';
  type GammaOptions =
    | Partial<{
        red: number;
        green: number;
        blue: number;
      }>
    | number;
  type BlurOptions =
    | Partial<{
        sigma: number;
        radius: number;
      }>
    | number
    | boolean;
  type UnsharpOptions =
    | Partial<{
        radius: number;
        sigma: number;
        amount: number;
        threshold: number;
      }>
    | boolean;
  export type CrushConfig = Partial<{
    width: number;
    height: number;
    quality: number;
    fit: boolean;
    defaults?: boolean;
    align: 'top' | 'bottom' | 'left' | 'right' | 'middle';
    crop?: CropOptions;
    blur?: BlurOptions;
    gamma?: GammaOptions;
    grayscale: boolean | number;
    unsharp?: UnsharpOptions;
    query: Record<any, any>;
    'crop-afterResize': boolean;
    'crop-width': number;
    'crop-height': number;
    'crop-x': number;
    'crop-y': number;
  }>;
  export {};
}

declare module 'ted-crushinator-helpers/lib/crop-option' {
  export type CropOptions = Partial<{
    afterResize: boolean;
    width: number;
    height: number;
    x: number;
    y: number;
  }>;
  export function param(cropOptions: CropOptions): string;
  export function filter(cropOptions: CropOptions): string;
}
