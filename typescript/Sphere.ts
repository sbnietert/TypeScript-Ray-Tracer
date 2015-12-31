/// <reference path="Vector.ts" />
/// <reference path="GeometricObject.ts" />

module RT {
    export class Sphere extends SimpleGeometricObject implements SceneGraph.Boundable {
        constructor(public center: Vector, public radius: number) {
            super();
        }

        intersectsRay(ray: Ray, intersection: BasicRayIntersection): boolean {
            var temp = ray.origin.minus(this.center);
            var B = ray.direction.dot(temp) * 2;
            var C = temp.dot(temp) - this.radius * this.radius;

            // solve for t using the quadratic formula
            var discriminant = B * B - 4 * C;
            if (discriminant < 0) return false;
            
            // intersects line
            var t0 = (-B + Math.sqrt(discriminant)) / 2;
            var t1 = (-B - Math.sqrt(discriminant)) / 2;
            if (t0 < 0 && t1 < 0) return false;

            // intersects ray
            if (t0 < 0) intersection.t = t1;
            else if (t1 < 0) intersection.t = t0;
            else intersection.t = Math.min(t0, t1);

            return true;
        }

        getAxisAlignedBoundaryPoints(): Vector[] {
            var points = new Array<Vector>(6);
            for (var i = 0; i < 6; i++)
                points[i] = this.center.copy();
            points[0].x += this.radius;
            points[1].x -= this.radius;
            points[2].y += this.radius;
            points[3].y -= this.radius;
            points[4].z += this.radius;
            points[5].z -= this.radius;
            return points;
        }

        getReferencePoint(): Vector {
            return this.center;
        }

        protected calculateNormal(intersection: RayIntersection): Vector {
            return intersection.point.minus(this.center).scaledBy(1 / this.radius);
        }
    }
}