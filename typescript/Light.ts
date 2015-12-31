/// <reference path="Vector.ts" />
/// <reference path="Color.ts" />
/// <reference path="Material.ts" />
/// <reference path="GeometricObject.ts" />
/// <reference path="SceneObject.ts" />
/// <reference path="Scene.ts" />

module RT {
    export class Light {
        constructor(
            private position: Vector,
            private color: Color,
            private intensity: number
        ) { }

        private static shadowRayIsObstructed(shadowRay: Ray, distToLight: number, sceneGraph: SceneGraph): boolean {
            for (var node of sceneGraph) {
                if (!node.boundingShape || node.boundingShape.obstructsShadowRay(shadowRay, distToLight)) {
                    switch (node.type) {
                        case SceneGraph.NodeType.Object:
                            var obj = <SceneObject>node.value;
                            if (obj.getGeometry().obstructsShadowRay(shadowRay, distToLight))
                                return true;
                            break;
                        case SceneGraph.NodeType.Collection:
                            var subGraph = <SceneGraph>node.value;
                            if (Light.shadowRayIsObstructed(shadowRay, distToLight, subGraph))
                                return true;
                            break;
                    }
                }
            }
            return false;
        }

        illuminate(lighting: MaterialLighting, intersection: RayIntersection, sceneGraph: SceneGraph): Color {
            var illumination = Color.BLACK;
            // create shadow ray
            var L = this.position.minus(intersection.point);
            var distToLight = L.length();
            L.scale(1 / distToLight);
            var shadowRay = new Ray(intersection.point, L);
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
                        illumination.add(Color.WHITE.times(attenuation).scaledBy(Math.pow(dot, lighting.shininess)));
                }
            }

            return illumination;
        }
    }
}