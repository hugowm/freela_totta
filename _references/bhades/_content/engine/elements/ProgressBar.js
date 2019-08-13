function ProgressBar(debug){
    Base.call(this);
    this.draw(debug);
    this.x = 194;
    this.y = 525;
    this.p = 0;
}
ProgressBar.prototype = Object.create(Base.prototype);
ProgressBar.prototype.constructor = ProgressBar;

ProgressBar.prototype.draw = function(debug){
    var c = CONFIG.progressBar.type;
    if(c <= 4){
        var wb, xb;
        if(c == 4){
            wb = 490;
            xb = 60;             
        }
        if(c == 3){
            wb = 540;
            xb = 0;
        }
        if(c == 2){
            wb = 530;
            xb = 60;            
        }
        if(c == 1){
            wb = 600;
            xb = 0;
        }
        this.shape = new PIXI.Graphics();
        this.shape.beginFill(0x8b8b8b);
        this.shape.drawRect(0, 0, wb, 10);
        this.shape.endFill();
        this.shape.x = xb;
        this.shape.y = 5;

        this.bar = new PIXI.Graphics();
        this.bar.beginFill(0xa6ca5c);
        this.bar.drawRect(0, 0, wb, 10);
        this.bar.endFill();
        this.bar.x = xb;
        this.bar.y = 5;
        this.bar.scale.x = 0;

        this.back = new PIXI.Graphics();
        this.back.beginFill(0xececec);
        this.back.drawRect(0, 0, wb, 9);
        this.back.endFill();
        this.back.x = xb;
        this.back.y = 6;

        this.addChild(this.shape);
        this.addChild(this.back);
        this.addChild(this.bar);
    } else {
        if(c == 5){
            this.mw = 540;
            this.xdi = 35;
            this.xbtn = 590;
            this.xbtp = 0;
        }
        if(c == 6){
            this.mw = 480;
            this.xdi = 95;
            this.xbtn = 590;
            this.xbtp = 65;
        }
        if(c == 7){
            this.mw = 495;
            this.xdi = 25;
            this.xbtn = 525;
            this.xbtp = 0;
        }
        if(c == 8){
            this.mw = 420;
            this.xdi = 90;
            this.xbtn = 525;
            this.xbtp = 65;
        }
        
        this.maska = new PIXI.Graphics();
        this.maska.beginFill(0x8b8b8b);
        this.maska.drawRect(0, 0, this.mw, 20);
        this.maska.x = this.xdi;
        this.maska.endFill();
        
        this.btNext = new Button('next_pb', this.xbtn, 0);
        this.btNext.sprite.tint = '0x00779d';
        
        this.btPrev = new Button('prev_pb', this.xbtp, 0);
        this.btPrev.sprite.tint = '0x9ccbd9';
        
        this.display = new Base();
        this.display.bts = [];
        this.display.x = this.xdi;
        this.pop = new PopPB();
        var x = 10, self = this;
        setTimeout(function(){
            for(var i = 0; i < Main.API.menu.bts.length; i++){
                var b = Main.API.menu.bts[i];
                self.display.bts.push(new Button('ball_pb_atv', x, 10));
                var bb = self.display.bts[self.display.bts.length-1];
                bb.sprite.anchor.set(.5,.5);
                bb.pageName = b.t.replace('• ','');
                bb.folder = b.folder;
                bb.id = i;
                bb.y = 10;
                bb.textures.push('ball_pb_current');
                bb.textures.push('ball_pb_disable');
                var texture = ((i == currentPage) ? 1 : (i > lastPage) ? 2 : 0);
                texture = (debug && i != currentPage) ? 0 : texture;
                bb.sprite.texture = SPRITES[bb.textures[texture]];
                bb.off('mouseover');
                bb.off('mouseout');
                bb.on('mouseout',function(){
                    self.pop.hide();
                });
                bb.on('mouseover',function(){
                    self.pop.show(this);
                });
                bb.on('clicado',function(){
                    if((this.id <= lastPage && this.id != currentPage) || Main.API.dbug){
                        Main.API.changePage(this.id);
                    }
                })
                x+=30;
                self.display.addChild(bb);
            }
            self.organizeBts();
        },150);
        this.addChild(this.maska);
        this.addChild(this.display);
        this.addChild(this.pop);
        this.addChild(this.btNext);
        this.addChild(this.btPrev);
        this.display.mask = this.maska;
        
    }
    
    this.text = new PIXI.Text('0%', {font:'25px calibri', fill:0xa6ca5c});
    this.text.x = 0;
    this.text.y = -3;
    this.text.visible = (c==2 || c==4 || c==6 | c==8);
    
    this.totalPages = new PIXI.Text('/00', {font:'20px calibri', fill:0x00779d});
    this.totalPages.x = 580;
    this.totalPages.y = -3;
    
    this.currentPage = new PIXI.Text('00', {font:'20px calibri', fill:0xa6ca5c});
    this.currentPage.x = 580;
    this.currentPage.y = -3;
    this.currentPage.anchor.set(1,0);
    
    this.currentPage.visible = this.totalPages.visible = (c==3 || c==4 || c==7 || c==8);
    

    this.addChild(this.text);
    this.addChild(this.totalPages);
    this.addChild(this.currentPage);
}

