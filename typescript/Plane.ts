/// <reference path="Vector.ts" />
/// <reference path="GeometricObject.ts" />

module RT {
    export class Plane extends SimpleGeometricObject {
        constructor(public normal: Vector, public offset: number) {
            super();
        }

        intersectsRay(ray: Ray, intersection: BasicRayIntersection): boolean {
            var u = this.normal.scaledBy(-this.offset).minus(ray.origin);
            var denominator = ray.direction.dot(this.normal);
            if (denominator == 0) return false;

            intersection.t = u.dot(this.normal) / denominator;
            if (intersection.t < 0) return false;

            return true;
        }

        protected calculateNormal(intersection: RayIntersection): Vector {
            return this.normal;
        }
    }
}