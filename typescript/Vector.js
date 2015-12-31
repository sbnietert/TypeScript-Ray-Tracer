var RT;
(function (RT) {
    var Vector = (function () {
        function Vector(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Object.defineProperty(Vector, "i", {
            get: function () { return new Vector(1, 0, 0); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Vector, "j", {
            get: function () { return new Vector(0, 1, 0); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Vector, "k", {
            get: function () { return new Vector(0, 0, 1); },
            enumerable: true,
            configurable: true
        });
        ;
        Vector.prototype.copy = function () {
            return new Vector(this.x, this.y, this.z);
        };
        Vector.prototype.add = function (v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
        };
        Vector.prototype.subtract = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            return this;
        };
        Vector.prototype.scale = function (c) {
            this.x *= c;
            this.y *= c;
            this.z *= c;
            return this;
        };
        Vector.prototype.vectorScale = function (v) {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
            return this;
        };
        Vector.prototype.plus = function (v) {
            return this.copy().add(v);
        };
        Vector.prototype.minus = function (v) {
            return this.copy().subtract(v);
        };
        Vector.prototype.scaledBy = function (c) {
            return this.copy().scale(c);
        };
        Vector.prototype.vectorScaledBy = function (v) {
            return this.copy().vectorScale(v);
        };
        Vector.prototype.dot = function (v) {
            return (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
        };
        Vector.prototype.cross = function (v) {
            return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
        };
        Vector.prototype.length = function () {
            return Math.sqrt(this.dot(this));
        };
        Vector.prototype.normalize = function () {
            this.scale(1 / this.length());
            return this;
        };
        Vector.prototype.getReflection = function (normal) {
            return this.minus(normal.scaledBy(2 * normal.dot(this)));
        };
        return Vector;
    })();
    RT.Vector = Vector;
})(RT || (RT = {}));
