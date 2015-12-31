/// <reference path="SceneGraph.ts" />
/// <reference path="Vector.ts" />
/// <reference path="Material.ts" />
/// <reference path="AxisAlignedBox.ts" />
/// <reference path="SceneObject.ts" />
/// <reference path="Color.ts" />

module RT {
    export class SphereHelix implements SceneGraph.Generator {
        generateSceneGraphFromData(data: any, scene: Scene): SceneGraph {
            var lighting = new MaterialLighting();

            var point = Scene.loadVector(data.point);
            var direction = Scene.loadVector(data.direction).normalize();
            if (direction.z != 0)
                var up = new Vector(1, 1, -(direction.x + direction.y) / direction.z);
            else if (direction.y != 0)
                var up = new Vector(1, 1, -(direction.x + direction.z) / direction.y);
            else
                var up = new Vector(1, 1, -(direction.z + direction.y) / direction.x);
            up.normalize();
            var right = up.cross(direction).normalize();

            var start: number = data.start;
            var stop: number = data.stop;
            var step: number = data.step;

            var sphereR: number = data.sphereRadius;
            var helixR: number = data.helixRadius;

            var spheres: SceneGraph.BoundableSceneObject[] = [];

            for (var t = start; t < stop; t += step) {
                var axisPos = point.plus(direction.scaledBy(t));
                var rightC = helixR * Math.cos(2 * Math.PI * t);
                var upC = helixR * Math.sin(2 * Math.PI * t);
                var offset = right.scaledBy(rightC).plus(up.scaledBy(upC));

                var sphereCtr = axisPos.plus(offset);
                var sphereGeo = new Sphere(sphereCtr, sphereR);
                var lighting = new MaterialLighting();
                lighting.color = Color.fromHSL((0.75 + t * 0.8) % 1, 0.8, 0.5);
                var sphereMat = new SimpleMaterial(lighting);
                var sphere = new GenericSceneObject<Sphere>(sphereGeo, sphereMat);
                spheres.push(sphere);
            }

            return SceneGraph.generateFromSceneObjects(spheres);
        }
    }
}