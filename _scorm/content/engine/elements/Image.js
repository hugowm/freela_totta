function Img(texture, x, y){
    Base.call(this);
    this.texture = PIXI.Texture.fromFrame(texture);
    this.drawSprite();
    this.x = x;
    this._ox = x;
    this.y = y;
}

Img.prototype = Object.create(Base.prototype);
Img.prototype.constructor = Img;