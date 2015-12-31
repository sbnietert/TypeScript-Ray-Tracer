/// <reference path="Color.ts" />
/// <reference path="GeometricObject.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Utils.ts" />

module RT {
    export class MaterialLighting {
        color = Color.BLACK;
        ambient = 0.1;
        shininess = 100;
        reflection = 0;
        refraction = 0;
        refractiveIndex = 1.3;
    }

    export interface Material {
        getLighting(geo: GeometricObject, point: Vector): MaterialLighting;
    }

    export class SimpleMaterial implements Material {
        constructor(private lighting: MaterialLighting) { }

        getLighting(geo: GeometricObject, point: Vector): MaterialLighting {
            return this.lighting;
        }
    }
    
    export module Material {
        var glassLighting = new MaterialLighting();
        glassLighting.refraction = 1;
        var glass = new SimpleMaterial(glassLighting);

        var mirrorLighting = new MaterialLighting();
        mirrorLighting.reflection = 1;
        var mirror = new SimpleMaterial(mirrorLighting);

        export var PRESETS: Dictionary<Material> = {
            'glass': glass,
            'mirror': mirror
        };
    }
}