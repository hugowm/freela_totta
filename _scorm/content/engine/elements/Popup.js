function Popup(x){
    Base.call(this);
    this.x = 0;
    this.y = 0;
    var self = this;
    this.fundo = new PIXI.Graphics();
    this.fundo.beginFill(0x000000);
    this.fundo.drawRect(0, 0, CONFIG.screen.width, CONFIG.screen.height - Main.API.CTELA.y - 40);
    this.fundo.endFill();
    this.fundo.alpha = .3;
    this.addChild(this.fundo);
    this.visible = false;
    this.closer = new Button('fechaMenu', x.x, x.y);
    this.closer.on('clicado', function(){
        self.close();
    });
    this.closer.on('mouseover', function(){
        this.sprite.texture = SPRITES['fechaMenu2'];
    });
    this.closer.on('mouseout', function(){
        this.sprite.texture = SPRITES['fechaMenu'];
    });
    this.onEvents();
    this.on('clicado', function(){
        self.close();
    });
}

Popup.prototype = Object.create(Base.prototype);
Popup.prototype.constructor = Popup;

Popup.prototype.open = function(){
    this.visible = true;
    //this.addChild(this.closer);
}

Popup.prototype.close = function(){
    this.visible = false;
   // this.removeChild(this.closer);
}