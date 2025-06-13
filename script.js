var smokemachine = function (context) {
  var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  var lastframe, currentparticles = [], pendingparticles = [];

  function createBuffer(color) {
    var buffer = document.createElement('canvas'),
        bctx = buffer.getContext('2d');
    buffer.width = buffer.height = 20;
    var opacities = [/* same opacity array as before */];

    var data = bctx.createImageData(20, 20);
    for (var i = 0; i < data.data.length; i += 4) {
      data.data[i] = color[0];
      data.data[i+1] = color[1];
      data.data[i+2] = color[2];
      data.data[i+3] = opacities[i/4];
    }
    bctx.putImageData(data, 0, 0);
    return buffer;
  }

  var buffers = [
    createBuffer([255, 150, 150]), // light red
    createBuffer([255, 75, 75]),   // medium red
    createBuffer([255, 0, 0]),     // pure red
  ];

  function particle(x, y, l) {
    var buf = buffers[Math.floor(Math.random()*buffers.length)];
    this.buffer = buf;
    this.x = x; this.y = y; this.age = 0;
    this.vx = (Math.random()*8-4)/100;
    this.startvy = -(Math.random()*30+10)/100;
    this.vy = this.startvy;
    this.lifetime = Math.random()*l + l/2;
    this.finalscale = 10 + Math.random()*3;
  }

  particle.prototype.update = function(dt) {
    this.x += this.vx*dt;
    this.y += this.vy*dt;
    var frac = Math.sqrt(this.age/this.lifetime);
    this.vy = this.startvy*(1-frac);
    this.age += dt;
    this.scale = frac*this.finalscale;
  };

  particle.prototype.draw = function() {
    var alpha = (1 - Math.abs(1 - 2*this.age/this.lifetime)) / 8;
    context.globalAlpha = alpha;
    var size = this.scale * 100; // canvas scaling
    context.drawImage(this.buffer, this.x-size/2, this.y-size/2, size, size);
  };

  function addparticles(x, y, n, l) {
    n = n || 10;
    for (var i = 0; i < n; i++) {
      pendingparticles.push(new particle(x, y, l || 4000));
    }
  }

  function update(dt) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    var np = [];
    currentparticles = currentparticles.concat(pendingparticles);
    pendingparticles = [];
    currentparticles.forEach(p => {
      p.update(dt);
      if (p.age < p.lifetime) {
        p.draw();
        np.push(p);
      }
    });
    currentparticles = np;
  }

  function frame(time) {
    if (!lastframe) lastframe = time;
    update(time - lastframe);
    lastframe = time;
    raf(frame);
  }

  return {
    start: () => raf(frame),
    addsmoke: addparticles
  };
};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = innerWidth; canvas.height = innerHeight;

var party = smokemachine(ctx);
party.start();

onmousemove = (e) => party.addsmoke(e.clientX, e.clientY, 5);
setInterval(() => party.addsmoke(canvas.width/2, canvas.height, 7), 100);
