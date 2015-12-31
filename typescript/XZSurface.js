/// <reference path="SceneGraph.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Material.ts" />
/// <reference path="Mesh.ts" />
/// <reference path="SceneObject.ts" />
/// <reference path="Color.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
