var smokemachine = function (context, color){
    color = color || [120, 50, 40]; // Dark brown with a red tint
    var polyfillAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    var lastframe;
    var currentparticles = [];
    var pendingparticles = [];

    var buffer = document.createElement('canvas'),
        bctx = buffer.getContext('2d');

    buffer.width = 20;
    buffer.height = 20;

    var opacities = [...]; // Keep the existing opacity array here (unchanged)

    var data = bctx.createImageData(20,20);
    var d = data.data;

    for(var i=0;i<d.length;i+=4){
        d[i]=color[0];
        d[i+1]=color[1];
        d[i+2]=color[2];
        d[i+3]=opacities[i / 4];
    }

    bctx.putImageData(data,0,0);

    var imagewidth = 20 * 5;
    var imageheight = 20 * 5;

    function particle(x,y,l){
        this.x = x;
        this.y = y;
        this.age = 0;
        this.vx = (Math.random()*8-4)/100;
        this.startvy = -(Math.random()*30+10)/100;
        this.vy = this.startvy;
        this.scale = Math.random()*.5;
        this.lifetime = Math.random()*l+l/2;
        this.finalscale = 8 + this.scale + Math.random() * 3; // Much wider smoke

        this.update = function(deltatime){
            this.x+=this.vx*deltatime;
            this.y+=this.vy*deltatime;
            var frac = Math.pow((this.age)/this.lifetime,.5);
            this.vy = (1-frac)*this.startvy;
            this.age+=deltatime;
            this.scale=frac*this.finalscale;
        };

        this.draw = function(){
            context.globalAlpha = (1-Math.abs(1-2*(this.age)/this.lifetime))/8;
            var off = this.scale*imagewidth/2;
            var xmin = this.x-off;
            var xmax = xmin+this.scale*imageheight;
            var ymin = this.y-off;
            var ymax = ymin+this.scale*imageheight;
            context.drawImage(buffer, xmin, ymin, xmax-xmin, ymax-ymin);
        };
    }

    function addparticles(x,y,n,lifetime){
        lifetime = lifetime || 4000;
        n = n || 10;
        if(n < 1) return Math.random() <= n && pendingparticles.push(new particle(x,y,lifetime));
        for (var i = 0; i < n; i++) {
            pendingparticles.push(new particle(x,y,lifetime));
        };
    }

    function updateanddrawparticles(deltatime){
        context.clearRect(0, 0, canvas.width, canvas.height);   
        deltatime = deltatime || 16;
        var newparticles = [];
        currentparticles = currentparticles.concat(pendingparticles);
        pendingparticles = [];

        currentparticles.forEach(function(p){
            p.update(deltatime);
            if (p.age<p.lifetime){
                p.draw();
                newparticles.push(p);
            }
        });
        currentparticles = newparticles;
    }

    function frame(time){
        if(running){
            var deltat = time-lastframe;
            lastframe = time;
