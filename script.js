var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

// Set the smoke color to light brown (#c9b581)
var party = smokemachine(ctx, [201, 181, 129]); 
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
