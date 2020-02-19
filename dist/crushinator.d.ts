declare module 'ted-crushinator-helpers' {
    /**
    Crushinator Helpers
    Library of simple JS methods to produce crushed image URLs.
    http://github.com/tedconf/js-crushinator-helpers
     */
    import { CrushConfig } from 'ted-crushinator-helpers/lib/crush-config';
    /**
    A whitelist: Crushinator is capable of optimizing images hosted on
    any of these domains.
     */
    export const imageHosts: string[];
    /**
    Global configuration options. These can be overridden at the library
    level or via the options object by individual helper method calls.
     */
    export const config: {
            defaults: boolean;
            host: string;
    };
    /**
        * Check to see if a URL passes Crushinator's host whitelist.
        * @param url - URL of image to check.
        * @returns is the url whitelisted?
        */
    export function crushable(url: string): boolean;
    /**
        * Restore a previously crushed URL to its original form.
        *
        * @param url - Previously optimized image URL.
        * @returns the original url
        */
    export function uncrush(url: string): string;
    /**
        * Returns a Crushinator-optimized version of an image URL, using options
        * specified in a Plain Old JavaScript Object:
        * ```
        *  crush('http://images.ted.com/image.jpg', { width: 320 })
        *    => 'https://pi.tedcdn.com/images.ted.com/image.jpg?w=320'
        * ```
        * @remarks If the input URL cannot be optimized (does not pass the whitelist) it is returned untampered, making this method safe to use for dynamic image sources.
        * @param url - URL of image to be optimized.
        * @param options - Crushinator Config
        * @returns crushed image URL
        */
    export function crush(url: string, options?: CrushConfig): string;
    export default crush;
}

declare module 'ted-crushinator-helpers/lib/crush-config' {
    import { CropOptions } from 'ted-crushinator-helpers/lib/crop-option';
    type GammaOptions = Partial<{
        red: number;
        green: number;
        blue: number;
    }> | number;
    type BlurOptions = Partial<{
        sigma: number;
        radius: number;
    }> | number | boolean;
    type UnsharpOptions = Partial<{
        radius: number;
        sigma: number;
        amount: number;
        threshold: number;
    }> | boolean;
    /**
      * @param width - Target image width in pixels.
      * @param height - Target image height in pixels.
      * @param quality - Image quality as a percentage (0-100). Defaults to 82.
      * @param fit - Will zoom and crop the image for best fit into the target dimensions (width and height) if both are provided. Defaults to true.
      * @param defaults - Default options are excluded if set to false. Defaults to true.
      * @param align - If cropping occurs, the image can be aligned to the "top", "bottom", "left", "right", or "middle" of the crop frame.
      * @param crop - Image crop configuration.
      * @param blur - Image blur configuration (object) or blur spread amount in pixels (number).
      * @param blur.sigma - Blur spread amount in pixels.
      * @param blur.radius - Radial constraint of blur or zero if unconstrained. Should be at least 2x sigma if specified.
      * @param gamma - Gamma correction, applied either to the whole image (number) or to individual color channels (object).
      * @param gamma.red - Red channel gamma correction.
      * @param gamma.green - Green channel gamma correction.
      * @param gamma.blue - Blue channel gamma correction.
      * @param grayscale - Fully desaturates the image if truthy. Optionally you may also darken the image by specifying a decimal percentage value of less than 1.
      * @param unsharp - Applies an unsharp mask if true. Precise configurations can be specified in object form:
      * @param unsharp.radius - Number of pixels to which sharpening should be applied surrounding each target pixel.
      * @param unsharp.sigma - Size of details to sharpen in pixels. (Pedantically: the standard deviation of the Gaussian.)
      * @param unsharp.amount - Decimel percentage representing the strength of the sharpening in terms of the difference between the sharpened image and the original.
      * @param unsharp.threshold - Decimal percentage representing a minimum amount of difference in a pixel vs surrounding colors before it's considered a sharpenable detail.
      * @param query - Additional query parameters to include in the Crushinator-optimized image URL.
      */
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
    /**
    Given an options object, returns a parameters object with crop
    parameters included according to the specified options.
     */
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

