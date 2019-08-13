function Drag(texture, x, y, api){
    Base.call(this);
    this.api = api;
    this.texture = (this.api) ? SPRITES[texture] : PIXI.Texture.fromFrame(texture);
    this.drawSprite();
    if(this.api){
        this.sprite.anchor.set(0);
    }
    this.x = x;
    this._ox = x;
    this.y = y;
    this._oy = y;
    this.moving = false;
    this.onEvents();
    this.startDragEvents();
    this.done = false;
}

Drag.prototype = Object.create(Base.prototype);
Drag.prototype.constructor = Drag;


Drag.prototype.startDragEvents = function(){
    var self = this;
    this.on('mousedown', self.dragStart)
        .on('touchstart', self.dragStart)
        .on('mousemove', self.move)
        .on('touchmove', self.move)
        .on('touchend', self.dragEnd)
        .on('touchendoutside', self.dragEnd)
        .on('mouseup', self.dragEnd)
        .on('mouseupoutside', self.dragEnd);
}

Drag.prototype.dragStart = function(e){
    if(this.done) return;
    this.tx = this.x;
    this.ty = this.y;
    this.moving = true;
    this.data = e.data;
}

Drag.prototype.move = function(){
    if(this.moving){
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = (this.api) ? newPosition.x - (this.sprite.width/2) : newPosition.x;
        this.position.y = (this.api) ? newPosition.y - (this.sprite.height/2) : newPosition.y;
    }
}

Drag.prototype.dragEnd = function(){
    this.moving = false;
    this.data = null;
    if(!this.api){
        if(this.x > (this.area.x - (this.area.width/2)) && this.x < (this.area.x + (this.area.width/2)) && this.y > (this.area.y - (this.area.height/2)) && this.y < (this.area.y + (this.area.height/2))){
            TweenMax.to(this, 1, {ease:Elastic.easeOut, x:this.area.x, y:this.area.y});
                this.done = true;
                this.buttonMode = false;
                this.emit('done');
        } else {
            TweenMax.to(this, 1, {ease:Elastic.easeOut, x:this._ox, y:this._oy});
        }
    } else {
        if(this.tx == this.x && this.ty == this.y){
            this.emit('selecionado');
        } else {
            this.emit('moved');
        }
    }
}