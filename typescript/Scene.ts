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

module RT {
    export interface RenderSettings {
        camera: Camera;
        subpixelGridSize: number;
        recursionDepth: number;
    }
    export class Scene {
        renderSettings: RenderSettings = <RenderSettings>{};
        background: Background;
        lights: Light[];
        materials: { [name: string]: Material };
        sceneGraph: SceneGraph;

        constructor(data: any) {
            this.renderSettings.camera = Scene.loadCamera(data.renderSettings.camera);
            this.renderSettings.subpixelGridSize = data.renderSettings.subpixelGridSize || 3;
            this.renderSettings.recursionDepth = data.renderSettings.recursionDepth || 10;
            this.background = Scene.loadBackground(data.background);

            this.lights = [];
            if(data.lights)
                for (var lightData of data.lights)
                    this.lights.push(Scene.loadLight(lightData));

            this.materials = <{ [name: string]: Material }>{};
            if(data.materials)
                for (var matName in data.materials)
                    this.materials[<string>matName] = Scene.loadMaterial(data.materials[matName]);
            for (var matName in Material.PRESETS)
                this.materials[matName] = (Material.PRESETS[matName]);

            this.sceneGraph = [];
            for (var nodeData of data.sceneGraph) {
                this.sceneGraph.push(this.loadSceneGraphNode(nodeData));
            }
        }
        
        static loadVector(values: number[]): Vector {
            return new Vector(values[0], values[1], values[2]);
        }

        static loadColor(values: number[]): Color {
            return new Color(values[0], values[1], values[2]);
        }

        private static loadCamera(data: any): Camera {
            var eye = Scene.loadVector(data.eye);
            var direction = Scene.loadVector(data.direction).normalize();
            var pose = new Ray(eye, direction);
            var up = Scene.loadVector(data.up).normalize();
            return new Camera(pose, up, data.focalLength, data.pixelWidth, data.pixelHeight);
        }

        private static loadBackground(data: any): Background {
            switch (data.type) {
                case 'solid-color':
                    var color = Scene.loadColor(data.color);
                    return new SolidColorBackground(color);
                case 'phi-gradient':
                    var color1 = Scene.loadColor(data.color1);
                    var color2 = Scene.loadColor(data.color2);
                    var axis = Scene.loadVector(data.axis);
                    return new PhiGradientBackground(color1, color2, data.n, axis);
            }
        }

        private static loadLight(data: any): Light {
            var position = Scene.loadVector(data.position);
            var color = Scene.loadColor(data.color);
            return new Light(position, color, data.intensity);
        }

        private static materialProps: string[] =
            ['ambient', 'shininess', 'reflection', 'refraction', 'refractiveIndex'];

        private static loadMaterial(data: any): Material {
            var checkered = (data.type.indexOf('checkered') != -1);
            if (data.type == 'simple' || checkered) {
                var lighting = new MaterialLighting();
                if (checkered)
                    lighting.color = Scene.loadColor(data.color1);
                else if (data.color)
                    lighting.color = Scene.loadColor(data.color);

                for (var prop of Scene.materialProps)
                    if (data.hasOwnProperty(prop))
                        (<any>lighting)[prop] = data[prop];

                if (checkered) {
                    var color2 = Scene.loadColor(data.color2);
                    var pattern = (data.type == 'xz-checkered') ? XZCheckeredMaterial : XZDiamondCheckeredMaterial;
                    return new pattern(lighting, color2);
                }
                return new SimpleMaterial(lighting);
            }
        }

        private static loadGeometricObject(data: any): GeometricObject {
            switch (data.type) {
                case 'sphere':
                    var center = Scene.loadVector(data.center);
                    return new Sphere(center, data.radius);
                case 'plane':
                    var normal = Scene.loadVector(data.normal).normalize();
                    return new Plane(normal, data.offset);
                case 'cylinder':
                    var point = Scene.loadVector(data.point);
                    var direction = Scene.loadVector(data.direction).normalize();
                    return new Cylinder(new Ray(point, direction), data.radius);
                case 'triangle':
                    var A = Scene.loadVector(data.A);
                    var B = Scene.loadVector(data.B);
                    var C = Scene.loadVector(data.C);
                    return new Triangle(A, B, C);
                case 'axis-aligned-box':
                    var A = Scene.loadVector(data.A);
                    var B = Scene.loadVector(data.B);
                    return new AxisAlignedBox(A, B);
            }
        }

        private loadSceneObject(data: any): SceneObject {
            var geo = Scene.loadGeometricObject(data.geometry);
            var mat = this.materials[data.material];
            return new SceneObject(geo, mat);
        }

        private static sceneGraphGeneratorMap: Dictionary<Class<SceneGraph.Generator>> = {
            'menger-sponge': MengerSponge,
            'mesh': Mesh,
            'sphere-helix': SphereHelix,
            'rippled-surface': RippledSurface
        };

        private loadSceneGraphNode(data: any): SceneGraph.Node {
            var type: SceneGraph.NodeType;
            var value: SceneObject | SceneGraph;
            switch (data.type) {
                case 'object':
                    type = SceneGraph.NodeType.Object;
                    value = this.loadSceneObject(data.value);
                    break;
                case 'collection':
                    type = SceneGraph.NodeType.Collection;
                    value = [];
                    for (var nodeData of data.value)
                        (<SceneGraph>value).push(this.loadSceneGraphNode(nodeData));
                    break;
                case 'menger-sponge':
                case 'mesh':
                case 'sphere-helix':
                case 'rippled-surface':
                    type = SceneGraph.NodeType.Collection;
                    var sceneGraphGenerator: SceneGraph.Generator = new Scene.sceneGraphGeneratorMap[data.type]();
                    value = sceneGraphGenerator.generateSceneGraphFromData(data.value, this);
                    break;
            }
            return new SceneGraph.Node(type, value);
        }

        static loadFromFile(path: string, callback: (s: Scene) => any): void {
            var request = new XMLHttpRequest();
            request.onload = function () {
                var data = JSON.parse(this.responseText);
                callback(new Scene(data));
            };
            request.open('GET', path, true);
            request.send();
        }
    }
}