import { SVGData } from '../svgData';
export interface ShownData {
    id: string;
    svgElement: Element;
    name: string;
    tags: string[];
    data: SVGData;
    width: number;
    height: number;
}
