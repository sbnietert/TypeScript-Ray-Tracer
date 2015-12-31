/// <reference path="Vector.ts" />
/// <reference path="GeometricObject.ts" />

module RT {
    // camera class with necessary information and methods to generate rays from eye point to image plane
    // (plane is a bit of a misnomer, since it has a width and height)
    export class Camera {
        private eye: Vector; // point in scene space from which rays originate
        private imagePlaneCenter: Vector; // center of image plane in scene space
        private up: Vector; // vector in scene space pointing in the -row direction in image space
        private right: Vector; // vector in scene space pointing in the +col direction in image space

        private imagePlaneWidth: number; // width of image plane in scene space
        private imagePlaneHeight: number; // height of image plane in scene space

        private _pixelWidth: number; // width of image plane in pixels
        private _pixelHeight: number; // height of image plane in pixels

        get pixelWidth(): number { return this._pixelWidth; };
        get pixelHeight(): number { return this._pixelHeight; };

        set pixelWidth(w: number) {
            this._pixelWidth = w;
            this.resize();
        };
        set pixelHeight(h: number) {
            this._pixelHeight = h;
            this.resize();
        };

        constructor(pose: Ray, up: Vector, focalLength: number, pixelWidth: number, pixelHeight: number) {
            this.eye = pose.origin;
            this.up = up;
            this.pixelWidth = pixelWidth;
            this.pixelHeight = pixelHeight;

            this.imagePlaneCenter = pose.origin.plus(pose.direction.scaledBy(focalLength));
            this.right = up.cross(pose.direction); // orthogonal to up and "out" vectors

            this.resize();
        }

        private resize() {
            // set the smaller of the dimensions equal to one unit in the scene space
            if (this.pixelHeight < this.pixelWidth) {
                this.imagePlaneHeight = 1;
                this.imagePlaneWidth = this.pixelWidth / this.pixelHeight;
            }
            else {
                this.imagePlaneWidth = 1;
                this.imagePlaneHeight = this.pixelHeight / this.pixelWidth;
            }
        }

        // generate ray from eye point to point on image plane corresponding to location in image space
        // (row and col can be fractional to allow for subpixel sampling)
        generateRay(row: number, col: number): Ray {
            var rightCoefficient = (col - this.pixelWidth / 2) / this.pixelWidth * this.imagePlaneWidth;
            var upCoefficient = (this.pixelHeight / 2 - row) / this.pixelHeight * this.imagePlaneHeight;

            var right = this.right.scaledBy(rightCoefficient);
            var up = this.up.scaledBy(upCoefficient);
            var target = this.imagePlaneCenter.plus(right).plus(up);

            var direction = target.minus(this.eye).normalize();
            return new Ray(this.eye, direction);
        }
    }
}