/// <reference path="Utils.ts" />

module RT {
    class SceneData {
        width = 0;
        height = 0;
        subpixelGridSize = 0;
        recursionDepth = 0;
    }

    export class SceneViewer {
        private static scenePathPrefix = '../scenes/';
        private static scenes: Dictionary<string> = {
            'Menger Sponge': 'mengerSponge.json',
            'Models': 'models.json',
            'Ripple': 'ripple.json',
            'Sample': 'sample.json'
        };

        private ctx: CanvasRenderingContext2D;
        private scene = 'Models';
        private sceneData = new SceneData();
        private gui = new dat.GUI({ width: 400 });
        private rayTracer = new Worker('worker.js');
        private renderButtonController: dat.GUIController;

        constructor(private canvas: HTMLCanvasElement) {
            this.ctx = canvas.getContext('2d');
            var sceneFileController = this.gui.add(this, 'scene', Object.keys(RT.SceneViewer.scenes));
            sceneFileController.onChange(() => {
                this.loadScene();
            });
            sceneFileController.name('Scene');
            this.gui.add(this.sceneData, 'width', 1, window.innerWidth).step(1).name('Image Width');
            this.gui.add(this.sceneData, 'height', 1, window.innerHeight).step(1).name('Image Height');
            this.gui.add(this.sceneData, 'subpixelGridSize', 1, 5).step(1).name('Subpixel Grid Size');
            this.gui.add(this.sceneData, 'recursionDepth', 1, 100).step(1).name('Recursion Depth');
            this.addRenderButton();
            
            var firstTime = true;
            this.loadScene();
            this.rayTracer.onmessage = (e: any) => {
                var message = e.data;
                if (message.command == 'paint') {
                    var row = message.data.rowIndex;
                    var rowColors = message.data.rowColors;
                    for (var col = 0; col < rowColors.length; col++) {
                        this.ctx.fillStyle = rowColors[col];
                        this.ctx.fillRect(col, row, 1, 1);
                    }
                } else if (message.command == 'update scene data') {
                    this.sceneData.width = message.data.width;
                    this.sceneData.height = message.data.height;
                    this.sceneData.subpixelGridSize = message.data.subpixelGridSize;
                    this.sceneData.recursionDepth = message.data.recursionDepth;
                    for (var i in this.gui.__controllers) {
                        this.gui.__controllers[i].updateDisplay();
                    }
                    if (firstTime) {
                        firstTime = false;
                        this.render();
                    }
                } else if (message.command == 'render complete') {
                    this.addRenderButton();
                }
            };
        }

        private addRenderButton(): void {
            this.renderButtonController = this.gui.add(this, 'render');
            this.renderButtonController.name('Render!');
        }

        private loadScene(): void {
            this.rayTracer.postMessage({
                command: 'load scene',
                data: SceneViewer.scenePathPrefix + SceneViewer.scenes[this.scene]
            });
        }

        render(): void {
            this.canvas.width = this.sceneData.width;
            this.canvas.height = this.sceneData.height;
            this.gui.remove(this.renderButtonController);
            this.rayTracer.postMessage({
                command: 'render',
                data: this.sceneData
            });
        }
    }
}