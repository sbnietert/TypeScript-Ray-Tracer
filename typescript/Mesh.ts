/// <reference path="SceneGraph.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Material.ts" />
/// <reference path="Triangle.ts" />
/// <reference path="AxisAlignedBox.ts" />
/// <reference path="SceneObject.ts" />
/// <reference path="Color.ts" />

module RT {
    // produces a binary-ish tree of triangle nodes to form a mesh
    export class Mesh implements SceneGraph.Generator {
        private material: Material;

        private loadTriangles(vertices: Vector[], faceVertexCounts: number[], faceVertexIndices: number[], normalInterpolation: boolean) {
            var triangles: Triangle[] = [];

            if (normalInterpolation) {
                var vertexNormalLists = new Array<Vector[]>(vertices.length);
                for (var i = 0; i < vertices.length; i++)
                    vertexNormalLists[i] = [];
                var triangleVertexIndices: number[] = [];

                var v = 0;
                for (var f = 0; f < faceVertexCounts.length; f++) {
                    for (var o = 1; o < faceVertexCounts[f] - 1; o++) {
                        var v1Index = faceVertexIndices[v];
                        var v2Index = faceVertexIndices[v + o];
                        var v3Index = faceVertexIndices[v + o + 1];
                        Array.prototype.push.apply(triangleVertexIndices, [v1Index, v2Index, v3Index]);

                        var triangle = new Triangle(
                            vertices[v1Index],
                            vertices[v2Index],
                            vertices[v3Index]
                        );
                        triangles.push(triangle);

                        vertexNormalLists[v1Index].push(triangle.normal);
                        vertexNormalLists[v2Index].push(triangle.normal);
                        vertexNormalLists[v3Index].push(triangle.normal);
                    }
                    v += faceVertexCounts[f];
                }

                var vertexNormals = new Array<Vector>(vertices.length);
                for (var i = 0; i < vertices.length; i++) {
                    var avgNormal = new Vector(0, 0, 0);
                    for (var normal of vertexNormalLists[i])
                        avgNormal.add(normal);
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
                        triangles.push(new Triangle(
                            vertices[faceVertexIndices[v]],
                            vertices[faceVertexIndices[v + o]],
                            vertices[faceVertexIndices[v + o + 1]]
                        ));
                    }
                    v += faceVertexCounts[f];
                }
            }

            return triangles;
        }

        private loadTrianglesFromFile(path: string, normalInterpolation: boolean): Triangle[] {
            var request = new XMLHttpRequest();
            request.open('GET', path, false); // bad form, but the program can't do anything until this loads
            request.send();
            var lines = request.responseText.split('\n');
            var counts = lines[1].split(' ');

            var numVertices = parseInt(counts[0], 10);
            var numFaces = parseInt(counts[1], 10);

            var vertices = new Array<Vector>(numVertices);
            var faceVertexCounts = new Array<number>(numFaces);
            var faceVertexIndices: number[] = [];

            for (var l = 2; l < 2 + numVertices; l++) {
                var components = lines[l].split(' ').map(Number);
                vertices[l - 2] = Scene.loadVector(components);
            }
            
            for (var l = 2 + numVertices; l < 2 + numVertices + numFaces; l++) {
                var nums = lines[l].split(' ').map(Number);
                // first number is vertex count
                faceVertexCounts[l - (2 + numVertices)] = nums.splice(0, 1)[0];
                // remaining numbers are vertex indices
                Array.prototype.push.apply(faceVertexIndices, nums);
            }

            return this.loadTriangles(vertices, faceVertexCounts, faceVertexIndices, normalInterpolation);
        }

        generateSceneGraph(vertices: Vector[], faceVertexCounts: number[], faceVertexIndices: number[], normalInterpolation: boolean, material: Material) {
            var triangles = this.loadTriangles(vertices, faceVertexCounts, faceVertexIndices, normalInterpolation);
            return SceneGraph.generateFromShapes(triangles, material);
        }

        generateSceneGraphFromData(data: any, scene: Scene): SceneGraph {
            var triangles = this.loadTrianglesFromFile(data.filePath, data.normalInterpolation);
            return SceneGraph.generateFromShapes(triangles, scene.materials[data.material]);
        }
    }
}