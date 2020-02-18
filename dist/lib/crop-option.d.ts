/**
Given an options object, returns a parameters object with crop
parameters included according to the specified options.
*/
export declare type CropOptions = Partial<{
    afterResize: boolean;
    width: number;
    height: number;
    x: number;
    y: number;
}>;
export declare function param(cropOptions: CropOptions): string;
export declare function filter(cropOptions: CropOptions): string;
