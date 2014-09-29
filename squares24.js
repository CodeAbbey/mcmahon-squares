function Squares24(opts) {
    this.w = 6;
    this.h = 4;
    this.colors = ['#FF0000', '#E0E000', '#3020FF', '#007000']
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
}

Squares24.prototype.setupGeometry = function(canvas) {
    canvas.width = this.size * this.w;
    canvas.height = this.size * this.h;
}

Squares24.prototype.draw = function() {
    var ctx = this.ctx;
    ctx.fillStyle = this.colors[3];
    ctx.fillRect(0, 0, this.w * this.size, this.h * this.size);
    var hs = Math.floor(this.size * 0.9 / 2);
    for (var y = 0; y < this.h; y++) {
        var cy = y * this.size + Math.floor(this.size / 2);
        for (var x = 0; x < this.w; x++) {
            var cx = x * this.size + Math.floor(this.size / 2);
            ctx.fillStyle = this.colors[Math.floor(Math.random() * 3)];
            ctx.fillRect(cx - hs, cy - hs, hs * 2, hs * 2);
        }
    }
}

Squares24.prototype.click = function(event) {
    if (this.running) {
        return;
    }
    event.preventDefault();
}
