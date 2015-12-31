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
var RT;
(function (RT) {
    // class storing point in color space using red, green, and blue components ranging from 0 to 1
    var Color = (function () {
        function Color(r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;
        }
        Object.defineProperty(Color, "BLACK", {
            get: function () { return new Color(0, 0, 0); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Color, "WHITE", {
            get: function () { return new Color(1, 1, 1); },
            enumerable: true,
            configurable: true
        });
        ;
        // create a color by calculating RGB components given hue, saturation, and lightness
        // HSL conversion algorithm found at http://www.geekymonkey.com/Programming/CSharp/RGB2HSL_HSL2RGB.htm
        Color.fromHSL = function (h, sl, l) {
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
        };
        Color.prototype.copy = function () {
            return new Color(this.r, this.g, this.b);
        };
        Color.prototype.add = function (c) {
            this.r += c.r;
            this.g += c.g;
            this.b += c.b;
            return this;
        };
        Color.prototype.subtract = function (c) {
            this.r -= c.r;
            this.g -= c.g;
            this.b -= c.b;
            return this;
        };
        Color.prototype.scale = function (c) {
            this.r *= c;
            this.g *= c;
            this.b *= c;
            return this;
        };
        Color.prototype.multiplyBy = function (c) {
            this.r *= c.r;
            this.g *= c.g;
            this.b *= c.b;
            return this;
        };
        // restrict color components to values <= 1
        Color.prototype.cap = function () {
            this.r = Math.min(1, this.r);
            this.g = Math.min(1, this.g);
            this.b = Math.min(1, this.b);
            return this;
        };
        Color.prototype.plus = function (v) {
            return this.copy().add(v);
        };
        Color.prototype.minus = function (v) {
            return this.copy().subtract(v);
        };
        Color.prototype.scaledBy = function (c) {
            return this.copy().scale(c);
        };
        Color.prototype.times = function (c) {
            return this.copy().multiplyBy(c);
        };
        Color.prototype.toString = function () {
            var r = Math.floor(this.r * 255);
            var g = Math.floor(this.g * 255);
            var b = Math.floor(this.b * 255);
            return 'rgb(' + r + ',' + g + ',' + b + ')';
        };
        return Color;
    })();
    RT.Color = Color;
})(RT || (RT = {}));
var RT;
(function (RT) {
    var Utils;
    (function (Utils) {
        function set(dest, src) {
            for (var key in src) {
                if (src.hasOwnProperty(key)) {
                    dest[key] = src[key];
                }
            }
        }
        Utils.set = set;
    })(Utils = RT.Utils || (RT.Utils = {}));
})(RT || (RT = {}));
/// <reference path="Color.ts" />
/// <reference path="GeometricObject.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Utils.ts" />
var RT;
(function (RT) {
    var MaterialLighting = (function () {
        function MaterialLighting() {
            this.color = RT.Color.BLACK;
            this.ambient = 0.1;
            this.shininess = 100;
            this.reflection = 0;
            this.refraction = 0;
            this.refractiveIndex = 1.3;
        }
        return MaterialLighting;
    })();
    RT.MaterialLighting = MaterialLighting;
    var SimpleMaterial = (function () {
        function SimpleMaterial(lighting) {
            this.lighting = lighting;
        }
        SimpleMaterial.prototype.getLighting = function (geo, point) {
            return this.lighting;
        };
        return SimpleMaterial;
    })();
    RT.SimpleMaterial = SimpleMaterial;
    var Material;
    (function (Material) {
        var glassLighting = new MaterialLighting();
        glassLighting.refraction = 1;
        var glass = new SimpleMaterial(glassLighting);
        var mirrorLighting = new MaterialLighting();
        mirrorLighting.reflection = 1;
        var mirror = new SimpleMaterial(mirrorLighting);
        Material.PRESETS = {
            'glass': glass,
            'mirror': mirror
        };
    })(Material = RT.Material || (RT.Material = {}));
})(RT || (RT = {}));
/// <reference path="GeometricObject.ts" />
/// <reference path="Material.ts" />
/// <reference path="Vector.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RT;
(function (RT) {
    // this is generic so the scene graph maker can know if scene object shapes are boundable
    var GenericSceneObject = (function () {
        function GenericSceneObject(geometry, material) {
            this.geometry = geometry;
            this.material = material;
        }
        GenericSceneObject.prototype.getMaterialLighting = function (point) {
            return this.material.getLighting(this.geometry, point);
        };
        GenericSceneObject.prototype.getGeometry = function () {
            return this.geometry;
        };
        return GenericSceneObject;
    })();
    RT.GenericSceneObject = GenericSceneObject;
    var SceneObject = (function (_super) {
        __extends(SceneObject, _super);
        function SceneObject() {
            _super.apply(this, arguments);
        }
        return SceneObject;
    })(GenericSceneObject);
    RT.SceneObject = SceneObject;
})(RT || (RT = {}));
/// <reference path="Vector.ts" />
/// <reference path="SceneObject.ts" />
var RT;
(function (RT) {
    RT.EPSILON = 0.000001;
    var Ray = (function () {
        function Ray(origin, direction) {
            this.origin = origin;
            this.direction = direction;
        }
        Ray.prototype.inchForward = function () {
            this.origin.add(this.direction.scaledBy(RT.EPSILON));
        };
        return Ray;
    })();
    RT.Ray = Ray;
    var BasicRayIntersection = (function () {
        function BasicRayIntersection() {
        }
        return BasicRayIntersection;
    })();
    RT.BasicRayIntersection = BasicRayIntersection;
    var RayIntersection = (function (_super) {
        __extends(RayIntersection, _super);
        function RayIntersection() {
            _super.apply(this, arguments);
            this.object = null;
        }
        return RayIntersection;
    })(BasicRayIntersection);
    RT.RayIntersection = RayIntersection;
    var GeometricObject = (function () {
        function GeometricObject() {
        }
        GeometricObject.prototype.findNormal = function (intersection) {
            var normal = this.calculateNormal(intersection);
            // ensure that normal vector is directed towards ray source
            // (this results in double-sided surfaces)
            if (normal.dot(intersection.incident) < 0)
                return normal;
            return normal.scaledBy(-1);
        };
        return GeometricObject;
    })();
    RT.GeometricObject = GeometricObject;
    var SimpleGeometricObject = (function (_super) {
        __extends(SimpleGeometricObject, _super);
        function SimpleGeometricObject() {
            _super.apply(this, arguments);
        }
        SimpleGeometricObject.prototype.obstructsShadowRay = function (shadowRay, distToLight) {
            var intersection = new BasicRayIntersection();
            return this.intersectsRay(shadowRay, intersection) && intersection.t < distToLight;
        };
        return SimpleGeometricObject;
    })(GeometricObject);
    RT.SimpleGeometricObject = SimpleGeometricObject;
})(RT || (RT = {}));
/// <reference path="Vector.ts" />
/// <reference path="GeometricObject.ts" />
var RT;
(function (RT) {
    var AxisAlignedBox = (function (_super) {
        __extends(AxisAlignedBox, _super);
        // create box given two opposite corners of an axis-aligned box
        function AxisAlignedBox(ll, ur) {
            _super.call(this);
            this.ll = ll;
            this.ur = ur;
        }
        // help from http://gamedev.stackexchange.com/questions/18436/most-efficient-aabb-vs-ray-collision-algorithms
        // a bit of copy and paste, but speed is essential here, and function calls would slow this down
        AxisAlignedBox.prototype.intersectsRay = function (ray, intersection) {
            var t1 = (this.ll.x - ray.origin.x) / ray.direction.x;
            var t2 = (this.ur.x - ray.origin.x) / ray.direction.x;
            var t3 = (this.ll.y - ray.origin.y) / ray.direction.y;
            var t4 = (this.ur.y - ray.origin.y) / ray.direction.y;
            var t5 = (this.ll.z - ray.origin.z) / ray.direction.z;
            var t6 = (this.ur.z - ray.origin.z) / ray.direction.z;
            var t12min;
            var t12minIndex;
            var t12max;
            var t12maxIndex;
            if (t1 < t2) {
                t12min = t1;
                t12minIndex = 1;
                t12max = t2;
                t12maxIndex = 2;
            }
            else {
                t12min = t2;
                t12minIndex = 2;
                t12max = t1;
                t12maxIndex = 1;
            }
            var t34min;
            var t34minIndex;
            var t34max;
            var t34maxIndex;
            if (t3 < t4) {
                t34min = t3;
                t34minIndex = 3;
                t34max = t4;
                t34maxIndex = 4;
            }
            else {
                t34min = t4;
                t34minIndex = 4;
                t34max = t3;
                t34maxIndex = 3;
            }
            var t56min;
            var t56minIndex;
            var t56max;
            var t56maxIndex;
            if (t5 < t6) {
                t56min = t5;
                t56minIndex = 5;
                t56max = t6;
                t56maxIndex = 6;
            }
            else {
                t56min = t6;
                t56minIndex = 6;
                t56max = t5;
                t56maxIndex = 5;
            }
            var tmin;
            var tminIndex;
            if (t12min > t34min) {
                tmin = t12min;
                tminIndex = t12minIndex;
            }
            else {
                tmin = t34min;
                tminIndex = t34minIndex;
            }
            if (t56min > tmin) {
                tmin = t56min;
                tminIndex = t56minIndex;
            }
            var tmax;
            var tmaxIndex;
            if (t12max < t34max) {
                tmax = t12max;
                tmaxIndex = t12maxIndex;
            }
            else {
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
        };
        AxisAlignedBox.prototype.calculateNormal = function (intersection) {
            return AxisAlignedBox.normals[intersection.geometricData - 1];
        };
        AxisAlignedBox.normals = [
            RT.Vector.i,
            RT.Vector.i.scale(-1),
            RT.Vector.j,
            RT.Vector.j.scale(-1),
            RT.Vector.k,
            RT.Vector.k.scale(-1)
        ];
        return AxisAlignedBox;
    })(RT.SimpleGeometricObject);
    RT.AxisAlignedBox = AxisAlignedBox;
})(RT || (RT = {}));
/// <reference path="Color.ts" />
/// <reference path="Vector.ts" />
var RT;
(function (RT) {
    var SolidColorBackground = (function () {
        function SolidColorBackground(color) {
            this.color = color;
        }
        SolidColorBackground.prototype.getColor = function (direction) {
            return this.color;
        };
        return SolidColorBackground;
    })();
    RT.SolidColorBackground = SolidColorBackground;
})(RT || (RT = {}));
/// <reference path="Vector.ts" />
/// <reference path="GeometricObject.ts" />
var RT;
(function (RT) {
    // camera class with necessary information and methods to generate rays from eye point to image plane
    // (plane is a bit of a misnomer, since it has a width and height)
    var Camera = (function () {
        function Camera(pose, up, focalLength, pixelWidth, pixelHeight) {
            this.eye = pose.origin;
            this.up = up;
            this.pixelWidth = pixelWidth;
            this.pixelHeight = pixelHeight;
            this.imagePlaneCenter = pose.origin.plus(pose.direction.scaledBy(focalLength));
            this.right = up.cross(pose.direction); // orthogonal to up and "out" vectors
            this.resize();
        }
        Object.defineProperty(Camera.prototype, "pixelWidth", {
            get: function () { return this._pixelWidth; },
            set: function (w) {
                this._pixelWidth = w;
                this.resize();
            },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Camera.prototype, "pixelHeight", {
            get: function () { return this._pixelHeight; },
            set: function (h) {
                this._pixelHeight = h;
                this.resize();
            },
            enumerable: true,
            configurable: true
        });
        ;
        ;
        ;
        Camera.prototype.resize = function () {
            // set the smaller of the dimensions equal to one unit in the scene space
            if (this.pixelHeight < this.pixelWidth) {
                this.imagePlaneHeight = 1;
                this.imagePlaneWidth = this.pixelWidth / this.pixelHeight;
            }
            else {
                this.imagePlaneWidth = 1;
                this.imagePlaneHeight = this.pixelHeight / this.pixelWidth;
            }
        };
        // generate ray from eye point to point on image plane corresponding to location in image space
        // (row and col can be fractional to allow for subpixel sampling)
        Camera.prototype.generateRay = function (row, col) {
            var rightCoefficient = (col - this.pixelWidth / 2) / this.pixelWidth * this.imagePlaneWidth;
            var upCoefficient = (this.pixelHeight / 2 - row) / this.pixelHeight * this.imagePlaneHeight;
            var right = this.right.scaledBy(rightCoefficient);
            var up = this.up.scaledBy(upCoefficient);
            var target = this.imagePlaneCenter.plus(right).plus(up);
            var direction = target.minus(this.eye).normalize();
            return new RT.Ray(this.eye, direction);
        };
        return Camera;
    })();
    RT.Camera = Camera;
})(RT || (RT = {}));
/// <reference path="Color.ts" />
/// <reference path="GeometricObject.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Material.ts" />
var RT;
(function (RT) {
    var CheckeredMaterial = (function () {
        function CheckeredMaterial(lighting, color2) {
            this.lighting = lighting;
            this.color2 = color2;
            this.color1 = lighting.color;
        }
        CheckeredMaterial.prototype.getLighting = function (geo, point) {
            this.lighting.color = this.testPoint(point) ? this.color1 : this.color2;
            return this.lighting;
        };
        return CheckeredMaterial;
    })();
    RT.CheckeredMaterial = CheckeredMaterial;
    var XZCheckeredMaterial = (function (_super) {
        __extends(XZCheckeredMaterial, _super);
        function XZCheckeredMaterial() {
            _super.apply(this, arguments);
        }
        XZCheckeredMaterial.prototype.testPoint = function (point) {
            var x = Math.floor(point.x);
            var z = Math.floor(point.z);
            return (x + z) % 2 == 0;
        };
        return XZCheckeredMaterial;
    })(CheckeredMaterial);
    RT.XZCheckeredMaterial = XZCheckeredMaterial;
    var XZDiamondCheckeredMaterial = (function (_super) {
        __extends(XZDiamondCheckeredMaterial, _super);
        function XZDiamondCheckeredMaterial() {
            _super.apply(this, arguments);
        }
        XZDiamondCheckeredMaterial.prototype.testPoint = function (point) {
            var u = Math.floor(point.x - point.z);
            var v = Math.floor(point.x + point.z);
            return (u + v) % 2 == 0;
        };
        return XZDiamondCheckeredMaterial;
    })(CheckeredMaterial);
    RT.XZDiamondCheckeredMaterial = XZDiamondCheckeredMaterial;
})(RT || (RT = {}));
/// <reference path="Vector.ts" />
/// <reference path="GeometricObject.ts" />
var RT;
(function (RT) {
    // infinite right cylinder, let's not get too complicated
    var Cylinder = (function (_super) {
        __extends(Cylinder, _super);
        function Cylinder(axis, radius) {
            _super.call(this);
            this.axis = axis;
            this.radius = radius;
        }
        Cylinder.prototype.intersectsRay = function (ray, intersection) {
            var vr = ray.direction;
            var vc = this.axis.direction;
            var dp = ray.origin.minus(this.axis.origin);
            var temp = vr.minus(vc.scaledBy(vr.dot(vc)));
            var temp2 = dp.minus(vc.scaledBy(dp.dot(vc)));
            var A = temp.dot(temp);
            var B = 2 * temp.dot(temp2);
            var C = temp2.dot(temp2) - this.radius * this.radius;
            var discriminant = B * B - 4 * A * C;
            // solve for t using the quadratic formula
            if (discriminant < 0)
                return false;
            var t0 = (-B + Math.sqrt(discriminant)) / (2 * A);
            var t1 = (-B - Math.sqrt(discriminant)) / (2 * A);
            if (t0 < 0 && t1 < 0)
                return false;
            if (t0 < 0)
                intersection.t = t1;
            else if (t1 < 0)
                intersection.t = t0;
            else
                intersection.t = Math.min(t0, t1);
            return true;
        };
        Cylinder.prototype.calculateNormal = function (intersection) {
            var diff = intersection.point.minus(this.axis.origin);
            return diff.minus(this.axis.direction.scaledBy(diff.dot(this.axis.direction))).normalize();
        };
        return Cylinder;
    })(RT.SimpleGeometricObject);
    RT.Cylinder = Cylinder;
})(RT || (RT = {}));
/// <reference path="Color.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Background.ts" />
var RT;
(function (RT) {
    var PhiGradientBackground = (function () {
        function PhiGradientBackground(color1, color2, n, axis) {
            this.color1 = color1;
            this.color2 = color2;
            this.n = n;
            this.axis = axis;
            this.c = Math.pow(2, n - 1);
        }
        PhiGradientBackground.prototype.oddpow = function (t) {
            return Math.pow(Math.abs(t), this.n + 1) / t;
        };
        PhiGradientBackground.prototype.getColor = function (direction) {
            var rho = direction.length();
            var cosPhi = direction.dot(this.axis) / rho;
            var t = (cosPhi + 1) / 2;
            var t2;
            if (t < 0.5)
                t2 = this.c * this.oddpow(t);
            else
                t2 = 1 + this.c * this.oddpow(t - 1);
            return this.color1.plus(this.color2.minus(this.color1).scaledBy(t2));
        };
        return PhiGradientBackground;
    })();
    RT.PhiGradientBackground = PhiGradientBackground;
})(RT || (RT = {}));
/// <reference path="Vector.ts" />
/// <reference path="GeometricObject.ts" />
var RT;
(function (RT) {
    var Plane = (function (_super) {
        __extends(Plane, _super);
        function Plane(normal, offset) {
            _super.call(this);
            this.normal = normal;
            this.offset = offset;
        }
        Plane.prototype.intersectsRay = function (ray, intersection) {
            var u = this.normal.scaledBy(-this.offset).minus(ray.origin);
            var denominator = ray.direction.dot(this.normal);
            if (denominator == 0)
                return false;
            intersection.t = u.dot(this.normal) / denominator;
            if (intersection.t < 0)
                return false;
            return true;
        };
        Plane.prototype.calculateNormal = function (intersection) {
            return this.normal;
        };
        return Plane;
    })(RT.SimpleGeometricObject);
    RT.Plane = Plane;
})(RT || (RT = {}));
/// <reference path="Vector.ts" />
/// <reference path="GeometricObject.ts" />
var RT;
(function (RT) {
    var Sphere = (function (_super) {
        __extends(Sphere, _super);
        function Sphere(center, radius) {
            _super.call(this);
            this.center = center;
            this.radius = radius;
        }
        Sphere.prototype.intersectsRay = function (ray, intersection) {
            var temp = ray.origin.minus(this.center);
            var B = ray.direction.dot(temp) * 2;
            var C = temp.dot(temp) - this.radius * this.radius;
            // solve for t using the quadratic formula
            var discriminant = B * B - 4 * C;
            if (discriminant < 0)
                return false;
            // intersects line
            var t0 = (-B + Math.sqrt(discriminant)) / 2;
            var t1 = (-B - Math.sqrt(discriminant)) / 2;
            if (t0 < 0 && t1 < 0)
                return false;
            // intersects ray
            if (t0 < 0)
                intersection.t = t1;
            else if (t1 < 0)
                intersection.t = t0;
            else
                intersection.t = Math.min(t0, t1);
            return true;
        };
        Sphere.prototype.getAxisAlignedBoundaryPoints = function () {
            var points = new Array(6);
            for (var i = 0; i < 6; i++)
                points[i] = this.center.copy();
            points[0].x += this.radius;
            points[1].x -= this.radius;
            points[2].y += this.radius;
            points[3].y -= this.radius;
            points[4].z += this.radius;
            points[5].z -= this.radius;
            return points;
        };
        Sphere.prototype.getReferencePoint = function () {
            return this.center;
        };
        Sphere.prototype.calculateNormal = function (intersection) {
            return intersection.point.minus(this.center).scaledBy(1 / this.radius);
        };
        return Sphere;
    })(RT.SimpleGeometricObject);
    RT.Sphere = Sphere;
})(RT || (RT = {}));
/// <reference path="SceneObject.ts" />
/// <reference path="GeometricObject.ts" />
var RT;
(function (RT) {
    var SceneGraph;
    (function (SceneGraph) {
        var Node = (function () {
            function Node(type, value, boundingShape) {
                if (boundingShape === void 0) { boundingShape = null; }
                this.type = type;
                this.value = value;
                this.boundingShape = boundingShape;
            }
            return Node;
        })();
        SceneGraph.Node = Node;
        ;
        var BoundableSceneObject = (function (_super) {
            __extends(BoundableSceneObject, _super);
            function BoundableSceneObject() {
                _super.apply(this, arguments);
            }
            return BoundableSceneObject;
        })(RT.GenericSceneObject);
        SceneGraph.BoundableSceneObject = BoundableSceneObject;
        function getAxisAlignedBoundingBox(objects) {
            var min = new RT.Vector(Infinity, Infinity, Infinity);
            var max = new RT.Vector(-Infinity, -Infinity, -Infinity);
            for (var _i = 0; _i < objects.length; _i++) {
                var obj = objects[_i];
                for (var _a = 0, _b = obj.getGeometry().getAxisAlignedBoundaryPoints(); _a < _b.length; _a++) {
                    var point = _b[_a];
                    if (point.x < min.x)
                        min.x = point.x;
                    if (point.x > max.x)
                        max.x = point.x;
                    if (point.y < min.y)
                        min.y = point.y;
                    if (point.y > max.y)
                        max.y = point.y;
                    if (point.z < min.z)
                        min.z = point.z;
                    if (point.z > max.z)
                        max.z = point.z;
                }
            }
            return new RT.AxisAlignedBox(min, max);
        }
        SceneGraph.getAxisAlignedBoundingBox = getAxisAlignedBoundingBox;
        function groupObjects(objects, maxGroupSize, parent) {
            if (objects.length <= maxGroupSize) {
                for (var _i = 0; _i < objects.length; _i++) {
                    var obj = objects[_i];
                    var node = new SceneGraph.Node(0 /* Object */, obj);
                    parent.value.push(node);
                }
            }
            else {
                var ref = objects[0].getGeometry().getReferencePoint();
                objects.sort(function (a, b) {
                    var refA = a.getGeometry().getReferencePoint();
                    var refB = b.getGeometry().getReferencePoint();
                    return refA.minus(ref).length() - refB.minus(ref).length();
                });
                var closest = objects.splice(0, Math.floor(objects.length / 2));
                var closestNode = new SceneGraph.Node(1 /* Collection */, [], SceneGraph.getAxisAlignedBoundingBox(closest));
                parent.value.push(closestNode);
                groupObjects(closest, maxGroupSize, closestNode);
                var furthest = objects; // those that remain after the splice
                var furthestNode = new SceneGraph.Node(1 /* Collection */, [], SceneGraph.getAxisAlignedBoundingBox(furthest));
                parent.value.push(furthestNode);
                groupObjects(furthest, maxGroupSize, furthestNode);
            }
        }
        function generateFromSceneObjects(objects, maxSubgraphSize) {
            if (maxSubgraphSize === void 0) { maxSubgraphSize = 2; }
            var parentNode = new SceneGraph.Node(1 /* Collection */, [], SceneGraph.getAxisAlignedBoundingBox(objects));
            groupObjects(objects, maxSubgraphSize, parentNode);
            return [parentNode];
        }
        SceneGraph.generateFromSceneObjects = generateFromSceneObjects;
        function generateFromShapes(shapes, material) {
            var objects = new Array(shapes.length);
            for (var i = 0; i < shapes.length; i++)
                objects[i] = new BoundableSceneObject(shapes[i], material);
            return generateFromSceneObjects(objects, 2);
        }
        SceneGraph.generateFromShapes = generateFromShapes;
    })(SceneGraph = RT.SceneGraph || (RT.SceneGraph = {}));
})(RT || (RT = {}));
/// <reference path="Vector.ts" />
/// <reference path="GeometricObject.ts" />
/// <reference path="SceneGraph.ts" />
var RT;
(function (RT) {
    var Triangle = (function (_super) {
        __extends(Triangle, _super);
        function Triangle(A, B, C) {
            _super.call(this);
            this.A = A;
            this.B = B;
            this.C = C;
            this.normalA = null;
            this.normalB = null;
            this.normalC = null;
            this.AB = B.minus(A);
            this.AC = C.minus(A);
            this.normal = this.AB.cross(this.AC).normalize();
        }
        Triangle.prototype.enableNormalInterpolation = function (nA, nB, nC) {
            this.normalA = nA;
            this.normalB = nB;
            this.normalC = nC;
        };
        Triangle.prototype.intersectsRay = function (ray, intersection) {
            var pvec = ray.direction.cross(this.AC);
            var det = this.AB.dot(pvec);
            if (Math.abs(det) < RT.EPSILON)
                return false;
            var invDet = 1 / det;
            var tvec = ray.origin.minus(this.A);
            var u = tvec.dot(pvec) * invDet;
            if (u < 0 || u > 1)
                return false;
            var qvec = tvec.cross(this.AB);
            var v = ray.direction.dot(qvec) * invDet;
            if (v < 0 || u + v > 1)
                return false;
            intersection.u = u;
            intersection.v = v;
            intersection.t = this.AC.dot(qvec) * invDet;
            return intersection.t >= 0;
        };
        Triangle.prototype.getAxisAlignedBoundaryPoints = function () {
            return [this.A, this.B, this.C];
        };
        Triangle.prototype.getReferencePoint = function () {
            return this.A;
        };
        Triangle.prototype.calculateNormal = function (intersection) {
            if (this.normalA == null)
                return this.normal;
            // normal interpolation enabled
            var weightedA = this.normalA.scaledBy(1 - intersection.u - intersection.v);
            var weightedB = this.normalB.scaledBy(intersection.u);
            var weightedC = this.normalC.scaledBy(intersection.v);
            return weightedA.plus(weightedB.plus(weightedC));
        };
        return Triangle;
    })(RT.SimpleGeometricObject);
    RT.Triangle = Triangle;
})(RT || (RT = {}));
/// <reference path="SceneGraph.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Material.ts" />
/// <reference path="AxisAlignedBox.ts" />
/// <reference path="SceneObject.ts" />
/// <reference path="Color.ts" />
var RT;
(function (RT) {
    var MengerSponge = (function () {
        function MengerSponge() {
            this.sceneGraph = [];
        }
        // split box into sub-boxes to add, or add box if depth has been reached
        MengerSponge.prototype.addBox = function (ll, ur, sceneGraph, depth) {
            // end of recursion
            if (depth == 0) {
                var geo = new RT.AxisAlignedBox(ll, ur);
                var box = new RT.SceneObject(geo, this.material);
                var nodeType = 0 /* Object */;
                var node = new RT.SceneGraph.Node(nodeType, box);
                sceneGraph.push(node);
                return;
            }
            // split box into 3x3x3 grid
            var step = ur.minus(ll).scaledBy(1 / 3);
            for (var x = 0; x < 3; x++) {
                for (var y = 0; y < 3; y++) {
                    for (var z = 0; z < 3; z++) {
                        // we only want "lines" of boxes cut out, not "planes"
                        var centerCount = (x == 1 ? 1 : 0) + (y == 1 ? 1 : 0) + (z == 1 ? 1 : 0);
                        if (centerCount >= 2)
                            continue;
                        var newLl = ll.copy();
                        newLl.add(step.vectorScaledBy(new RT.Vector(x, y, z)));
                        var newUr = newLl.plus(step.scaledBy(0.96));
                        var nodeType = 1 /* Collection */;
                        var subGraph = [];
                        var boundingBox = new RT.AxisAlignedBox(newLl, newUr);
                        var collectionNode = new RT.SceneGraph.Node(nodeType, subGraph, boundingBox);
                        sceneGraph.push(collectionNode);
                        // add lights in the center of bounding boxes
                        if (depth != 1) {
                            var lightPos = newLl.plus(newUr).scaledBy(1 / 2);
                            var lightIntensity = this.lightIntensity * Math.pow(0.5, this.depth - depth);
                            this.scene.lights.push(new RT.Light(lightPos, this.lightColor, lightIntensity));
                        }
                        this.addBox(newLl, newUr, subGraph, depth - 1);
                    }
                }
            }
        };
        MengerSponge.prototype.generateSceneGraphFromData = function (data, scene) {
            this.scene = scene;
            var ll = RT.Scene.loadVector(data.ll);
            var ur = RT.Scene.loadVector(data.ur);
            this.depth = data.depth;
            this.material = scene.materials[data.material];
            this.lightColor = data.lightColor ? RT.Scene.loadColor(data.lightColor) : RT.Color.WHITE;
            this.lightIntensity = data.lightIntensity || 0;
            this.addBox(ll, ur, this.sceneGraph, this.depth);
            return this.sceneGraph;
        };
        return MengerSponge;
    })();
    RT.MengerSponge = MengerSponge;
})(RT || (RT = {}));
/// <reference path="SceneGraph.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Material.ts" />
/// <reference path="Triangle.ts" />
/// <reference path="AxisAlignedBox.ts" />
/// <reference path="SceneObject.ts" />
/// <reference path="Color.ts" />
var RT;
(function (RT) {
    // produces a binary-ish tree of triangle nodes to form a mesh
    var Mesh = (function () {
        function Mesh() {
        }
        Mesh.prototype.loadTriangles = function (vertices, faceVertexCounts, faceVertexIndices, normalInterpolation) {
            var triangles = [];
            if (normalInterpolation) {
                var vertexNormalLists = new Array(vertices.length);
                for (var i = 0; i < vertices.length; i++)
                    vertexNormalLists[i] = [];
                var triangleVertexIndices = [];
                var v = 0;
                for (var f = 0; f < faceVertexCounts.length; f++) {
                    for (var o = 1; o < faceVertexCounts[f] - 1; o++) {
                        var v1Index = faceVertexIndices[v];
                        var v2Index = faceVertexIndices[v + o];
                        var v3Index = faceVertexIndices[v + o + 1];
                        Array.prototype.push.apply(triangleVertexIndices, [v1Index, v2Index, v3Index]);
                        var triangle = new RT.Triangle(vertices[v1Index], vertices[v2Index], vertices[v3Index]);
                        triangles.push(triangle);
                        vertexNormalLists[v1Index].push(triangle.normal);
                        vertexNormalLists[v2Index].push(triangle.normal);
                        vertexNormalLists[v3Index].push(triangle.normal);
                    }
                    v += faceVertexCounts[f];
                }
                var vertexNormals = new Array(vertices.length);
                for (var i = 0; i < vertices.length; i++) {
                    var avgNormal = new RT.Vector(0, 0, 0);
                    for (var _i = 0, _a = vertexNormalLists[i]; _i < _a.length; _i++) {
                        var normal = _a[_i];
                        avgNormal.add(normal);
                    }
                    vertexNormals[i] = avgNormal.normalize();
                }
                for (var t = 0; t < triangles.length; t++) {
                    var normalA = vertexNormals[triangleVertexIndices[t * 3]];
                    var normalB = vertexNormals[triangleVertexIndices[t * 3 + 1]];
                    var normalC = vertexNormals[triangleVertexIndices[t * 3 + 2]];
                    triangles[t].enableNormalInterpolation(normalA, normalB, normalC);
                }
            }
            else {
                var v = 0;
                for (var f = 0; f < faceVertexCounts.length; f++) {
                    for (var o = 1; o < faceVertexCounts[f] - 1; o++) {
                        triangles.push(new RT.Triangle(vertices[faceVertexIndices[v]], vertices[faceVertexIndices[v + o]], vertices[faceVertexIndices[v + o + 1]]));
                    }
                    v += faceVertexCounts[f];
                }
            }
            return triangles;
        };
        Mesh.prototype.loadTrianglesFromFile = function (path, normalInterpolation) {
            var request = new XMLHttpRequest();
            request.open('GET', path, false); // bad form, but the program can't do anything until this loads
            request.send();
            var lines = request.responseText.split('\n');
            var counts = lines[1].split(' ');
            var numVertices = parseInt(counts[0], 10);
            var numFaces = parseInt(counts[1], 10);
            var vertices = new Array(numVertices);
            var faceVertexCounts = new Array(numFaces);
            var faceVertexIndices = [];
            for (var l = 2; l < 2 + numVertices; l++) {
                var components = lines[l].split(' ').map(Number);
                vertices[l - 2] = RT.Scene.loadVector(components);
            }
            for (var l = 2 + numVertices; l < 2 + numVertices + numFaces; l++) {
                var nums = lines[l].split(' ').map(Number);
                // first number is vertex count
                faceVertexCounts[l - (2 + numVertices)] = nums.splice(0, 1)[0];
                // remaining numbers are vertex indices
                Array.prototype.push.apply(faceVertexIndices, nums);
            }
            return this.loadTriangles(vertices, faceVertexCounts, faceVertexIndices, normalInterpolation);
        };
        Mesh.prototype.generateSceneGraph = function (vertices, faceVertexCounts, faceVertexIndices, normalInterpolation, material) {
            var triangles = this.loadTriangles(vertices, faceVertexCounts, faceVertexIndices, normalInterpolation);
            return RT.SceneGraph.generateFromShapes(triangles, material);
        };
        Mesh.prototype.generateSceneGraphFromData = function (data, scene) {
            var triangles = this.loadTrianglesFromFile(data.filePath, data.normalInterpolation);
            return RT.SceneGraph.generateFromShapes(triangles, scene.materials[data.material]);
        };
        return Mesh;
    })();
    RT.Mesh = Mesh;
})(RT || (RT = {}));
/// <reference path="SceneGraph.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Material.ts" />
/// <reference path="AxisAlignedBox.ts" />
/// <reference path="SceneObject.ts" />
/// <reference path="Color.ts" />
var RT;
(function (RT) {
    var SphereHelix = (function () {
        function SphereHelix() {
        }
        SphereHelix.prototype.generateSceneGraphFromData = function (data, scene) {
            var lighting = new RT.MaterialLighting();
            var point = RT.Scene.loadVector(data.point);
            var direction = RT.Scene.loadVector(data.direction).normalize();
            if (direction.z != 0)
                var up = new RT.Vector(1, 1, -(direction.x + direction.y) / direction.z);
            else if (direction.y != 0)
                var up = new RT.Vector(1, 1, -(direction.x + direction.z) / direction.y);
            else
                var up = new RT.Vector(1, 1, -(direction.z + direction.y) / direction.x);
            up.normalize();
            var right = up.cross(direction).normalize();
            var start = data.start;
            var stop = data.stop;
            var step = data.step;
            var sphereR = data.sphereRadius;
            var helixR = data.helixRadius;
            var spheres = [];
            for (var t = start; t < stop; t += step) {
                var axisPos = point.plus(direction.scaledBy(t));
                var rightC = helixR * Math.cos(2 * Math.PI * t);
                var upC = helixR * Math.sin(2 * Math.PI * t);
                var offset = right.scaledBy(rightC).plus(up.scaledBy(upC));
                var sphereCtr = axisPos.plus(offset);
                var sphereGeo = new RT.Sphere(sphereCtr, sphereR);
                var lighting = new RT.MaterialLighting();
                lighting.color = RT.Color.fromHSL((0.75 + t * 0.8) % 1, 0.8, 0.5);
                var sphereMat = new RT.SimpleMaterial(lighting);
                var sphere = new RT.GenericSceneObject(sphereGeo, sphereMat);
                spheres.push(sphere);
            }
            return RT.SceneGraph.generateFromSceneObjects(spheres);
        };
        return SphereHelix;
    })();
    RT.SphereHelix = SphereHelix;
})(RT || (RT = {}));
/// <reference path="SceneGraph.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Material.ts" />
/// <reference path="Mesh.ts" />
/// <reference path="SceneObject.ts" />
/// <reference path="Color.ts" />
var RT;
(function (RT) {
    var XZSurface = (function (_super) {
        __extends(XZSurface, _super);
        function XZSurface() {
            _super.apply(this, arguments);
        }
        XZSurface.prototype.getIndex = function (i, j, surface) {
            var verticesPerLayer = (this.gridSize + 1) * (this.gridSize + 1);
            return (i * (this.gridSize + 1)) + j + verticesPerLayer * surface;
        };
        XZSurface.prototype.getVertices = function () {
            var vertices = new Array(2 * (this.gridSize + 1) * (this.gridSize + 1));
            var dx = (this.xMax - this.xMin) / this.gridSize;
            var dz = (this.zMax - this.zMin) / this.gridSize;
            for (var i = 0; i <= this.gridSize; i++) {
                for (var j = 0; j <= this.gridSize; j++) {
                    var currX = this.xMin + i * dx;
                    var currZ = this.zMin + j * dz;
                    // bottom surface vertex
                    vertices[this.getIndex(i, j, 0)] = new RT.Vector(currX, this.fn(currX, currZ), currZ);
                    // top surface vertex
                    vertices[this.getIndex(i, j, 1)] = new RT.Vector(currX, this.fn(currX, currZ) + this.thickness, currZ);
                }
            }
            return vertices;
        };
        XZSurface.prototype.getFaceVertexCounts = function () {
            var vertexCounts = new Array(2 * this.gridSize * this.gridSize + 4 * this.gridSize);
            for (var i = 0; i < vertexCounts.length; i++)
                vertexCounts[i] = 4;
            return vertexCounts;
        };
        XZSurface.prototype.getFaceVertexIndices = function () {
            var faceVertexIndices = [];
            for (var i = 0; i < this.gridSize; i++) {
                for (var j = 0; j < this.gridSize; j++) {
                    // bottom surface face
                    faceVertexIndices.push(this.getIndex(i + 1, j, 0));
                    faceVertexIndices.push(this.getIndex(i, j, 0));
                    faceVertexIndices.push(this.getIndex(i, j + 1, 0));
                    faceVertexIndices.push(this.getIndex(i + 1, j + 1, 0));
                    // top surface face
                    faceVertexIndices.push(this.getIndex(i, j, 1));
                    faceVertexIndices.push(this.getIndex(i, j + 1, 1));
                    faceVertexIndices.push(this.getIndex(i + 1, j + 1, 1));
                    faceVertexIndices.push(this.getIndex(i + 1, j, 1));
                }
            }
            // go around adding side faces to make mesh seamless
            for (var i = 0; i < this.gridSize; i++) {
                faceVertexIndices.push(this.getIndex(i, 0, 0));
                faceVertexIndices.push(this.getIndex(i + 1, 0, 0));
                faceVertexIndices.push(this.getIndex(i + 1, 0, 1));
                faceVertexIndices.push(this.getIndex(i + 0, 0, 1));
                faceVertexIndices.push(this.getIndex(i, this.gridSize, 0));
                faceVertexIndices.push(this.getIndex(i + 1, this.gridSize, 0));
                faceVertexIndices.push(this.getIndex(i + 1, this.gridSize, 1));
                faceVertexIndices.push(this.getIndex(i + 0, this.gridSize, 1));
                faceVertexIndices.push(this.getIndex(0, i, 0));
                faceVertexIndices.push(this.getIndex(0, i + 1, 0));
                faceVertexIndices.push(this.getIndex(0, i + 1, 1));
                faceVertexIndices.push(this.getIndex(0, i, 1));
                faceVertexIndices.push(this.getIndex(this.gridSize, i, 0));
                faceVertexIndices.push(this.getIndex(this.gridSize, i + 1, 0));
                faceVertexIndices.push(this.getIndex(this.gridSize, i + 1, 1));
                faceVertexIndices.push(this.getIndex(this.gridSize, i, 1));
            }
            return faceVertexIndices;
        };
        XZSurface.prototype.generateSceneGraphFromData = function (data, scene) {
            this.fn = data.fn;
            this.xMin = data.xMin;
            this.xMax = data.xMax;
            this.zMin = data.zMin;
            this.zMax = data.zMax;
            this.thickness = data.thickness;
            this.gridSize = data.gridSize;
            var vertices = this.getVertices();
            var faceVertexCounts = this.getFaceVertexCounts();
            var faceVertexIndices = this.getFaceVertexIndices();
            var material = scene.materials[data.material];
            return _super.prototype.generateSceneGraph.call(this, vertices, faceVertexCounts, faceVertexIndices, false, material);
        };
        return XZSurface;
    })(RT.Mesh);
    RT.XZSurface = XZSurface;
    var RippledSurface = (function (_super) {
        __extends(RippledSurface, _super);
        function RippledSurface() {
            _super.apply(this, arguments);
        }
        RippledSurface.prototype.generateSceneGraphFromData = function (data, scene) {
            data.fn = function (x, z) {
                var r = x * x + z * z;
                return Math.sin(2 * r) / (2 + r);
            };
            return _super.prototype.generateSceneGraphFromData.call(this, data, scene);
        };
        return RippledSurface;
    })(XZSurface);
    RT.RippledSurface = RippledSurface;
})(RT || (RT = {}));
/// <reference path="Camera.ts" />
/// <reference path="Background.ts" />
/// <reference path="PhiGradientBackground.ts" />
/// <reference path="Color.ts" />
/// <reference path="Light.ts" />
/// <reference path="Plane.ts" />
/// <reference path="Sphere.ts" />
/// <reference path="Cylinder.ts" />
/// <reference path="Triangle.ts" />
/// <reference path="AxisAlignedBox.ts" />
/// <reference path="MengerSponge.ts" />
/// <reference path="Mesh.ts" />
/// <reference path="SphereHelix.ts" />
/// <reference path="XZSurface.ts" />
/// <reference path="Material.ts" />
/// <reference path="CheckeredMaterial.ts" />
/// <reference path="GeometricObject.ts" />
/// <reference path="SceneObject.ts" />
/// <reference path="SceneGraph.ts" />
var RT;
(function (RT) {
    var Scene = (function () {
        function Scene(data) {
            this.renderSettings = {};
            this.renderSettings.camera = Scene.loadCamera(data.renderSettings.camera);
            this.renderSettings.subpixelGridSize = data.renderSettings.subpixelGridSize || 3;
            this.renderSettings.recursionDepth = data.renderSettings.recursionDepth || 10;
            this.background = Scene.loadBackground(data.background);
            this.lights = [];
            if (data.lights)
                for (var _i = 0, _a = data.lights; _i < _a.length; _i++) {
                    var lightData = _a[_i];
                    this.lights.push(Scene.loadLight(lightData));
                }
            this.materials = {};
            if (data.materials)
                for (var matName in data.materials)
                    this.materials[matName] = Scene.loadMaterial(data.materials[matName]);
            for (var matName in RT.Material.PRESETS)
                this.materials[matName] = (RT.Material.PRESETS[matName]);
            this.sceneGraph = [];
            for (var _b = 0, _c = data.sceneGraph; _b < _c.length; _b++) {
                var nodeData = _c[_b];
                this.sceneGraph.push(this.loadSceneGraphNode(nodeData));
            }
        }
        Scene.loadVector = function (values) {
            return new RT.Vector(values[0], values[1], values[2]);
        };
        Scene.loadColor = function (values) {
            return new RT.Color(values[0], values[1], values[2]);
        };
        Scene.loadCamera = function (data) {
            var eye = Scene.loadVector(data.eye);
            var direction = Scene.loadVector(data.direction).normalize();
            var pose = new RT.Ray(eye, direction);
            var up = Scene.loadVector(data.up).normalize();
            return new RT.Camera(pose, up, data.focalLength, data.pixelWidth, data.pixelHeight);
        };
        Scene.loadBackground = function (data) {
            switch (data.type) {
                case 'solid-color':
                    var color = Scene.loadColor(data.color);
                    return new RT.SolidColorBackground(color);
                case 'phi-gradient':
                    var color1 = Scene.loadColor(data.color1);
                    var color2 = Scene.loadColor(data.color2);
                    var axis = Scene.loadVector(data.axis);
                    return new RT.PhiGradientBackground(color1, color2, data.n, axis);
            }
        };
        Scene.loadLight = function (data) {
            var position = Scene.loadVector(data.position);
            var color = Scene.loadColor(data.color);
            return new RT.Light(position, color, data.intensity);
        };
        Scene.loadMaterial = function (data) {
            var checkered = (data.type.indexOf('checkered') != -1);
            if (data.type == 'simple' || checkered) {
                var lighting = new RT.MaterialLighting();
                if (checkered)
                    lighting.color = Scene.loadColor(data.color1);
                else if (data.color)
                    lighting.color = Scene.loadColor(data.color);
                for (var _i = 0, _a = Scene.materialProps; _i < _a.length; _i++) {
                    var prop = _a[_i];
                    if (data.hasOwnProperty(prop))
                        lighting[prop] = data[prop];
                }
                if (checkered) {
                    var color2 = Scene.loadColor(data.color2);
                    var pattern = (data.type == 'xz-checkered') ? RT.XZCheckeredMaterial : RT.XZDiamondCheckeredMaterial;
                    return new pattern(lighting, color2);
                }
                return new RT.SimpleMaterial(lighting);
            }
        };
        Scene.loadGeometricObject = function (data) {
            switch (data.type) {
                case 'sphere':
                    var center = Scene.loadVector(data.center);
                    return new RT.Sphere(center, data.radius);
                case 'plane':
                    var normal = Scene.loadVector(data.normal).normalize();
                    return new RT.Plane(normal, data.offset);
                case 'cylinder':
                    var point = Scene.loadVector(data.point);
                    var direction = Scene.loadVector(data.direction).normalize();
                    return new RT.Cylinder(new RT.Ray(point, direction), data.radius);
                case 'triangle':
                    var A = Scene.loadVector(data.A);
                    var B = Scene.loadVector(data.B);
                    var C = Scene.loadVector(data.C);
                    return new RT.Triangle(A, B, C);
                case 'axis-aligned-box':
                    var A = Scene.loadVector(data.A);
                    var B = Scene.loadVector(data.B);
                    return new RT.AxisAlignedBox(A, B);
            }
        };
        Scene.prototype.loadSceneObject = function (data) {
            var geo = Scene.loadGeometricObject(data.geometry);
            var mat = this.materials[data.material];
            return new RT.SceneObject(geo, mat);
        };
        Scene.prototype.loadSceneGraphNode = function (data) {
            var type;
            var value;
            switch (data.type) {
                case 'object':
                    type = 0 /* Object */;
                    value = this.loadSceneObject(data.value);
                    break;
                case 'collection':
                    type = 1 /* Collection */;
                    value = [];
                    for (var _i = 0, _a = data.value; _i < _a.length; _i++) {
                        var nodeData = _a[_i];
                        value.push(this.loadSceneGraphNode(nodeData));
                    }
                    break;
                case 'menger-sponge':
                case 'mesh':
                case 'sphere-helix':
                case 'rippled-surface':
                    type = 1 /* Collection */;
                    var sceneGraphGenerator = new Scene.sceneGraphGeneratorMap[data.type]();
                    value = sceneGraphGenerator.generateSceneGraphFromData(data.value, this);
                    break;
            }
            return new RT.SceneGraph.Node(type, value);
        };
        Scene.loadFromFile = function (path, callback) {
            var request = new XMLHttpRequest();
            request.onload = function () {
                var data = JSON.parse(this.responseText);
                callback(new Scene(data));
            };
            request.open('GET', path, true);
            request.send();
        };
        Scene.materialProps = ['ambient', 'shininess', 'reflection', 'refraction', 'refractiveIndex'];
        Scene.sceneGraphGeneratorMap = {
            'menger-sponge': RT.MengerSponge,
            'mesh': RT.Mesh,
            'sphere-helix': RT.SphereHelix,
            'rippled-surface': RT.RippledSurface
        };
        return Scene;
    })();
    RT.Scene = Scene;
})(RT || (RT = {}));
/// <reference path="Vector.ts" />
/// <reference path="Color.ts" />
/// <reference path="Material.ts" />
/// <reference path="GeometricObject.ts" />
/// <reference path="SceneObject.ts" />
/// <reference path="Scene.ts" />
var RT;
(function (RT) {
    var Light = (function () {
        function Light(position, color, intensity) {
            this.position = position;
            this.color = color;
            this.intensity = intensity;
        }
        Light.shadowRayIsObstructed = function (shadowRay, distToLight, sceneGraph) {
            for (var _i = 0; _i < sceneGraph.length; _i++) {
                var node = sceneGraph[_i];
                if (!node.boundingShape || node.boundingShape.obstructsShadowRay(shadowRay, distToLight)) {
                    switch (node.type) {
                        case 0 /* Object */:
                            var obj = node.value;
                            if (obj.getGeometry().obstructsShadowRay(shadowRay, distToLight))
                                return true;
                            break;
                        case 1 /* Collection */:
                            var subGraph = node.value;
                            if (Light.shadowRayIsObstructed(shadowRay, distToLight, subGraph))
                                return true;
                            break;
                    }
                }
            }
            return false;
        };
        Light.prototype.illuminate = function (lighting, intersection, sceneGraph) {
            var illumination = RT.Color.BLACK;
            // create shadow ray
            var L = this.position.minus(intersection.point);
            var distToLight = L.length();
            L.scale(1 / distToLight);
            var shadowRay = new RT.Ray(intersection.point, L);
            shadowRay.origin.add(L.plus(intersection.normal).scaledBy(RT.EPSILON));
            // if shadow ray isn't obstructed, continue with diffuse and specular illumination
            if (!Light.shadowRayIsObstructed(shadowRay, distToLight, sceneGraph)) {
                var attenuationFactor = this.intensity / Math.sqrt(0.002 * distToLight * distToLight + 0.02 * distToLight + 0.2);
                var attenuation = this.color.scaledBy(attenuationFactor);
                //diffuse illumination
                var dot = L.dot(intersection.normal);
                if (dot > 0)
                    illumination.add(lighting.color.times(attenuation).scaledBy(dot));
                //specular illumination
                if (lighting.shininess > 0) {
                    var R = L.getReflection(intersection.normal).normalize();
                    dot = R.dot(intersection.incident);
                    if (dot > 0)
                        illumination.add(RT.Color.WHITE.times(attenuation).scaledBy(Math.pow(dot, lighting.shininess)));
                }
            }
            return illumination;
        };
        return Light;
    })();
    RT.Light = Light;
})(RT || (RT = {}));
/// <reference path="Vector.ts" />
/// <reference path="Color.ts" />
/// <reference path="Sphere.ts" />
/// <reference path="Plane.ts" />
/// <reference path="Material.ts" />
/// <reference path="SceneObject.ts" />
/// <reference path="Light.ts" />
/// <reference path="Utils.ts" />
/// <reference path="Scene.ts" />
var RT;
(function (RT) {
    var RayTracer = (function () {
        function RayTracer() {
        }
        // determine refracted ray direction given incident, normal, and refractive indices
        // refraction code found online at http://www.flipcode.com/archives/reflection_transmission.pdf
        // (TIR means total internal reflection)
        RayTracer.performRefraction = function (intersection, n1, n2) {
            var n = n1 / n2;
            var c1 = -intersection.incident.dot(intersection.normal);
            var c2 = 1 - n * n * (1 - c1 * c1);
            var refractedRayDirection;
            var TIR;
            // total internal reflection occurs
            if (c2 < 0) {
                refractedRayDirection = intersection.incident.getReflection(intersection.normal);
                TIR = true;
            }
            else {
                refractedRayDirection = intersection.incident.scaledBy(n).plus(intersection.normal.scaledBy(n * c1 - Math.sqrt(c2)));
                TIR = false;
            }
            return {
                refractedRayDirection: refractedRayDirection,
                TIR: TIR
            };
        };
        // search recursively through scene graph, using bounding shapes for optimization
        RayTracer.findNearestIntersectionR = function (ray, currentInt, sceneGraph) {
            for (var _i = 0; _i < sceneGraph.length; _i++) {
                var node = sceneGraph[_i];
                var tempInt = new RT.RayIntersection();
                if (!node.boundingShape || node.boundingShape.obstructsShadowRay(ray, Infinity)) {
                    switch (node.type) {
                        case 0 /* Object */:
                            var obj = node.value;
                            if (obj.getGeometry().intersectsRay(ray, tempInt)) {
                                if (currentInt.object == null || tempInt.t < currentInt.t) {
                                    RT.Utils.set(currentInt, tempInt);
                                    currentInt.object = obj;
                                }
                            }
                            break;
                        case 1 /* Collection */:
                            var subGraph = node.value;
                            RayTracer.findNearestIntersectionR(ray, currentInt, subGraph);
                            break;
                    }
                }
            }
        };
        RayTracer.prototype.findNearestIntersection = function (ray) {
            var nearestIntersection = new RT.RayIntersection();
            RayTracer.findNearestIntersectionR(ray, nearestIntersection, this.scene.sceneGraph);
            if (nearestIntersection.object == null)
                return null;
            nearestIntersection.point = ray.origin.plus(ray.direction.scaledBy(nearestIntersection.t));
            nearestIntersection.incident = ray.direction;
            nearestIntersection.normal = nearestIntersection.object.getGeometry().findNormal(nearestIntersection);
            return nearestIntersection;
        };
        RayTracer.prototype.traceRay = function (ray, insideObject, depth) {
            // prevent infinite recursion
            if (depth >= this.scene.renderSettings.recursionDepth)
                return RT.Color.BLACK;
            // find closest intersection
            var nearestIntersection = this.findNearestIntersection(ray);
            // if there was an intersection, return the color at that point
            if (nearestIntersection != null)
                return this.shadeObject(nearestIntersection, insideObject, depth);
            // otherwise, return the background color
            return this.scene.background.getColor(ray.direction);
        };
        RayTracer.prototype.shadeObject = function (intersection, insideObject, depth) {
            var color = RT.Color.BLACK;
            var lighting = intersection.object.getMaterialLighting(intersection.point);
            var reflection = lighting.reflection;
            var refraction = lighting.refraction;
            var remaining = 1 - reflection - refraction;
            if (remaining > RT.EPSILON) {
                // ambient illumination
                color.add(lighting.color.scaledBy(lighting.ambient));
                // diffuse and specular illuminations 
                // (loop through all lights)
                for (var _i = 0, _a = this.scene.lights; _i < _a.length; _i++) {
                    var light = _a[_i];
                    color.add(light.illuminate(lighting, intersection, this.scene.sceneGraph));
                }
                color.scale(remaining);
            }
            // calculate reflection contribution
            if (reflection != 0) {
                var reflectedRay = new RT.Ray(intersection.point, intersection.incident.getReflection(intersection.normal));
                reflectedRay.inchForward();
                var reflectedColor = this.traceRay(reflectedRay, insideObject, depth + 1);
                color.add(reflectedColor.scaledBy(reflection));
            }
            // calculate refraction contribution
            if (refraction != 0) {
                var n1, n2;
                // if ray is entering object
                if (insideObject) {
                    n1 = lighting.refractiveIndex;
                    n2 = 1; // index of air
                }
                else {
                    n1 = 1;
                    n2 = lighting.refractiveIndex;
                }
                var refractionResults = RayTracer.performRefraction(intersection, n1, n2);
                var refractedRay = new RT.Ray(intersection.point, refractionResults.refractedRayDirection);
                if (!refractionResults.TIR)
                    insideObject = !insideObject;
                refractedRay.inchForward();
                var refractedColor = this.traceRay(refractedRay, insideObject, depth + 1);
                color.add(refractedColor.scaledBy(refraction));
            }
            return color;
        };
        RayTracer.prototype.render = function (paint) {
            var width = this.scene.renderSettings.camera.pixelWidth;
            var height = this.scene.renderSettings.camera.pixelHeight;
            var subpixelGridSize = this.scene.renderSettings.subpixelGridSize;
            var numSubpixels = subpixelGridSize * subpixelGridSize;
            var camera = this.scene.renderSettings.camera;
            var rowColors = new Array(width);
            var start = Date.now();
            for (var row = 0; row < height; row++) {
                for (var col = 0; col < width; col++) {
                    var pixelColor = RT.Color.BLACK;
                    for (var sr = 0; sr < subpixelGridSize; sr++) {
                        for (var sc = 0; sc < subpixelGridSize; sc++) {
                            var ray = camera.generateRay(row + sr / subpixelGridSize, col + sc / subpixelGridSize);
                            pixelColor.add(this.traceRay(ray, false, 0)); // assuming eye isn't inside object
                        }
                    }
                    pixelColor.scale(1 / numSubpixels).cap();
                    rowColors[col] = pixelColor.toString();
                }
                paint(rowColors, row);
            }
            console.log(((Date.now() - start) / 1000) + ' seconds');
        };
        return RayTracer;
    })();
    RT.RayTracer = RayTracer;
})(RT || (RT = {}));
var RT;
(function (RT) {
    var rayTracer = new RT.RayTracer();
    onmessage = function (e) {
        var message = e.data;
        if (message.command == 'load scene') {
            RT.Scene.loadFromFile(message.data, function (scene) {
                rayTracer.scene = scene;
                postMessage({
                    command: 'update scene data',
                    data: {
                        width: scene.renderSettings.camera.pixelWidth,
                        height: scene.renderSettings.camera.pixelHeight,
                        subpixelGridSize: scene.renderSettings.subpixelGridSize,
                        recursionDepth: scene.renderSettings.recursionDepth
                    }
                });
            });
        }
        else if (message.command == 'render') {
            rayTracer.scene.renderSettings.camera.pixelWidth = message.data.width;
            rayTracer.scene.renderSettings.camera.pixelHeight = message.data.height;
            rayTracer.scene.renderSettings.subpixelGridSize = message.data.subpixelGridSize;
            rayTracer.scene.renderSettings.recursionDepth = message.data.recursionDepth;
            rayTracer.render(function (rowColors, row) {
                postMessage({
                    command: 'paint',
                    data: {
                        rowColors: rowColors,
                        rowIndex: row
                    }
                });
            });
            postMessage({
                command: 'render complete'
            });
        }
    };
})(RT || (RT = {}));
