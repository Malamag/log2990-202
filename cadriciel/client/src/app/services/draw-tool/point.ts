export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static distance(p1: Point, p2: Point): number {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    static createVector(p1: Point, p2: Point): Point {
        return new Point(p2.x - p1.x, p2.y - p1.y);
    }

    static rectOverlap(tl1: Point, br1: Point, tl2: Point, br2: Point): boolean {
        const ONE_IS_ON_THE_SIDE = tl1.x > br2.x || tl2.x > br1.x;
        const ONE_IS_ABOVE = tl1.y > br2.y || tl2.y > br1.y;

        return !(ONE_IS_ON_THE_SIDE || ONE_IS_ABOVE);
    }

    static insideRectangle(p: Point, tl: Point, br: Point): boolean {
        const DOWN_RIGHT = p.x > tl.x && p.y > tl.y;
        const UP_LEFT = p.x < br.x && p.y < br.y;
        return DOWN_RIGHT && UP_LEFT;
    }
}
