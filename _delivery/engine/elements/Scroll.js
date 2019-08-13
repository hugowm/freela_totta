function Scroll(config){
    Base.call(this);
    this.c = config;
    console.log(config)
    this.draw();
    this.configButtons();
    TOUP.push(this);
}
Scroll.prototype = Object.create(Base.prototype);
Scroll.prototype.constructor = Scroll;

Scroll.prototype.draw = function(){
    this.x = this.c.x;
    this.y = this.c.y;
    this.fundo = new PIXI.Graphics();
    this.fundo.beginFill(0xCECECE);
    this.fundo.drawRect(0, 0, 25, this.c.he);
    this.fundo.endFill();
    this.addChild(this.fundo);
    
    this.btUp = new Button('setaScroll', 0, 0);
    this.addChild(this.btUp);
    
    this.btDown = new Button('setaScroll2', 0, (this.c.he-26));
    this.addChild(this.btDown);
    
    
    var bh = getPercent2(getPercent(this.c.el.height, (this.c.he-(2*26))), (this.c.he-(2*26)));
    this.bar = new PIXI.Graphics();
    this.bar.beginFill(0x00779b);
    this.bar.drawRect(0, 27, 25, bh);
    this.bar.endFill();
    this.bar.interactive = this.bar.buttonMode = true;
    this.coef = [[getPercent2(this.c.he-(26), 2), this.c.he - bh - (27*2)],[getPercent2(this.c.el.height, 2), this.c.he - (this.c.el.height+50)]];
    
    
    this.addChild(this.bar);
    
}

Scroll.prototype.configButtons = function(){
    var self = this;
    this.btDown.on('mousedown', function(){
        self.isDown = true;
    });
    this.btDown.on('touchstart', function(){
        self.isDown = true;
    });
    this.btDown.on('mouseup', function(){
        self.isDown = false;
    });
    this.btDown.on('touchend', function(){
        self.isDown = false;
    });
    this.btDown.on('mouseupoutside', function(){
        self.isDown = false;
    });
    this.btDown.on('touchendoutside', function(){
        self.isDown = false;
    });
    
    this.btUp.on('mousedown', function(){
        self.isUp = true;
    });
    this.btUp.on('mouseup', function(){
        self.isUp = false;
    });
    this.btUp.on('mouseupoutside', function(){
        self.isUp = false;
    });
    
    this.btUp.on('touchstart', function(){
        self.isUp = true;
    });
    this.btUp.on('touchend', function(){
        self.isUp = false;
    });
    this.btUp.on('touchendoutside', function(){
        self.isUp = false;
    });
    
    
    this.bar.on('mousedown',function(e){
        this.d = e.data;
        this.dd = true;
        this.yt = this.d.getLocalPosition(this).y;
    });
    this.bar.on('mouseup',function(){
        this.d = null;
        this.dd = false;
    });
    this.bar.on('mouseupoutside',function(){
        this.d = null;
        this.dd = false;
    });
    this.bar.on('mousemove',function(){
        if(this.dd){
            var ny = this.d.getLocalPosition(this.parent).y - this.yt;
            ny = (ny < 0) ? 0 : ny;
            ny = (ny > self.coef[0][1]) ? self.coef[0][1] : ny;
            self.c.el.y = getPercent2(self.coef[1][1], getPercent(self.coef[0][1], ny));
            this.y = ny;
        }
    });
    
    this.bar.on('touchstart',function(e){
        this.d = e.data;
        this.dd = true;
        this.yt = this.d.getLocalPosition(this).y;
    });
    this.bar.on('touchend',function(){
        this.d = null;
        this.dd = false;
    });
    this.bar.on('touchendoutside',function(){
        this.d = null;
        this.dd = false;
    });
    this.bar.on('touchmove',function(){
        if(this.dd){
            var ny = this.d.getLocalPosition(this.parent).y - this.yt;
            ny = (ny < 0) ? 0 : ny;
            ny = (ny > self.coef[0][1]) ? self.coef[0][1] : ny;
            self.c.el.y = getPercent2(self.coef[1][1], getPercent(self.coef[0][1], ny));
            this.y = ny;
        }
    });
    
}

Scroll.prototype.update = function(){
    if(this.isDown){
        var yb = (this.bar.y >= this.coef[0][1]) ? this.coef[0][1] : this.bar.y + this.coef[0][0];
        var yel = (this.c.el.y <= this.coef[1][1]) ? this.coef[1][1] : this.c.el.y - this.coef[1][0];
        TweenMax.to(this.c.el, .3, {y:yel, ease:Circ.easeOut});
        TweenMax.to(this.bar, .3, {y:yb, ease:Circ.easeOut});
        
    }
    if(this.isUp){
        var yb = (this.bar.y <= 0) ? 0 : this.bar.y - this.coef[0][0];
        var yel = (this.c.el.y >= 0) ? 0 : this.c.el.y + this.coef[1][0];
        TweenMax.to(this.c.el, .3, {y:yel, ease:Circ.easeOut});
        TweenMax.to(this.bar, .3, {y:yb, ease:Circ.easeOut});
    
        
    }
}