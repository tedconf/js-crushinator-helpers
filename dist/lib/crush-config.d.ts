import { CropOptions } from './crop-option';
declare type GammaOptions = Partial<{
    red: number;
    green: number;
    blue: number;
}> | number;
declare type BlurOptions = Partial<{
    sigma: number;
    radius: number;
}> | number | boolean;
declare type UnsharpOptions = Partial<{
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
export declare type CrushConfig = Partial<{
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