ProgressBar.prototype.organizeBts = function(){
    var self = this;
    if(this.display.width > (this.mw - 30)){
        this.btNext.sprite.tint = '0x00779d';
    } else {
        this.btNext.sprite.tint = '0x9ccbd9';
    }
    
    this.btNext.on('clicado',function(){
        if(self.display.width < (self.mw - 30)) return;
        var x = ((self.display.x - 30) < self.mw-self.display.width+self.xdi-10) ? self.mw-self.display.width+self.xdi-10 : self.display.x - 30;
        TweenMax.to(self.display, .3, {x:x, ease:Circ.easeOut});
        if(x <= self.mw - self.display.width + self.xdi-10){
            this.sprite.tint = '0x9ccbd9';
        }
        if(x < self.xdi){
            self.btPrev.sprite.tint = '0x00779d';
        }
    });
    
    this.btPrev.on('clicado',function(){
        var x = ((self.display.x + 30) > self.xdi) ? self.xdi : self.display.x + 30;
        TweenMax.to(self.display, .3, {x:x, ease:Circ.easeOut});
        if(x >= self.xdi){
            this.sprite.tint = '0x9ccbd9';
        }
        if(x > self.mw - self.display.width){
            self.btNext.sprite.tint = '0x00779d';
        }
    });
    
}

ProgressBar.prototype.update = function(lastPg, totalPg, debug){
    var percent = parseInt((100/(totalPg-1)) * lastPg), self = this;
    if(CONFIG.progressBar.type <= 4){
        TweenMax.to(self.bar.scale, .5, {x:(percent/100), ease:Circ.easeOut});
    }
    if(CONFIG.progressBar.type >= 5){
        for(var i = 0; i < this.display.bts.length; i++){
            var bb = this.display.bts[i];
            var texture = ((i == currentPage) ? 1 : (i > lastPage) ? 2 : 0);
            texture = (debug && i != currentPage) ? 0 : texture;
            bb.sprite.texture = SPRITES[bb.textures[texture]];
        }
    }
    this.p = percent;
    this.text.text = this.p+'%';
    this.currentPage.text = min2(currentPage+1);
    this.totalPages.text = '/'+min2(totalPg);
}

ProgressBar.prototype.liberar = function(){
    if(CONFIG.progressBar.type >= 5){
        for(var i = 0; i < this.display.bts.length; i++){
            var bb = this.display.bts[i];
            bb.sprite.texture = SPRITES[bb.textures[(i == currentPage) ? 1 : 0]];
        }
    }
}