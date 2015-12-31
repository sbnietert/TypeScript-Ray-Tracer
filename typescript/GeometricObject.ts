/// <reference path="Vector.ts" />
/// <reference path="SceneObject.ts" />

module RT {
    export var EPSILON = 0.000001;

    export class Ray {
        constructor(public origin: Vector, public direction: Vector) { }

        inchForward() {
            this.origin.add(this.direction.scaledBy(EPSILON));
        }
    }

    export class BasicRayIntersection {
        t: number;
        u: number;
        v: number;
        geometricData: number;
    }

    export class RayIntersection extends BasicRayIntersection {
        point: Vector;
        normal: Vector;
        incident: Vector;
        object: SceneObject = null;
    }

    export abstract class GeometricObject {
        findNormal(intersection: RayIntersection): Vector {
            var normal = this.calculateNormal(intersection);

            // ensure that normal vector is directed towards ray source
            // (this results in double-sided surfaces)
            if (normal.dot(intersection.incident) < 0) return normal;
            return normal.scaledBy(-1);
        }

        abstract intersectsRay(ray: Ray, intersection: BasicRayIntersection): boolean;
        abstract obstructsShadowRay(shadowRay: Ray, distToLight: number): boolean;
        protected abstract calculateNormal(intersection: RayIntersection): Vector;
    }

    export abstract class SimpleGeometricObject extends GeometricObject {
        obstructsShadowRay(shadowRay: Ray, distToLight: number): boolean {
            var intersection = new BasicRayIntersection();
            return this.intersectsRay(shadowRay, intersection) && intersection.t < distToLight;
        }
    }
}