function Base(){
    PIXI.Container.call(this);
    this.configEvents();
    this.interactive = true;
}
Base.prototype = Object.create(PIXI.Container.prototype);
Base.prototype.constructor = Base;

Base.prototype.configEvents = function(){
    this.on('click',function(){
        this.emit('clicado');
    });
    this.on('touchend',function(){
        this.emit('clicado');
    });
    
}

Base.prototype.onEvents = function(){
    this.interactive = true;
    this.buttonMode = true;
}

Base.prototype.offEvents = function(){
    this.interactive = false;
    this.buttonMode = false;
    this.off();
}

Base.prototype.animateX = function(){
    this.a = TweenMax.to(this, .5, {repeat:-1, yoyo:true, x:"-=10"});
}

Base.prototype.animatePulse = function(){
    this.a = TweenMax.to(this.sprite.scale, .5, {repeat:-1, yoyo:true, x:"-=.2", y:'-=.2'});
}

Base.prototype.stopAnimation = function(){
    if(this.a){
        this.a.kill();
        this.x = this._ox;
        this.sprite.scale.x = this.sprite.scale.y = 1;
    }
}
Base.prototype.drawSprite = function(){
    this.sprite = new PIXI.Sprite(this.texture);
    this.sprite.anchor.set(.5);
    this.addChild(this.sprite);
}