function ButtonMenu(text, x, y){
    Base.call(this);
    this.text = new PIXI.Text(text, {font: '400 20px Calibri', fill:'#00779d'});
    this.text.x = 60;
    this.text.y = 5;
    this.draw();
    this.t = text;
    this.x = x;
    this.y = y;
    this.config();
    this.atv = true;
}

ButtonMenu.prototype = Object.create(Base.prototype);
ButtonMenu.prototype.constructor = ButtonMenu;

ButtonMenu.prototype.draw = function(){
    this.f = new PIXI.Graphics();
    this.f.beginFill(0xa6ca5c);
    this.f.drawRect(0, 0, 494, 30);
    this.f.endFill();
    this.f.alpha = 0;
    this.addChild(this.f);
    this.addChild(this.text);
}

ButtonMenu.prototype.config = function(){
    this.onEvents();
    this.on('mouseover', function(){
        if(this.atv){
            this.f.alpha = 1;
            this.changeStyle({fill:'#FFFFFF'});
        }
    });
    this.on('mouseout', function(){
        if(this.atv){
            this.f.alpha = 0;
            this.changeStyle({fill:'#00779d'});
        }
    });
}

ButtonMenu.prototype.changeStyle = function(s){
    this.removeChild(this.text);
    var t = this.text;
    this.text.destroy();
    s.font = (s.font) ? s.font : '400 20px calibri';
    s.fill = (s.fill) ? s.fill : '#00779d';
    this.text = new PIXI.Text(t.text, s);
    this.text.x = 60;
    this.text.y = 5;
    this.buttonMode = this.atv;
    this.addChild(this.text);
}