function Telas(){
    Base.call(this);
    this.makeBack();
    this.camadas = [];
    this.makeCamadas();
    this.clicks = [];
    this.images = [];
    this.drags = [];
    this.areas = [];
    this.opcs = [];
    this.bts = {};
    this.audios = {};
    this.all_els = [];
    this.opened = false;
}
Telas.prototype = Object.create(Base.prototype);
Telas.prototype.constructor = Telas;

Telas.prototype.makeBack = function(){
    this.back = new PIXI.Graphics();
    this.back.beginFill(0xCCCCCC);
    this.back.drawRect(0, 0, CONFIG.screen.width, 678);
    this.back.endFill();
    this.addChild(this.back);
}   

Telas.prototype.makeCamadas = function(){
    for(var i = 0; i <= 5; i++){
        this.camadas.push(new Base());
        this.addChild(this.camadas[i]);
    }
}

Telas.prototype.loadPage = function(){
    Main.loader.on();
    var self = this, nameSprites = 'spriteshet'+min2(currentPage);
    PIXI.loader.add(nameSprites, 'telas/'+Main.API.menu.bts[currentPage].folder+'/assets.json').load(function(a,b){
        for(var el in b[nameSprites].data.frames){
            var sprite = b[nameSprites].data.frames[el];
            var element = el.replace(".png","");
            if(element.indexOf('click') != -1){
                self.clicks.push(new Click(el, sprite.spriteSourceSize.x + (sprite.frame.w/2), (sprite.spriteSourceSize.y + (sprite.frame.h/2)) - Main.API.CTELA.y, false));
            }
            if(element.indexOf('bt') != -1 && element.indexOf('2') == -1){
                self.bts[element] = new Click(el, sprite.spriteSourceSize.x + (sprite.frame.w/2), (sprite.spriteSourceSize.y + (sprite.frame.h/2)) - Main.API.CTELA.y, true);
                self.bts[element].over_texture = PIXI.Texture.fromFrame(element + '2.png');
                self.bts[element].visible = false;
            }
            if(element.indexOf('audio') != -1){
                var a = element.split('_')[1];
                self.audios[a] = new Click(el, sprite.spriteSourceSize.x + (sprite.frame.w/2), (sprite.spriteSourceSize.y + (sprite.frame.h/2)) - Main.API.CTELA.y);
            }
            
            if(element.indexOf('img') != -1){
                self.images.push(new Img(el, sprite.spriteSourceSize.x + (sprite.frame.w/2), (sprite.spriteSourceSize.y + (sprite.frame.h/2)) - Main.API.CTELA.y));
            }
            if(element.indexOf('feed1') != -1){
                self.feed1 = new Popup({x: sprite.spriteSourceSize.x + (sprite.frame.w - 55),y: (sprite.spriteSourceSize.y + 18) - Main.API.CTELA.y});
                var im = new Img(el, sprite.spriteSourceSize.x + (sprite.frame.w/2), (sprite.spriteSourceSize.y + (sprite.frame.h/2)) - Main.API.CTELA.y);
                self.feed1.addChild(im);
            }
            if(element.indexOf('feed2') != -1){
                self.feed2 = new Popup({x: sprite.spriteSourceSize.x + (sprite.frame.w - 55),y: (sprite.spriteSourceSize.y + 18) - Main.API.CTELA.y});
                var im = new Img(el, sprite.spriteSourceSize.x + (sprite.frame.w/2), (sprite.spriteSourceSize.y + (sprite.frame.h/2)) - Main.API.CTELA.y);
                self.feed2.addChild(im);
            }
            if(element.indexOf('area') != -1){
                self.areas.push(new Area(el, sprite.spriteSourceSize.x + (sprite.frame.w/2), (sprite.spriteSourceSize.y + (sprite.frame.h/2)) - Main.API.CTELA.y));
                self.areas[self.areas.length-1].id = element.split("_")[1];
            }
            if(element.indexOf('drag') != -1){
                self.drags.push(new Drag(el, sprite.spriteSourceSize.x + (sprite.frame.w/2), (sprite.spriteSourceSize.y + (sprite.frame.h/2)) - Main.API.CTELA.y, false));
                self.drags[self.drags.length-1].id = element.split("_")[1];
            }
            if(element.indexOf('img') != -1){
                self.images.push(new Img(el, sprite.spriteSourceSize.x + (sprite.frame.w/2), (sprite.spriteSourceSize.y + (sprite.frame.h/2)) - Main.API.CTELA.y));
            }
            if(element.indexOf('opc') != -1){
                self.opcs.push(new Opc(el, sprite.spriteSourceSize.x + (sprite.frame.w/2), (sprite.spriteSourceSize.y + (sprite.frame.h/2)) - Main.API.CTELA.y, (element.indexOf('cr') != -1)));
                self.opcs[self.opcs.length-1].id = self.opcs.length-1;
            }
        }
        if(self.clicks.length > 0){
            for(var i = 0; i < self.clicks.length; i++){
                self.addChild(self.clicks[i]);
                self.clicks[i].alpha = 0;
                self.clicks[i].x -= 100;
                self.clicks[i].ani = {a:'x', v:'+=100'}
                self.all_els.push(self.clicks[i]);
            }
        }
        
        if(self.drags.length > 0){
            for(var i = 0; i < self.drags.length; i++){
                self.camadas[4].addChild(self.drags[i]);
                self.drags[i].area = self.getArea(self.drags[i].id);
                self.drags[i].alpha = 0;
                self.drags[i].y += 100;
                self.drags[i].ani = {a:'y', v:'-=100'}
                self.all_els.push(self.drags[i]);
            }
        }
        
        if(self.areas.length > 0){
            for(var i = 0; i < self.areas.length; i++){
                self.camadas[3].addChild(self.areas[i]);
                self.areas[i].alpha = 0;
                self.areas[i].y -= 100;
                self.areas[i].ani = {a:'y', v:'+=100'}
                self.all_els.push(self.areas[i]);
            }
        }
        
        for(var bt in self.bts){
            self.addChild(self.bts[bt]);
            self.bts[bt].alpha = 0;
            self.bts[bt].y += 100;
            self.bts[bt].ani = {a:'y', v:'-=100'}
            self.all_els.push(self.bts[bt]);
        }
        
        for(var audio in self.audios){
            self.addChild(self.audios[audio]);
            self.audios[audio].alpha = 0;
            self.audios[audio].y += 100;
            self.audios[audio].ani = {a:'y', v:'-=100'}
            self.audios[audio].audio = audio;
            self.audios[audio].on('clicado',function(){
               Main.API.playAudio(this.audio); 
            });
            self.all_els.push(self.audios[audio]);
        }
        
        if(self.images.length > 0){
            for(var i = 0; i < self.images.length; i++){
                self.camadas[0].addChild(self.images[i]);
                self.images[i].alpha = 0;
                self.images[i].y -= 100;
                self.images[i].ani = {a:'y', v:'+=100'}
                self.all_els.push(self.images[i]);
            }
        }
        if(self.opcs.length > 0){
            for(var i = 0; i < self.opcs.length; i++){
                self.addChild(self.opcs[i]);
                self.opcs[i].alpha = 0;
                self.opcs[i].x -= 100;
                self.opcs[i].ani = {a:'x', v:'+=100'}
                self.all_els.push(self.opcs[i]);
            }
        }
        if(self.feed1){
            self.addChild(self.feed1);
        }
        if(self.feed2){
            self.addChild(self.feed2);
        }
        setTimeout(function(){
            Main.loader.off();
            self.emit('loadComplete');
        },150);
    });
}

