module RT {
    // class storing point in color space using red, green, and blue components ranging from 0 to 1
    export class Color {
        constructor(private r: number, private g: number, private b: number) { }

        static get BLACK(): Color { return new Color(0, 0, 0); };
        static get WHITE(): Color { return new Color(1, 1, 1); };

        // create a color by calculating RGB components given hue, saturation, and lightness
        // HSL conversion algorithm found at http://www.geekymonkey.com/Programming/CSharp/RGB2HSL_HSL2RGB.htm
        static fromHSL(h: number, sl: number, l: number): Color {
            var r = l; // default to gray
            var g = l;
            var b = l;
            var v = (l <= 0.5) ? (l * (1.0 + sl)) : (l + sl - l * sl);
            if (v > 0) {
                var m = l + l - v;
                var sv = (v - m) / v;
                h *= 6.0;
                var sextant = Math.floor(h);
                var fract = h - sextant;
                var vsf = v * sv * fract;
                var mid1 = m + vsf;
                var mid2 = v - vsf;
                switch (sextant) {
                    case 0:
                        r = v;
                        g = mid1;
                        b = m;
                        break;
                    case 1:
                        r = mid2;
                        g = v;
                        b = m;
                        break;
                    case 2:
                        r = m;
                        g = v;
                        b = mid1;
                        break;
                    case 3:
                        r = m;
                        g = mid2;
                        b = v;
                        break;
                    case 4:
                        r = mid1;
                        g = m;
                        b = v;
                        break;
                    case 5:
                        r = v;
                        g = m;
                        b = mid2;
                        break;
                }
            }
            return new Color(r, g, b);
        }

        copy(): Color {
            return new Color(this.r, this.g, this.b);
        }

        add(c: Color): Color {
            this.r += c.r;
            this.g += c.g;
            this.b += c.b;
            return this;
        }

        subtract(c: Color): Color {
            this.r -= c.r;
            this.g -= c.g;
            this.b -= c.b;
            return this;
        }

        scale(c: number): Color {
            this.r *= c;
            this.g *= c;
            this.b *= c;
            return this;
        }

        multiplyBy(c: Color): Color {
            this.r *= c.r;
            this.g *= c.g;
            this.b *= c.b;
            return this;
        }

        // restrict color components to values <= 1
        cap() : Color {
            this.r = Math.min(1, this.r);
            this.g = Math.min(1, this.g);
            this.b = Math.min(1, this.b);
            return this;
        }

        plus(v: Color) : Color {
            return this.copy().add(v);
        }

        minus(v: Color): Color {
            return this.copy().subtract(v);
        }

        scaledBy(c: number): Color {
            return this.copy().scale(c);
        }

        times(c: Color): Color {
            return this.copy().multiplyBy(c);
        }

        toString(): string {
            var r = Math.floor(this.r * 255);
            var g = Math.floor(this.g * 255);
            var b = Math.floor(this.b * 255);
            return 'rgb(' + r + ',' + g + ',' + b + ')';
        }
    }
}