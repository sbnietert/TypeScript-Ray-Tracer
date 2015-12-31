/// <reference path="Color.ts" />
/// <reference path="GeometricObject.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Material.ts" />

module RT {
    export abstract class CheckeredMaterial implements Material {
        private color1: Color;

        constructor(private lighting: MaterialLighting, private color2: Color) {
            this.color1 = lighting.color;
        }

        protected abstract testPoint(point: Vector): boolean;

        getLighting(geo: GeometricObject, point: Vector): MaterialLighting {
            this.lighting.color = this.testPoint(point) ? this.color1 : this.color2;
            return this.lighting;
        }
    }

    export class XZCheckeredMaterial extends CheckeredMaterial {
        testPoint(point: Vector): boolean {
            var x = Math.floor(point.x);
            var z = Math.floor(point.z);
            return (x + z) % 2 == 0;
        }
    }

    export class XZDiamondCheckeredMaterial extends CheckeredMaterial {
        testPoint(point: Vector): boolean {
            var u = Math.floor(point.x - point.z);
            var v = Math.floor(point.x + point.z);
            return (u + v) % 2 == 0;
        }
    }
}