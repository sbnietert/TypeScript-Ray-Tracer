/// <reference path="SceneGraph.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Material.ts" />
/// <reference path="Mesh.ts" />
/// <reference path="SceneObject.ts" />
/// <reference path="Color.ts" />

module RT {
    export type XZFunction = (x: number, z: number) => number;
    export class XZSurface extends Mesh {
        private fn: XZFunction;
        private xMin: number;
        private xMax: number;
        private zMin: number;
        private zMax: number;
        private gridSize: number;
        private thickness: number;

        private getIndex(i: number, j: number, surface: number): number {
            var verticesPerLayer = (this.gridSize + 1) * (this.gridSize + 1);
            return (i * (this.gridSize + 1)) + j + verticesPerLayer * surface;
        }

        private getVertices(): Vector[] {
            var vertices = new Array<Vector>(2 * (this.gridSize + 1) * (this.gridSize + 1));
            var dx = (this.xMax - this.xMin) / this.gridSize;
            var dz = (this.zMax - this.zMin) / this.gridSize;

            for (var i = 0; i <= this.gridSize; i++) {
                for (var j = 0; j <= this.gridSize; j++) {
                    var currX = this.xMin + i * dx;
                    var currZ = this.zMin + j * dz;
                    // bottom surface vertex
                    vertices[this.getIndex(i, j, 0)] = new Vector(currX, this.fn(currX, currZ), currZ);
                    // top surface vertex
                    vertices[this.getIndex(i, j, 1)] = new Vector(currX, this.fn(currX, currZ) + this.thickness, currZ);
                }
            }
           
            return vertices;
        }

        private getFaceVertexCounts(): number[] {
            var vertexCounts = new Array(2 * this.gridSize * this.gridSize + 4 * this.gridSize);
            for (var i = 0; i < vertexCounts.length; i++)
                vertexCounts[i] = 4;
            return vertexCounts;
        }

        private getFaceVertexIndices(): number[] {
            var faceVertexIndices: number[] = [];
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
        }

        generateSceneGraphFromData(data: any, scene: Scene): SceneGraph {
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

            return super.generateSceneGraph(vertices, faceVertexCounts, faceVertexIndices, false, material);
        }
    }

    export class RippledSurface extends XZSurface {
        generateSceneGraphFromData(data: any, scene: Scene): SceneGraph {
            data.fn = (x: number, z: number) => {
                var r = x * x + z * z;
                return Math.sin(2 * r) / (2 + r);
            };
            return super.generateSceneGraphFromData(data, scene);
        }
    }
}