var smokemachine = function (context) {
    var polyfillAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var lastframe;
    var currentparticles = [];
    var pendingparticles = [];

    function createBuffer(color) {
        var buffer = document.createElement('canvas'),
            bctx = buffer.getContext('2d');

        buffer.width = 20;
        buffer.height = 20;

        var opacities = [
            0, 0, 1, 1, 2, 2, 4, 4, 6, 6, 9, 9, 13, 13, 18, 18, 24, 24, 31, 31,
            39, 39, 48, 48, 58, 58, 69, 69, 81, 81, 94, 94, 108, 108, 123, 123,
            139, 139, 156, 156, 174, 174, 193, 193, 213, 213, 234, 234, 255, 255,
            234, 234, 213, 213, 193, 193, 174, 174, 156, 156, 139, 139, 123, 123,
            108, 108, 94, 94, 81, 81, 69, 69, 58, 58, 48, 48,
