function tela07(){
    Telas.call(this);
    var self = this;
    this.img = new PIXI.Sprite(PIXI.Texture.fromImage('telas/'+Main.API.menu.bts[currentPage].folder+'/fundo.jpg'));
    this.camadas[0].addChild(this.img);
    this.loadPage();
    this.on('loadComplete',function(){
        self.init();
    });
}
tela07.prototype = Object.create(Telas.prototype);
tela07.prototype.constructor = tela07;

tela07.prototype.init = function(){
    this.bts.bt_pdf.visible = true;
    this.open();
    setTimeout(()=>{
        Main.API.enableNext();
    },2000);
}

ObjTeAt = new tela07();