/// <reference path="Color.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Background.ts" />

module RT {
    export class PhiGradientBackground implements Background {
        private c: number;

        constructor(private color1: Color, private color2: Color, private n: number, private axis: Vector) {
            this.c = Math.pow(2, n - 1);
        }

        private oddpow(t: number) {
            return Math.pow(Math.abs(t), this.n + 1) / t;
        }

        getColor(direction: Vector) : Color {
            var rho = direction.length();
            var cosPhi = direction.dot(this.axis) / rho;
            var t = (cosPhi + 1) / 2;
            var t2: number;
            if (t < 0.5)
                t2 = this.c * this.oddpow(t);
            else
                t2 = 1 + this.c * this.oddpow(t - 1);
            return this.color1.plus(this.color2.minus(this.color1).scaledBy(t2));
        }
    }
}