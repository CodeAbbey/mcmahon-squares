function Squares24(opts) {
    this.w = 6;
    this.h = 4;
    this.colors = ['#FF0000', '#E0E000', '#3020FF', '#000000'];
    this.size = 80;
    this.moving = null;
    this.rotating = null;
    if (typeof(opts) == 'object') {
        for (var key in opts) {
            this[key] = opts[key];
        }
    }
    this.init();
}

Squares24.prototype.init = function() {
    var canvas = document.getElementById('demo');
    this.setupGeometry(canvas);
    this.ctx = canvas.getContext('2d');
    this.ch = new CanvasHelper(canvas, this.ctx);
    this.initialSetup();
    this.draw();
    var self = this;
    canvas.onmousedown = function(e) {self.mouseDown(e)};
    canvas.onmouseup = function(e) {self.mouseUp(e)};
    canvas.onmousemove = function(e) {self.mouseMove(e)};
    setInterval(function() {self.animator()}, 100);
}

Squares24.prototype.initialSetup = function() {
    this.genSquares();
    this.shuffle();
}

Squares24.prototype.genSquares = function() {
    var res = [];
    for (var i = 0; i < 81; i++) {
        var s = '';
        var p = i;
        for (var j = 0; j < 4; j++) {
            s += p % 3;
            p = Math.floor(p / 3);
        }
        var best = s;
        for (var k = 0; k < 3; k++) {
            s = s.substring(1) + s.charAt(0);
            if (s < best) {
                best = s;
            }
        }
        res[best] = best;
    }
    this.squares = [];
    for (var sq in res) {
        this.squares.push(sq);
    }
}

Squares24.prototype.shuffle = function() {
    for (var i = 0; i < this.squares.length; i++) {
        var j = Math.floor(Math.random() * this.squares.length);
        var r = Math.floor(Math.random() * 4);
        var t = this.squares[i];
        if (r != 0) {
            this.rotate(i);
        }
        this.squares[i] = this.squares[j];
        this.squares[j] = t;
    }
}

Squares24.prototype.shuffleAndDraw = function() {
    this.shuffle();
    this.draw();
}

Squares24.prototype.setupGeometry = function(canvas) {
    canvas.width = this.size * this.w;
    canvas.height = this.size * this.h;
}

Squares24.prototype.draw = function() {
    var ctx = this.ctx;
    ctx.fillStyle = this.colors[3];
    ctx.fillRect(0, 0, this.w * this.size, this.h * this.size);
    var moving = this.moving;
    var rotating = this.rotating;
    var skip = moving !== null ? moving.index : (rotating !== null ? rotating.index : -1);
    for (var i in this.squares) {
        if (i != skip) {
            this.drawSquare(i, 0, 0, 0);
        }
    }
    if (moving !== null) {
        this.drawSquare(moving.index, moving.dx, moving.dy, 0);
    } else if (rotating !== null) {
        this.drawSquare(rotating.index, 0, 0, rotating.angle);
    }
}

Squares24.prototype.drawSquare = function(index, dx, dy, da) {
    var coords = this.coordsByIndex(index);
    var cx = coords[0] + dx;
    var cy = coords[1] + dy;
    var sq = this.squares[index];
    var stricken = (dx != 0 || dy != 0 || da != 0);
    for (var i = 0; i < sq.length; i++) {
        this.drawTriangle(coords[0] + dx, coords[1] + dy, i + da, parseInt(sq.charAt(i)), stricken);
    }
}

Squares24.prototype.drawTriangle = function (cx, cy, a, color, stricken) {
    var hs = Math.floor(this.size * 0.67);
    this.ctx.fillStyle = this.colors[color];
    a /= 2;
    var a1 = Math.PI * (a - 0.25);
    var a2 = Math.PI * (a + 0.25);
    var x1 = cx + hs * Math.cos(a1);
    var y1 = cy + hs * Math.sin(a1);
    var x2 = cx + hs * Math.cos(a2);
    var y2 = cy + hs * Math.sin(a2);
    this.ch.fillPoly([cx, cy], [x1, y1], [x2, y2]); 
    if (stricken) {
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.colors[3];
        this.ch.line(x1, y1, x2, y2);
    }
}

Squares24.prototype.coordsByIndex = function(index) {
    return [Math.floor(index % this.w) * this.size + Math.floor(this.size / 2),
            Math.floor(index / this.w) * this.size + Math.floor(this.size / 2)];
}

Squares24.prototype.rotate = function(index) {
    var s = this.squares[index];
    this.squares[index] = s.substring(1) + s.charAt(0);
}

Squares24.prototype.mouseDown = function(event) {
    if (this.rotating !== null) {
        return;
    }
    event.preventDefault();
    var pos = this.ch.posFromEvent(event);
    pos.ts = new Date().getTime();
    pos.index = this.nearestSquare(pos);
    pos.dx = 0;
    pos.dy = 0;
    this.moving = pos;
}

Squares24.prototype.mouseUp = function(event) {
    event.preventDefault();
    var pos = this.ch.posFromEvent(event);
    var sq = this.nearestSquare(pos);
    var t = new Date().getTime();
    if (sq == this.moving.index) {
        if (t - this.moving.ts < 300) {
            this.rotating = {index: sq, angle: 0};
        }
    } else {
        t = this.squares[sq];
        this.squares[sq] = this.squares[this.moving.index];
        this.squares[this.moving.index] = t;
    }
    this.moving = null;
    this.draw();
}

Squares24.prototype.mouseMove = function(event) {
    if (this.moving === null) {
        return;
    }
    var pos = this.ch.posFromEvent(event);
    var moving = this.moving;
    moving.dx = pos.x - moving.x;
    moving.dy = pos.y - moving.y;
    this.draw();
}

Squares24.prototype.animator = function() {
    if (this.rotating === null) {
        return;
    }
    this.rotating.angle -= 0.2;
    if (this.rotating.angle <= -0.9999) {
        this.rotate(this.rotating.index);
        this.rotating = null;
    }
    this.draw();
}

Squares24.prototype.nearestSquare = function(pos) {
    var best = -1;
    var bestVal = Infinity;
    for (var i in this.squares) {
        var coords = this.coordsByIndex(i);
        var dist = Math.pow(pos.x - coords[0], 2) + Math.pow(pos.y - coords[1], 2);
        if (dist < bestVal) {
            best = i;
            bestVal = dist;
        }
    }
    return best;
}
