/// <reference path="SceneObject.ts" />
/// <reference path="GeometricObject.ts" />

module RT {
    export module SceneGraph {
        export const enum NodeType { Object, Collection }

        export class Node {
            constructor(
                public type: NodeType,
                public value: SceneObject | SceneGraph,
                public boundingShape: GeometricObject = null
            ) { }
        }

        export interface Generator {
            generateSceneGraphFromData(data: any, scene: Scene): Node[]
        }

        export interface Boundable {
            getAxisAlignedBoundaryPoints(): Vector[],
            getReferencePoint(): Vector
        };

        type BoundableShape = (GeometricObject & Boundable);

        export class BoundableSceneObject extends GenericSceneObject<BoundableShape> { }

        export function getAxisAlignedBoundingBox(objects: BoundableSceneObject[]): AxisAlignedBox {
            var min = new Vector(Infinity, Infinity, Infinity);
            var max = new Vector(-Infinity, -Infinity, -Infinity);
            for (var obj of objects) {
                for (var point of obj.getGeometry().getAxisAlignedBoundaryPoints()) {
                    if (point.x < min.x) min.x = point.x;
                    if (point.x > max.x) max.x = point.x;

                    if (point.y < min.y) min.y = point.y;
                    if (point.y > max.y) max.y = point.y;

                    if (point.z < min.z) min.z = point.z;
                    if (point.z > max.z) max.z = point.z;
                }
            }
            return new AxisAlignedBox(min, max);
        }

        function groupObjects(objects: BoundableSceneObject[], maxGroupSize: number, parent: Node) {
            if (objects.length <= maxGroupSize) {
                for (var obj of objects) {
                    var node = new SceneGraph.Node(SceneGraph.NodeType.Object, obj);
                    (<SceneGraph>parent.value).push(node);
                }
            }
            else {
                var ref = objects[0].getGeometry().getReferencePoint();
                objects.sort((a: BoundableSceneObject, b: BoundableSceneObject) => {
                    var refA = a.getGeometry().getReferencePoint();
                    var refB = b.getGeometry().getReferencePoint();
                    return refA.minus(ref).length() - refB.minus(ref).length();
                });

                var closest = objects.splice(0, Math.floor(objects.length / 2));
                var closestNode = new SceneGraph.Node(SceneGraph.NodeType.Collection, [], SceneGraph.getAxisAlignedBoundingBox(closest));
                (<SceneGraph>parent.value).push(closestNode);
                groupObjects(closest, maxGroupSize, closestNode);

                var furthest = objects; // those that remain after the splice
                var furthestNode = new SceneGraph.Node(SceneGraph.NodeType.Collection, [], SceneGraph.getAxisAlignedBoundingBox(furthest));
                (<SceneGraph>parent.value).push(furthestNode);
                groupObjects(furthest, maxGroupSize, furthestNode);
            }
        }

        export function generateFromSceneObjects(objects: BoundableSceneObject[], maxSubgraphSize = 2): SceneGraph {
            var parentNode = new SceneGraph.Node(SceneGraph.NodeType.Collection, [], SceneGraph.getAxisAlignedBoundingBox(objects));
            groupObjects(objects, maxSubgraphSize, parentNode);
            return [parentNode];
        }

        export function generateFromShapes(shapes: BoundableShape[], material: Material): SceneGraph {
            var objects = new Array<BoundableSceneObject>(shapes.length);
            for (var i = 0; i < shapes.length; i++)
                objects[i] = new BoundableSceneObject(shapes[i], material);
            return generateFromSceneObjects(objects, 2);
        }
    }

    export type SceneGraph = SceneGraph.Node[];
}