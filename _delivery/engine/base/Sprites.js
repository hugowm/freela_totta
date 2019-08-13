function Sprites(){
    Base.call(this);
}
Sprites.prototype = Object.create(Base.prototype);
Sprites.prototype.constructor = Sprites;

Sprites.prototype.load = function(){
    var self = this;
    PIXI.loader.add('spritesheet', 'assets/assets.json').load(function(a, b){
        self.config(b);
    });
}

Sprites.prototype.config = function(textures){
     for(var el in textures['spritesheet'].data.frames){
         this[el.replace('.png','')] = PIXI.Texture.fromFrame(el);
    }
    this.emit('loadComplete');
}