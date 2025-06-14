var smokemachine = function (context){
    // Brighter white smoke color
    var color = [255, 255, 255];  // pure white for high contrast on black

    var polyfillAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    var lastframe;
    var currentparticles = [];
    var pendingparticles = [];

    var buffer = document.createElement('canvas'),
        bctx = buffer.getContext('2d');

    buffer.width = 20;
    buffer.height = 20;

    var opacities = [ /* same as original for shape */ ];

    // Generate higher opacity (make more visible)
    for (var i = 0; i < 400; i++) {
        opacities[i] = Math.min(255, Math.floor(opacities[i] * 2)); // double opacity but cap at 255
    }

    var data = bctx.createImageData(20,20);
    var d = data.data;

    for(var i=0; i<d.length; i+=4){
        d[i] = color[0];
        d[i+1] = color[1];
        d[i+2] = color[2];
        d[i+3] = opacities[i / 4];
    }

    bctx.putImageData(data, 0, 0);

    var imagewidth = 20 * 5;
    var imageheight = 20 * 5;

    function particle(x,y,l){
        this.x = x;
        this.y = y;
        this.age = 0;
        this.vx = (Math.random()*8-4)/100;
        this.startvy = -(Math.random()*30+10)/100;
        this.vy = this.startvy;
        this.scale = Math.random() * .5;
        this.lifetime = Math.random() * l + l / 2;
        this.finalscale = 5 + this.scale + Math.random();

        this.update = function(deltatime){
            this.x += this.vx * deltatime;
            this.y += this.vy * deltatime;
            var frac = Math.pow((this.age) / this.lifetime, 0.5);
            this.vy = (1 - frac) * this.startvy;
            this.age += deltatime;
            this.scale = frac * this.finalscale;
        };

        this.draw = function(){
            // Increase alpha for thicker appearance
            context.globalAlpha = (1 - Math.abs(1 - 2 * (this.age) / this.lifetime)) / 4;
            var off = this.scale * imagewidth / 2;
            var xmin = this.x - off;
            var xmax = xmin + this.scale * imageheight;
            var ymin = this.y - off;
            var ymax = ymin + this.scale * imageheight;
            context.drawImage(buffer, xmin, ymin, xmax - xmin, ymax - ymin);
        };
    }

    function addparticles(x,y,n,lifetime){
        lifetime = lifetime || 4000;
        n = n || 10;
        if(n < 1) return Math.random() <= n && pendingparticles.push(new particle(x,y,lifetime));
        for (var i = 0; i < n; i++) {
            pendingparticles.push(new particle(x,y,lifetime));
        }
    }

    function updateanddrawparticles(deltatime){
        context.clearRect(0, 0, canvas.width, canvas.height);
        deltatime = deltatime || 16;
        var newparticles = [];
        currentparticles = currentparticles.concat(pendingparticles);
        pendingparticles = [];

        currentparticles.forEach(function(p){
            p.update(deltatime);
            if (p.age < p.lifetime){
                p.draw();
                newparticles.push(p);
            }
        });
        currentparticles = newparticles;
    }

    function frame(time){
        if(running){
            var deltat = time - lastframe;
            lastframe = time;

            updateanddrawparticles(deltat);
            polyfillAnimFrame(frame);
        }
    }

    var running = false;
    function start(){
        running = true;
        polyfillAnimFrame(function(time){
            lastframe = time;
            polyfillAnimFrame(frame);
        });
    }

    function stop(){
        running = false;
    }

    return {
        start: start,
        stop: stop,
        step: updateanddrawparticles,
        addsmoke: addparticles
    }
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

var party = smokemachine(ctx);
party.start();

onmousemove = function (e) {
    var x = e.clientX;
    var y = e.clientY;
    var n = 0.8; // more smoke on mouse
    var t = Math.floor(Math.random() * 200) + 4000;
    party.addsmoke(x, y, 60, t);
};

setInterval(function(){
    const randomX = Math.random() * innerWidth;
    party.addsmoke(randomX, innerHeight, 2); // more smoke from bottom
}, 80);
