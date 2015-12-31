/// <reference path="Vector.ts" />
/// <reference path="GeometricObject.ts" />

module RT {
    export class AxisAlignedBox extends SimpleGeometricObject {

        // create box given two opposite corners of an axis-aligned box
        constructor(private ll: Vector, private ur: Vector) {
            super();
        }

        // help from http://gamedev.stackexchange.com/questions/18436/most-efficient-aabb-vs-ray-collision-algorithms
        // a bit of copy and paste, but speed is essential here, and function calls would slow this down
        intersectsRay(ray: Ray, intersection: BasicRayIntersection): boolean {
            var t1 = (this.ll.x - ray.origin.x) / ray.direction.x;
            var t2 = (this.ur.x - ray.origin.x) / ray.direction.x;
            var t3 = (this.ll.y - ray.origin.y) / ray.direction.y;
            var t4 = (this.ur.y - ray.origin.y) / ray.direction.y;
            var t5 = (this.ll.z - ray.origin.z) / ray.direction.z;
            var t6 = (this.ur.z - ray.origin.z) / ray.direction.z;

            var t12min: number;
            var t12minIndex: number;
            var t12max: number;
            var t12maxIndex: number;
            if (t1 < t2) {
                t12min = t1;
                t12minIndex = 1;
                t12max = t2;
                t12maxIndex = 2;
            } else {
                t12min = t2;
                t12minIndex = 2;
                t12max = t1;
                t12maxIndex = 1;
            }

            var t34min: number;
            var t34minIndex: number;
            var t34max: number;
            var t34maxIndex: number;
            if (t3 < t4) {
                t34min = t3;
                t34minIndex = 3;
                t34max = t4;
                t34maxIndex = 4;
            } else {
                t34min = t4;
                t34minIndex = 4;
                t34max = t3;
                t34maxIndex = 3;
            }

            var t56min: number;
            var t56minIndex: number;
            var t56max: number;
            var t56maxIndex: number;
            if (t5 < t6) {
                t56min = t5;
                t56minIndex = 5;
                t56max = t6;
                t56maxIndex = 6;
            } else {
                t56min = t6;
                t56minIndex = 6;
                t56max = t5;
                t56maxIndex = 5;
            }

            var tmin: number;
            var tminIndex: number;
            if (t12min > t34min) {
                tmin = t12min;
                tminIndex = t12minIndex;
            } else {
                tmin = t34min;
                tminIndex = t34minIndex;
            }
            if (t56min > tmin) {
                tmin = t56min;
                tminIndex = t56minIndex;
            }

            var tmax: number;
            var tmaxIndex: number;
            if (t12max < t34max) {
                tmax = t12max;
                tmaxIndex = t12maxIndex;
            } else {
                tmax = t34max;
                tmaxIndex = t34maxIndex;
            }
            if (t56max < tmax) {
                tmax = t56max;
                tmaxIndex = t56maxIndex;
            }

            // if tmax < 0, ray (line) is intersecting AABB, but whole AABB is behind us
            // if tmin > tmax, ray doesn't intersect AABB
            if (tmax < 0 || tmin > tmax)
                return false;

            intersection.t = tmin;
            intersection.geometricData = tminIndex;
            return true;
        }

        private static normals: Vector[] = [
            Vector.i,
            Vector.i.scale(-1),
            Vector.j,
            Vector.j.scale(-1),
            Vector.k,
            Vector.k.scale(-1)
        ];
        protected calculateNormal(intersection: RayIntersection): Vector {
            return AxisAlignedBox.normals[intersection.geometricData - 1];
        }

    }
}