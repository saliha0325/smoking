var smokemachine = function (context){
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
            108, 108, 94, 94, 81, 81, 69, 69, 58, 58, 48, 48, 39, 39, 31, 31,
            24, 24, 18, 18, 13, 13, 9, 9, 6, 6, 4, 4, 2, 2, 1, 1, 0, 0
        ];

        var data = bctx.createImageData(20, 20);
        var d = data.data;

        for (var i = 0; i < d.length; i += 4) {
            d[i] = color[0];
            d[i + 1] = color[1];
            d[i + 2] = color[2];
            d[i + 3] = opacities[i / 4];
        }

        bctx.putImageData(data, 0, 0);
        return buffer;
    }

    var redBuffer = createBuffer([255, 0, 0]);
    var whiteBuffer = createBuffer([255, 255, 255]);

    var imagewidth = 20 * 5;
    var imageheight = 20 * 5;

    function particle(x, y, l, colorBuffer) {
        this.x = x;
        this.y = y;
        this.age = 0;
        this.vx = (Math.random() * 8 - 4) / 100;
        this.startvy = -(Math.random() * 30 + 10) / 100;
        this.vy = this.startvy;
        this.scale = Math.random() * 0.5;
        this.lifetime = Math.random() * l + l / 2;
        this.finalscale = 8 + this.scale + Math.random() * 3;
        this.buffer = colorBuffer;

        this.update = function (deltatime) {
            this.x += this.vx * deltatime;
            this.y += this.vy * deltatime;
            var frac = Math.pow((this.age) / this.lifetime, .5);
            this.vy = (1 - frac) * this.startvy;
            this.age += deltatime;
            this.scale = frac * this.finalscale;
        };

        this.draw = function () {
            context.globalAlpha = (1 - Math.abs(1 - 2 * (this.age) / this.lifetime)) / 8;
            var off = this.scale * imagewidth / 2;
            var xmin = this.x - off;
            var ymin = this.y - off;
            context.drawImage(this.buffer, xmin, ymin, this.scale * imagewidth, this.scale * imageheight);
        };
    }

    function addparticles(x, y, n, lifetime) {
        lifetime = lifetime || 4000;
        n = n || 10;
        if (n < 1) {
            if (Math.random() <= n) {
                var buffer = Math.random() < 0.5 ? redBuffer : whiteBuffer;
                pendingparticles.push(new particle(x, y, lifetime, buffer));
            }
        } else {
            for (var i = 0; i < n; i++) {
                var buffer = Math.random() < 0.5 ? redBuffer : whiteBuffer;
                pendingparticles.push(new particle(x, y, lifetime, buffer));
            }
        }
    }

    function updateanddrawparticles(deltatime) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        deltatime = deltatime || 16;
        var newparticles = [];
        currentparticles = currentparticles.concat(pendingparticles);
        pendingparticles = [];

        currentparticles.forEach(function (p) {
            p.update(deltatime);
            if (p.age < p.lifetime) {
                p.draw();
                newparticles.push(p);
            }
        });
        currentparticles = newparticles;
    }

    function frame(time) {
        if (running) {
            var deltat = time - lastframe;
            lastframe = time;

            updateanddrawparticles(deltat);
            polyfillAnimFrame(frame);
        }
    }

    var running = false;

    function start() {
        running = true;
        polyfillAnimFrame(function (time) {
            lastframe = time;
            polyfillAnimFrame(frame);
        });
    }

    function stop() {
        running = false;
    }

    return {
        start: start,
        stop: stop,
        step: updateanddrawparticles,
        addsmoke: addparticles
    }
};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

var party = smokemachine(ctx);
party.start(); // start animating

onmousemove = function (e) {
    var x = e.clientX;
    var y = e.clientY;
    var n = 0.5;
    var t = Math.floor(Math.random() * 200) + 3800;
    party.addsmoke(x, y, n, t);
};

setInterval(function () {
    party.addsmoke(innerWidth / 2, innerHeight, 3);
}, 100);
