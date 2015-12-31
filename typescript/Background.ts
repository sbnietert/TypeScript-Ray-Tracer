/// <reference path="Color.ts" />
/// <reference path="Vector.ts" />

module RT {
    // a background maps outgoing ray directions to colors
    export interface Background {
        getColor(direction: Vector): Color;
    }

    export class SolidColorBackground implements Background {
        constructor(private color: Color) { }

        getColor(direction: Vector) : Color {
            return this.color;
        }
    }
}