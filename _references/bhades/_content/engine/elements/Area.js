function Area(texture, x, y){
    Base.call(this);
    this.texture = PIXI.Texture.fromFrame(texture);
    this.drawSprite();
    this.x = x;
    this._ox = x;
    this.y = y;
}

Area.prototype = Object.create(Base.prototype);
Area.prototype.constructor = Area;