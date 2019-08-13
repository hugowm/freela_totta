function Loader(){
    Base.call(this);
    this.fundo = new PIXI.Graphics();
    this.fundo.beginFill(0xFFFFFF);
    this.fundo.drawRect(0, 0, CONFIG.screen.width, CONFIG.screen.height);
    this.fundo.endFill();
    this.fundo.alpha = .7;
    this.addChild(this.fundo);
    
    
    this.fbox = new PIXI.Graphics();
    this.fbox.beginFill(0x333333);
    this.fbox.drawRect(0, 0, 292, 17);
    this.fbox.endFill();
    this.fbox.x = (CONFIG.screen.width/2) - 146;
    this.fbox.y = (CONFIG.screen.height/2) - 8.5;
    this.addChild(this.fbox);
    
    this.box = new PIXI.extras.TilingSprite(PIXI.Texture.fromImage('assets/loader.png'), 290, 15);
    this.box.x = (CONFIG.screen.width/2) - 145;
    this.box.y = (CONFIG.screen.height/2) - 7.5;
    this.addChild(this.box);
    
    TweenMax.to(this.box.tilePosition, 5, {x:'+=300', repeat:-1, yoyo:true});
    
    
}
Loader.prototype = Object.create(Base.prototype);
Loader.prototype.constructor = Loader;

Loader.prototype.on = function(){
    STAGE.removeChild(this);
    STAGE.addChild(this);
}

Loader.prototype.off = function(){
    STAGE.removeChild(this);
}