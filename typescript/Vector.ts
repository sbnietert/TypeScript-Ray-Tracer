module RT {
    export class Vector {
        constructor(public x: number, public y: number, public z: number) { }

        static get i(): Vector { return new Vector(1, 0, 0); };
        static get j(): Vector { return new Vector(0, 1, 0); };
        static get k(): Vector { return new Vector(0, 0, 1); };

        copy(): Vector {
            return new Vector(this.x, this.y, this.z);
        }

        add(v: Vector): Vector {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
        }

        subtract(v: Vector): Vector {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            return this;
        }

        scale(c: number): Vector {
            this.x *= c;
            this.y *= c;
            this.z *= c;
            return this;
        }

        vectorScale(v: Vector): Vector {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
            return this;
        }

        plus(v: Vector): Vector {
            return this.copy().add(v);
        }

        minus(v: Vector): Vector {
            return this.copy().subtract(v);
        }

        scaledBy(c: number): Vector {
            return this.copy().scale(c);
        }

        vectorScaledBy(v: Vector): Vector {
            return this.copy().vectorScale(v);
        }

        dot(v: Vector): number {
            return (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
        }

        cross(v: Vector): Vector {
            return new Vector(
                this.y * v.z - this.z * v.y,
                this.z * v.x - this.x * v.z,
                this.x * v.y - this.y * v.x
            );
        }

        length(): number {
            return Math.sqrt(this.dot(this));
        }

        normalize(): Vector {
            this.scale(1 / this.length());
            return this;
        }

        getReflection(normal: Vector): Vector {
            return this.minus(normal.scaledBy(2 * normal.dot(this)));
        }

    }
}