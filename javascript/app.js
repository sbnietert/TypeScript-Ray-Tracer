window.onload = function () {
    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    new RT.SceneViewer(canvas);
};
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
/// <reference path="Utils.ts" />
var RT;
(function (RT) {
    var SceneData = (function () {
        function SceneData() {
            this.width = 0;
            this.height = 0;
            this.subpixelGridSize = 0;
            this.recursionDepth = 0;
        }
        return SceneData;
    })();
    var SceneViewer = (function () {
        function SceneViewer(canvas) {
            var _this = this;
            this.canvas = canvas;
            this.scene = 'Models';
            this.sceneData = new SceneData();
            this.gui = new dat.GUI({ width: 400 });
            this.rayTracer = new Worker('javascript/worker.js');
            this.ctx = canvas.getContext('2d');
            var sceneFileController = this.gui.add(this, 'scene', Object.keys(RT.SceneViewer.scenes));
            sceneFileController.onChange(function () {
                _this.loadScene();
            });
            sceneFileController.name('Scene');
            this.gui.add(this.sceneData, 'width', 1, window.innerWidth).step(1).name('Image Width');
            this.gui.add(this.sceneData, 'height', 1, window.innerHeight).step(1).name('Image Height');
            this.gui.add(this.sceneData, 'subpixelGridSize', 1, 5).step(1).name('Subpixel Grid Size');
            this.gui.add(this.sceneData, 'recursionDepth', 1, 100).step(1).name('Recursion Depth');
            this.addRenderButton();
            var firstTime = true;
            this.loadScene();
            this.rayTracer.onmessage = function (e) {
                var message = e.data;
                if (message.command == 'paint') {
                    var row = message.data.rowIndex;
                    var rowColors = message.data.rowColors;
                    for (var col = 0; col < rowColors.length; col++) {
                        _this.ctx.fillStyle = rowColors[col];
                        _this.ctx.fillRect(col, row, 1, 1);
                    }
                }
                else if (message.command == 'update scene data') {
                    _this.sceneData.width = message.data.width;
                    _this.sceneData.height = message.data.height;
                    _this.sceneData.subpixelGridSize = message.data.subpixelGridSize;
                    _this.sceneData.recursionDepth = message.data.recursionDepth;
                    for (var i in _this.gui.__controllers) {
                        _this.gui.__controllers[i].updateDisplay();
                    }
                    if (firstTime) {
                        firstTime = false;
                        _this.render();
                    }
                }
                else if (message.command == 'render complete') {
                    _this.addRenderButton();
                }
            };
        }
        SceneViewer.prototype.addRenderButton = function () {
            this.renderButtonController = this.gui.add(this, 'render');
            this.renderButtonController.name('Render!');
        };
        SceneViewer.prototype.loadScene = function () {
            this.rayTracer.postMessage({
                command: 'load scene',
                data: SceneViewer.scenePathPrefix + SceneViewer.scenes[this.scene]
            });
        };
        SceneViewer.prototype.render = function () {
            this.canvas.width = this.sceneData.width;
            this.canvas.height = this.sceneData.height;
            this.gui.remove(this.renderButtonController);
            this.rayTracer.postMessage({
                command: 'render',
                data: this.sceneData
            });
        };
        SceneViewer.scenePathPrefix = '../scenes/';
        SceneViewer.scenes = {
            'Menger Sponge': 'mengerSponge.json',
            'Models': 'models.json',
            'Ripple': 'ripple.json',
            'Sample': 'sample.json'
        };
        return SceneViewer;
    })();
    RT.SceneViewer = SceneViewer;
})(RT || (RT = {}));
