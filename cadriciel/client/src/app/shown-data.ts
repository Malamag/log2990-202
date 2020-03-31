import { SVGData } from '../../../svg-data';
export interface ShownData {
    id: string;
    svgElement: Element;
    name: string;
    tags: string[];
    data: SVGData;
    width: number;
    height: number;
}