Telas.prototype.getArea = function(id){
    for(var a in this.areas){
        if(this.areas[a].id == id){
            return this.areas[a];
        }
    }
}

Telas.prototype.open = function(){
        console.log('aaa')
    this.opened = true;
    var i = 0;
    for(var el in this.all_els){
        var e = this.all_els[el];
        var ee = e.ani;
        var dly = (i == 0) ? 0 : .1 * i;
        if(ee.a == 'x'){
            TweenMax.to(e, .5, {alpha:1, x:ee.v, ease:Circ.easeOut, delay:dly});
        }
        if(ee.a == 'y'){
            TweenMax.to(e, .5, {alpha:1, y:ee.v, ease:Circ.easeOut, delay:dly});
        }
        i++;
    }
}

Telas.prototype.init_exec_multipla_escolha = function(){
    var self = this;
    this.respostas = [];
    for(var op in this.opcs){
        var o = this.opcs[op];
        o.off('selected');
        o.on('selected',function(){
            self.checkBts_exec_multipla_escolha(this);
        });
    }
    this.bts.btClear.off('clicado');    
    this.bts.btClear.on('clicado', function(){
        for(var op in self.opcs){
            self.opcs[op].c = false;
            self.opcs[op].checked.visible = false;
            this.visible = false;
            self.bts.btConfirm.visible = false;
        }
    });  
    this.bts.btConfirm.off('clicado');
    this.bts.btConfirm.on('clicado', function(){
        for(var op in self.opcs){
            self.opcs[op].f.visible = true;
            if(self.opcs[op].c != self.opcs[op].crr){
                self.isCorrect = false;
            }
        }
        this.visible = false;
        self.bts.btClear.visible = false;
        self.bts.btRever.visible = true;
        if(self.isCorrect){
            self.feed1.open();
        } else {
            self.feed2.open();
        }
        Main.API.enableNext();
    });
    this.bts.btRever.off('clicado');
    this.bts.btRever.on('clicado', function(){
        if(self.isCorrect){
            self.feed1.open();
        } else {
            self.feed2.open();
        }
    });
    if(!this.opened){
        this.open();
    }
}

Telas.prototype.checkBts_exec_multipla_escolha = function(crt){
    var i = 0;
    for(var op in this.opcs){
        if(1 == 0){
            if(crt.id != this.opcs[op].id){
                this.opcs[op].c = false;
                this.opcs[op].checked.visible = false;
                this.opcs[op].fundo.visible = false;
            }
        }
        if(this.opcs[op].c){
            i++;
        }
    }
    this.bts.btClear.visible = (i >= this.minSel);
    this.bts.btConfirm.visible = (i >= this.minSel);
    
}

Telas.prototype.verifica_totais_drags = function(){
    var chk = 0;
    for(var d in this.drags){
        if(this.drags[d].done){
            chk++;
        }
    }
    if(chk >= this.drags.length){
        Main.API.enableNext();
    }
}

Telas.prototype.init_exec_drags = function(){
    var self = this;
    for(var i = 0; i < this.drags.length; i++){
        var d = this.drags[i];
        d.on('done', function(){
            self.verifica_totais_drags();
        });
    }
    if(!this.opened){
        this.open();
    }
}

Telas.prototype.init_adobe_animate = function(){
    var self = this;
    $.getScript('telas/'+ Main.API.menu.bts[currentPage].folder +'/Tela.js', function(){
        self.emit('animatePronto');
    });
}