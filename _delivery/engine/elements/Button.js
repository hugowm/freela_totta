function Button(texture, x, y){
    Base.call(this);
    this.textures = [texture];
    this.draw();
    this.x = x;
    this._ox = x;
    this.config();
    this.s = new PIXI.Sprite(SPRITES['seta_next']);
    this.sa = null;
}

Button.prototype = Object.create(Base.prototype);
Button.prototype.constructor = Button;

Button.prototype.draw = function(){
    this.sprite = new PIXI.Sprite(SPRITES[this.textures[0]]);
    this.addChild(this.sprite);
}

Button.prototype.config = function(){
    this.onEvents();
    this.on('mouseover',function(){
        if(this.textures.length > 1 && !this.over){
            this.sprite.texture = SPRITES[this.textures[1]];
            this.over = true;
        }
    });
    this.on('mouseout',function(){
        this.sprite.texture = SPRITES[this.textures[0]];
        this.over = false;
    });
}

Button.prototype.disable = function(){
    this.sprite.texture = SPRITES[this.textures[2]];
    this.offEvents();
    this.stopAnimation();
    this.s.alpha = .5;
    if(this.sa){
        this.sa.kill();
        this.s.x = this.sprite.width - 20;;
    }
}

Button.prototype.enable = function(a){
    this.sprite.texture = SPRITES[this.textures[0]];
    this.onEvents();
    this.s.alpha = 1;
    if(a){
        this.sa = TweenMax.to(this.s, .2, {repeat:-1, yoyo:true, x:"+=5"});
    }
}

Button.prototype.doNext = function(){
    this.s.anchor.set(.5);
    this.s.x = this.sprite.width - 20;
    this.s.y = this.sprite.height/2;
    this.addChild(this.s);
}