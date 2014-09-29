function Squares24(opts) {
    this.w = 6;
    this.h = 4;
    this.colors = ['#FF0000', '#E0E000', '#3020FF', '#000000']
    this.size = 80;
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
    canvas.onmousedown = function(e) {self.click(e)};
}

Squares24.prototype.initialSetup = function() {
    this.genSquares();
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

Squares24.prototype.setupGeometry = function(canvas) {
    canvas.width = this.size * this.w;
    canvas.height = this.size * this.h;
}

Squares24.prototype.draw = function() {
    var ctx = this.ctx;
    ctx.fillStyle = this.colors[3];
    ctx.fillRect(0, 0, this.w * this.size, this.h * this.size);
    for (var i in this.squares) {
        this.drawSquare(i);
    }
}

Squares24.prototype.drawSquare = function(index) {
    var coords = this.coordsByIndex(index);
    var cx = coords[0];
    var cy = coords[1];
    var hs = Math.floor(this.size * 0.9 / 2);
    var sq = this.squares[index];
    this.ctx.fillStyle = this.colors[parseInt(sq.charAt(0))];
    this.ch.fillPoly([cx, cy], [cx + hs, cy - hs], [cx + hs, cy + hs]);
    this.ctx.fillStyle = this.colors[parseInt(sq.charAt(1))];
    this.ch.fillPoly([cx, cy], [cx + hs, cy + hs], [cx - hs, cy + hs]);
    this.ctx.fillStyle = this.colors[parseInt(sq.charAt(2))];
    this.ch.fillPoly([cx, cy], [cx - hs, cy + hs], [cx - hs, cy - hs]);
    this.ctx.fillStyle = this.colors[parseInt(sq.charAt(3))];
    this.ch.fillPoly([cx, cy], [cx - hs, cy - hs], [cx + hs, cy - hs]);
}

Squares24.prototype.coordsByIndex = function(index) {
    return [Math.floor(index % this.w) * this.size + Math.floor(this.size / 2),
            Math.floor(index / this.w) * this.size + Math.floor(this.size / 2)];
}

Squares24.prototype.rotate = function(index) {
    var s = this.squares[index];
    this.squares[index] = s.substring(1) + s.charAt(0);
}

Squares24.prototype.click = function(event) {
    if (this.running) {
        return;
    }
    event.preventDefault();
    var pos = this.ch.posFromEvent(event);
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
    this.rotate(best);
    this.draw();
}
