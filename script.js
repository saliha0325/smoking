var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

// Changed to slightly darker brown: #b89e65
var party = smokemachine(ctx, [184, 158, 101]); 
party.start(); // start animating

onmousemove = function (e) {
    var x = e.clientX;
    var y = e.clientY;
    var n = .5;
    var t = Math.floor(Math.random() * 200) + 3800;
    party.addsmoke(x, y, n, t);
};

setInterval(function(){
    const randomX = Math.random() * innerWidth;
    party.addsmoke(randomX, innerHeight, 1);
}, 100);
