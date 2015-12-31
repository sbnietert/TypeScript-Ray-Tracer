/// <reference path="Vector.ts" />
/// <reference path="Color.ts" />
/// <reference path="Sphere.ts" />
/// <reference path="Plane.ts" />
/// <reference path="Material.ts" />
/// <reference path="SceneObject.ts" />
/// <reference path="Light.ts" />
/// <reference path="Utils.ts" />
/// <reference path="Scene.ts" />

module RT {
    export class RayTracer {
        scene: Scene;

        // determine refracted ray direction given incident, normal, and refractive indices
        // refraction code found online at http://www.flipcode.com/archives/reflection_transmission.pdf
        // (TIR means total internal reflection)
        private static performRefraction(intersection: RayIntersection, n1: number, n2: number): {
            refractedRayDirection: Vector,
            TIR: boolean
        } {
            var n = n1 / n2;
            var c1 = -intersection.incident.dot(intersection.normal);
            var c2 = 1 - n * n * (1 - c1 * c1);

            var refractedRayDirection: Vector;
            var TIR: boolean;
            // total internal reflection occurs
            if (c2 < 0) {
                refractedRayDirection = intersection.incident.getReflection(intersection.normal);
                TIR = true;
            } else {
                refractedRayDirection = intersection.incident.scaledBy(n).plus(intersection.normal.scaledBy(n * c1 - Math.sqrt(c2)));
                TIR = false;
            }

            return {
                refractedRayDirection: refractedRayDirection,
                TIR: TIR
            };
        }

        // search recursively through scene graph, using bounding shapes for optimization
        private static findNearestIntersectionR(ray: Ray, currentInt: RayIntersection, sceneGraph: SceneGraph.Node[]) {
            for (var node of sceneGraph) {
                var tempInt = new RayIntersection();
                if (!node.boundingShape || node.boundingShape.obstructsShadowRay(ray, Infinity)) {
                    switch (node.type) {
                        case SceneGraph.NodeType.Object:
                            var obj = <SceneObject>node.value;
                            if (obj.getGeometry().intersectsRay(ray, tempInt)) {
                                if (currentInt.object == null || tempInt.t < currentInt.t) {
                                    Utils.set(currentInt, tempInt);
                                    currentInt.object = obj;
                                }
                            }
                            break;
                        case SceneGraph.NodeType.Collection:
                            var subGraph = <SceneGraph>node.value;
                            RayTracer.findNearestIntersectionR(ray, currentInt, subGraph);
                            break;
                    }
                }
            }
        }

        private findNearestIntersection(ray: Ray): RayIntersection {
            var nearestIntersection = new RayIntersection();
            RayTracer.findNearestIntersectionR(ray, nearestIntersection, this.scene.sceneGraph);


            if (nearestIntersection.object == null) return null;

            nearestIntersection.point = ray.origin.plus(ray.direction.scaledBy(nearestIntersection.t));
            nearestIntersection.incident = ray.direction;
            nearestIntersection.normal = nearestIntersection.object.getGeometry().findNormal(nearestIntersection);

            return nearestIntersection;
        }

        private traceRay(ray: Ray, insideObject: boolean, depth: number): Color {
            // prevent infinite recursion
            if (depth >= this.scene.renderSettings.recursionDepth) return Color.BLACK;

            // find closest intersection
            var nearestIntersection = this.findNearestIntersection(ray);

            // if there was an intersection, return the color at that point
            if (nearestIntersection != null)
                return this.shadeObject(nearestIntersection, insideObject, depth);

            // otherwise, return the background color
            return this.scene.background.getColor(ray.direction);
        }

        shadeObject(intersection: RayIntersection, insideObject: boolean, depth: number): Color {
            var color = Color.BLACK;

            var lighting = intersection.object.getMaterialLighting(intersection.point);
            var reflection = lighting.reflection;
            var refraction = lighting.refraction;
            var remaining = 1 - reflection - refraction;

            if (remaining > EPSILON) {
                // ambient illumination
                color.add(lighting.color.scaledBy(lighting.ambient));

                // diffuse and specular illuminations 
                // (loop through all lights)
                for (var light of this.scene.lights)
                    color.add(light.illuminate(lighting, intersection, this.scene.sceneGraph));

                color.scale(remaining);
            }
    
            // calculate reflection contribution
            if (reflection != 0) {
                var reflectedRay = new Ray(intersection.point, intersection.incident.getReflection(intersection.normal));
                reflectedRay.inchForward();
                var reflectedColor = this.traceRay(reflectedRay, insideObject, depth + 1);
                color.add(reflectedColor.scaledBy(reflection));
            }

            // calculate refraction contribution
            if (refraction != 0) {
                var n1: number, n2: number;

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
                var refractedRay = new Ray(intersection.point, refractionResults.refractedRayDirection);
                if (!refractionResults.TIR)
                    insideObject = !insideObject;
                refractedRay.inchForward();
                var refractedColor = this.traceRay(refractedRay, insideObject, depth + 1);
                color.add(refractedColor.scaledBy(refraction));
            }

            return color;
        }

        render(paint: (imageData: string[], row: number) => void): void {
            var width = this.scene.renderSettings.camera.pixelWidth;
            var height = this.scene.renderSettings.camera.pixelHeight;

            var subpixelGridSize = this.scene.renderSettings.subpixelGridSize;
            var numSubpixels = subpixelGridSize * subpixelGridSize;
            var camera = this.scene.renderSettings.camera;

            var rowColors = new Array<string>(width);

            var start = Date.now();
            for (var row = 0; row < height; row++) {
                for (var col = 0; col < width; col++) {
                    var pixelColor = Color.BLACK;

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
        }
    }
}