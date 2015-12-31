/// <reference path="GeometricObject.ts" />
/// <reference path="Material.ts" />
/// <reference path="Vector.ts" />

module RT {
    // this is generic so the scene graph maker can know if scene object shapes are boundable
    export class GenericSceneObject<T extends GeometricObject> {
        constructor(private geometry: T, private material: Material) { }

        getMaterialLighting(point: Vector): MaterialLighting{
            return this.material.getLighting(this.geometry, point);
        }

        getGeometry(): T {
            return this.geometry;
        }
    }

    export class SceneObject extends GenericSceneObject<GeometricObject> { }
}