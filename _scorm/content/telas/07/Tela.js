function tela06(){
    Telas.call(this);
    var self = this;
    this.img = new PIXI.Sprite(PIXI.Texture.fromImage('telas/'+Main.API.menu.bts[currentPage].folder+'/fundo.jpg'));
    this.camadas[0].addChild(this.img);
    this.loadPage();
    this.on('loadComplete',function(){
        self.init();
    });
}
tela06.prototype = Object.create(Telas.prototype);
tela06.prototype.constructor = tela06;

tela06.prototype.init = function(){
    this.open();
    setTimeout(()=>{
        Main.API.enableNext();
    },2000);
}

ObjTeAt = new tela06();