function tela02(){
    Telas.call(this);
    var self = this;
    this.img = new PIXI.Sprite(PIXI.Texture.fromImage('telas/'+Main.API.menu.bts[currentPage].folder+'/fundo.jpg'));
    this.camadas[0].addChild(this.img);
    this.loadPage();
    this.on('loadComplete',function(){
        self.init();
    });
}
tela02.prototype = Object.create(Telas.prototype);
tela02.prototype.constructor = tela02;

tela02.prototype.init = function(){
    this.open();
    setTimeout(()=>{
        Main.API.enableNext();
    },2000);
}

ObjTeAt = new tela02();