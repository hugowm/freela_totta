function Menu(){
    Base.call(this);
    this.opened_x = 0;
    this.display = new Base();
    this.display.x = -494;
    this.y = 60;
    this.draw();
}

Menu.prototype = Object.create(Base.prototype);
Menu.prototype.constructor = Base;

Menu.prototype.draw = function(){
    var self = this;
    
    this.dark = new PIXI.Graphics();
    this.dark.beginFill(0x000000, .9);
    this.dark.drawRect(0, 0, CONFIG.screen.width, CONFIG.screen.height);
    this.dark.endFill();
    this.dark.visible = false;
    this.dark.alpha = 0;
    this.addChild(this.dark);
    
    this.fundo = new PIXI.Graphics();
    this.fundo.beginFill(0xFFFFFF);
    this.fundo.drawRect(0, 0, 494, 455);
    this.fundo.endFill();
    this.display.addChild(this.fundo);
    
    this.maska = new PIXI.Graphics();
    this.maska.beginFill(0xFF0000);
    this.maska.drawRect(0, 0, 494, 395);
    this.maska.y = 60;
    this.maska.endFill();
    this.display.addChild(this.maska);
    
    this.header = new PIXI.Sprite(SPRITES['headerMenu']);
    this.display.addChild(this.header);
    this.closer = new Button('fechaMenu', 445, 15);
    this.closer.on('clicado', function(){
        self.close();
    });
    this.closer.on('mouseover', function(){
        this.sprite.texture = SPRITES['fechaMenu2'];
    });
    this.closer.on('mouseout', function(){
        this.sprite.texture = SPRITES['fechaMenu'];
    });
    this.c = new Base();
    this.c.y = 50;
    this.display.addChild(this.c);
    this.makeList();
    
    this.list.mask = this.maska;
    if(this.list.height > 390){
        this.scroller = new Scroll({he:395, x:469, el:this.list, y:60});
        this.display.addChild(this.scroller);
    }    
    this.display.addChild(this.closer);
    this.addChild(this.display);
}

Menu.prototype.close = function(){
    var self = this;
    TweenMax.to(this.display, .5, {x:-494, ease:Circ.easeOut});
    TweenMax.to(this.dark, .5, {alpha:0, onComplete:function(){
        self.dark.visible = false;
    }});
    if(canvas){
        $(canvas).show();
        TweenMax.to(canvas, .3, {opacity:1});
    }
    Main.API.CTELA.visible = true;
    TweenMax.to(Main.API.CTELA, .3, {alpha:1});
}

Menu.prototype.open = function(){
    if(canvas){
        TweenMax.to(canvas, .3, {opacity:0, onComplete:function(){
            $(canvas).hide();
        }});
    }
    TweenMax.to(Main.API.CTELA, .3, {alpha:0, onComplete:function(){
        Main.API.CTELA.visible = false;
    }});
    TweenMax.to(this.display, .5, {x:this.opened_x, ease:Circ.easeOut});
    this.dark.visible = true;
    TweenMax.to(this.dark, .5, {alpha:1});
}

Menu.prototype.makeList = function(){
    var x = 0, y = 0, self = this;
    this.bts = []; 
    this.list = new Base();
    this.list.x = 30;
    this.c.addChild(this.list);
    for(var i = 0; i < DATA_CURSO.modulos.length; i++){
        var m = DATA_CURSO.modulos[i];
        var t = new PIXI.Text(m[0],{font:'800 20px Calibri', fill:'#00779d'});
        t.x = x;
        y += (i == 0) ? 30 : 20;
        t.y = y;
        this.list.addChild(t);
        for(var l in m[1]){
            var t = new PIXI.Text(l,{font:'20px Calibri', fill:'#00779d'});
            t.x = x;
            y+=25;
            t.y = y;
            y-=3;
            this.list.addChild(t);
            for(var ti = m[1][l][0]; ti < (m[1][l][1] + 1); ti++){
                y+=25;
                var t = new ButtonMenu('- '+DATA_CURSO.telas[ti].nome, -30, y);
                t.folder = DATA_CURSO.telas[ti].pasta;
                t.adobeAnimate = DATA_CURSO.telas[ti].adobeAnimate;
                t.on('clicado',function(){
                    if(this.atv){
                        this.f.alpha = 0;
                        self.close();
                        Main.API.changePage(this.folder);
                    }
                })
                this.bts.push(t);
                this.list.addChild(t);
            }
            y += 10;
        }
        y+=30;
        var l = new PIXI.Sprite(SPRITES['lineMenu']);
        l.y = y;
        l.x = -30;
        this.list.addChild(l);
    }
   // this.open();
}

Menu.prototype.organize = function(current, upper, dbug){
    for(var i = 0; i < this.bts.length; i++){
        var bt = this.bts[i];
        var style = {
            fill : (i == current) ? '#a6ca5c' : '#00779d',
            font : (i == current) ? '700 20px calibri' : null
        }
        if(i > upper && !dbug) {
            bt.alpha = .5; 
            bt.atv = false;
        } else {
            bt.atv = true;
            bt.alpha = 1;
        }
        if(i == current) bt.atv = false;
        bt.changeStyle(style);
    }
}