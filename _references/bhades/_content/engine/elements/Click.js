function Click(texture, x, y, bt){
    Base.call(this);
    this.texture = PIXI.Texture.fromFrame(texture);
    this.drawSprite();
    this.x = x;
    this._ox = x;
    this.y = y;
    this.onEvents();
    
    if(bt){
        this.on('mouseover', function(){
            this.sprite.texture = this.over_texture;
        });
        this.on('mouseout', function(){
            this.sprite.texture = this.texture;
        });
    }
}

Click.prototype = Object.create(Base.prototype);
Click.prototype.constructor = Click;