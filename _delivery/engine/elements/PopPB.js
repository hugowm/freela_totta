function PopPB(){
    Base.call(this);
    this.x = 50;
    this.y = -40
    this.visible = false;
    this.draw();
}
PopPB.prototype = Object.create(Base.prototype);
PopPB.prototype.constructor = PopPB;

PopPB.prototype.draw = function(){
    this.ponta = new PIXI.Sprite(SPRITES['ponta_balao_pb']);
    this.ponta.y = 40;
    
    this.text = new PIXI.Text('', {font:'15px calibri', fill:'#ffffff'});
    this.text.y = 13;
    this.text.x = 10;
    
    
    this.addChild(this.ponta);
    this.addChild(this.text);
}

PopPB.prototype.show = function(el){
    this.text.text = el.pageName.replace("-","");
    if(this.fundo){
        this.removeChild(this.fundo);
        this.fundo.destroy();
    }
    this.fundo = new PIXI.Graphics();
    this.fundo.beginFill('0xa6ca5c');
    this.fundo.drawRect(0, 0, (this.text.width + 20), 41);
    this.fundo.endFill();
    this.ponta.x = (this.text.width / 2);
    this.removeChild(this.text);
    this.addChild(this.fundo);
    this.addChild(this.text);
    this.x = (el.x + this.parent.display.x) - (this.text.width + 20)/2;
    this.alpha = 0;
    this.visible = true;
    TweenMax.to(this, .5, {alpha:1, y:'-70', ease:Circ.easeOut});
}

PopPB.prototype.hide = function(){
    var self = this;
    TweenMax.to(this, .5, {alpha:0, y:'-40', ease:Circ.easeOut, onComplete:function(){
        self.visible = false;
    }});
}