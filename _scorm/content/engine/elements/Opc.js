function Opc(texture, x, y, crr){
    Base.call(this);
    this.texture = PIXI.Texture.fromFrame(texture);
    this.fundo = new PIXI.Graphics();
    this.addChild(this.fundo);
    this.drawSprite();
    this.x = x;
    this._ox = x;
    this.y = y;
    this.c = false;
    this.crr = crr;
    
    this.makeOption();
}

Opc.prototype = Object.create(Base.prototype);
Opc.prototype.constructor = Opc;

Opc.prototype.makeOption = function(){
    this.check = new PIXI.Sprite(SPRITES['chk']);
    this.checked = new PIXI.Sprite(SPRITES['chked']);
    this.f = new PIXI.Sprite(SPRITES[((this.crr) ? 'crr' : 'err')]);
    this.addChild(this.f);
    
    this.check.x = -((this.width/2) + 40);
    this.check.y = -((this.height/2) - 13);
    this.checked.x = -((this.width/2) + 33);
    this.checked.y = -((this.height/2) - 19);
    
    this.f.x = -((this.width/2) + 70);
    this.f.y = -((this.height/2) - 20);
    this.f.visible = false;
    

    this.fundo.beginFill(0xdcdcdc);
    this.fundo.drawRect(0, 0, this.width + 70, this.height + 20);
    this.fundo.endFill();
    this.fundo.visible = false;
    
    this.fundo.x = -((this.sprite.width/2) + 50);
    this.fundo.y = -((this.sprite.height/2) + 10);

    
    this.checked.visible = false;
    
    this.addChild(this.check);
    this.addChild(this.checked);
    
    
    this.onEvents();
    this.on('mouseover',function(){
        if(!this.f.visible){
            this.checked.visible = true;
            this.fundo.visible = true;            
        }
    });
    
    this.on('mouseout',function(){
        if(!this.c){
            this.checked.visible = false;
        }
        this.fundo.visible = false;
    });
    
    this.on('clicado',function(){
        if(!this.f.visible){
            this.checked.visible = true;
            this.c = !this.c;
            this.emit('selected');
        }
    });   
}