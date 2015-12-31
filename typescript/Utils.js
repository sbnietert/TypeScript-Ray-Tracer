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
