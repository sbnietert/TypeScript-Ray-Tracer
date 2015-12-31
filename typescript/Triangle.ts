/// <reference path="Vector.ts" />
/// <reference path="GeometricObject.ts" />
/// <reference path="SceneGraph.ts" />

module RT {
    export class Triangle extends SimpleGeometricObject implements SceneGraph.Boundable {
        private AB: Vector;
        private AC: Vector;
        normal: Vector; // so Mesh can access
        private normalA: Vector = null;
        private normalB: Vector = null;
        private normalC: Vector = null;

        constructor(public A: Vector, public B: Vector, public C: Vector) {
            super();
            this.AB = B.minus(A);
            this.AC = C.minus(A);
            this.normal = this.AB.cross(this.AC).normalize();
        }

        enableNormalInterpolation(nA: Vector, nB: Vector, nC: Vector): void {
            this.normalA = nA;
            this.normalB = nB;
            this.normalC = nC;
        }

        intersectsRay(ray: Ray, intersection: BasicRayIntersection): boolean {
            var pvec = ray.direction.cross(this.AC);
            var det = this.AB.dot(pvec);
            if (Math.abs(det) < EPSILON) return false;

            var invDet = 1 / det;

            var tvec = ray.origin.minus(this.A);
            var u = tvec.dot(pvec) * invDet;
            if (u < 0 || u > 1) return false;

            var qvec = tvec.cross(this.AB);
            var v = ray.direction.dot(qvec) * invDet;
            if (v < 0 || u + v > 1) return false;

            intersection.u = u;
            intersection.v = v;
            intersection.t = this.AC.dot(qvec) * invDet;

            return intersection.t >= 0;
        }

        getAxisAlignedBoundaryPoints(): Vector[] {
            return [this.A, this.B, this.C];
        }

        getReferencePoint(): Vector {
            return this.A;
        }

        protected calculateNormal(intersection: RayIntersection): Vector {
            if(this.normalA == null)
                return this.normal;
            // normal interpolation enabled
            var weightedA = this.normalA.scaledBy(1 - intersection.u - intersection.v);
            var weightedB = this.normalB.scaledBy(intersection.u);
            var weightedC = this.normalC.scaledBy(intersection.v);
            return weightedA.plus(weightedB.plus(weightedC));
        }

    }
}