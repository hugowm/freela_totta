function Confirm(text){
    Base.call(this);
    this.text = text;
    this.draw();
}

Confirm.prototype = Object.create(Base.prototype);
Confirm.prototype.constructor = Confirm;

Confirm.prototype.draw = function(){
    var self = this;
    this.fundo = new PIXI.Graphics();
    this.fundo.beginFill(0x000000);
    this.fundo.drawRect(0, 0, CONFIG.screen.width, CONFIG.screen.height);
    this.fundo.endFill();
    this.fundo.alpha = 0;
    this.addChild(this.fundo);
    
    this.box = new PIXI.Graphics();
    this.box.beginFill(0xFFFFFF);
    this.box.drawRect(0, 0, 400, 180);
    this.box.endFill();
    this.box.x = CONFIG.screen.width / 2 - (200);
    this.box.y = CONFIG.screen.height / 2 - (125);
    this.box.y -= 450;
    this.addChild(this.box);
    
    this.question = new PIXI.Text(this.text, {wordWrap : true, wordWrapWidth : 360, font:'800 30px Calibri', fill:'#404040'});
    this.question.x = this.box.x + 20;
    this.question.y = this.box.y + 20;
    this.addChild(this.question);
    
    this.btSim = new PIXI.Text('SIM', {font:'800 50px Calibri', fill:'#00BA00'});
    this.btSim.x = this.box.x + 50;
    this.btSim.y = this.box.y + this.box.height - 60;;
    this.addChild(this.btSim);
    
    
    this.btNao = new PIXI.Text('NÃO', {font:'800 50px Calibri', fill:'#dc0000'});
    this.btNao.x = this.box.x + 250;
    this.btNao.y = this.box.y + this.box.height - 60;;
    this.addChild(this.btNao);
    
    this.btNao.interactive = this.btNao.buttonMode = this.btSim.interactive = this.btSim.buttonMode = true;
    
    this.btSim.on('click', function(){
        self.close();
        self.emit('closed', true);
    });
    this.btSim.on('touchend', function(){
        self.close();
        self.emit('closed', true);
    });
    this.btNao.on('click', function(){
        self.close();
        self.emit('closed', false);
    });
    this.btNao.on('touchend', function(){
        self.close();
        self.emit('closed', false);
    });
    
    this.open();
    
}

Confirm.prototype.open = function(){
    var self = this;
    TweenMax.to(this.fundo, .5, {alpha:.7, ease:Circ.easeOut, onComplete:function(){
        TweenMax.to(self.box, .5, {y:'+=450', ease:Circ.easeOut});
        TweenMax.to(self.question, .5, {y:'+=450', ease:Circ.easeOut});
        TweenMax.to(self.btNao, .5, {y:'+=450', ease:Circ.easeOut});
        TweenMax.to(self.btSim, .5, {y:'+=450', ease:Circ.easeOut});
    }});
}

Confirm.prototype.close = function(){
    var self = this;
    TweenMax.to(this, .5, {alpha:0, ease:Circ.easeOut, onComplete:function(){
        self.visible = false;
    }});
}