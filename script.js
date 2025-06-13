var smokemachine = function (context, color){
    color = color || [110, 79, 38]; // Darker brown color
    var polyfillAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    var lastframe;
    var currentparticles = [];
    var pendingparticles = [];

    var buffer = document.createElement('canvas'),
        bctx = buffer.getContext('2d');

    buffer.width = 20;
    buffer.height = 20;

    // Increased opacities (scaled up for better visibility)
    var opacities = [
        // Scaled-up version of the original opacities
        // Many zeros removed for better effect visibility
        ...Array(50).fill(0), ...Array(50).fill(20),
        ...Array(50).fill(50), ...Array(50).fill(80),
        ...Array(50).fill(120), ...Array(50).fill(160),
        ...Array(50).fill(200), ...Array(50).fill(255)
    ];

    var data = bctx.createImageData(20, 20);
    var d = data.data;

    for (var i = 0; i < d.length; i += 4) {
        d[i] = color[0];
        d[i + 1] = color[1];
        d[i + 2] = color[2];
        d[i + 3] = opacities[i / 4] || 0;
    }

    bctx.putImageData(data, 0, 0);

    var imagewidth = 20 * 5;
    var imageheight = 20 * 5;

    function particle(x, y, l) {
        this.x = x;
        this.y = y;
        this.age = 0;
        this.vx = (Math.random() * 8 - 4) / 100;
        this.startvy = -(Math.random() * 30 + 10) / 100;
        this.vy = this.startvy;
        this.scale = Math.random() * .5;
        this.lifetime = Math.random() * l + l / 2;
        this.finalscale = 5 + this.scale + Math.random();

        this.update = function (deltatime) {
            this.x += this.vx * deltatime;
            this.y += this.vy * deltatime;
            var frac = Math.pow((this.age) / this.lifetime, .5);
            this.vy = (1 - frac) * this.startvy;
            this.age += deltatime;
            this.scale = frac * this.finalscale;
        };

        this.draw = function () {
            context.globalAlpha = (1 - Math.abs(1 - 2 * (this.age) / this.lifetime)) / 3;
            var off = this.scale * imagewidth / 2;
            var xmin = this.x - off;
            var xmax = xmin + this.scale * imageheight;
            var ymin = this.y - off;
            var ymax = ymin + this.scale * imageheight;
            context.drawImage(buffer, xmin, ymin, xmax - xmin, ymax - ymin);
        };
    }

    function addparticles(x, y, n, lifetime) {
        lifetime = lifetime || 4000;
        n = n || 10;
        if (n < 1) return Math.random() <= n && pendingparticles.push(new particle(x, y, lifetime));
        for (var i = 0; i < n; i++) {
            pendingparticles.push(new particle(x, y, lifetime));
        };
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
}

// Setup canvas and start smoke
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

// Dark brown color: #6e4f26
var party = smokemachine(ctx, [110, 79, 38]); 
party.start();

// Mouse interaction
onmousemove = function (e) {
    var x = e.clientX;
    var y = e.clientY;
    var n = .5;
    var t = Math.floor(Math.random() * 200) + 3800;
    party.addsmoke(x, y, n, t);
};

// Constant smoke from bottom
setInterval(function () {
    const randomX = Math.random() * innerWidth;
    party.addsmoke(randomX, innerHeight, 1);
}, 100);
