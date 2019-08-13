function tela05(){
    Telas.call(this);
    var self = this;
    this.isCorrect = true;
    this.img = new PIXI.Sprite(PIXI.Texture.fromImage('telas/'+Main.API.menu.bts[currentPage].folder+'/fundo.jpg'));
    this.camadas[0].addChild(this.img);
    
    // CONFIGURAÇÕES DA TELA
    this.multSel = false; // SELEÇÃO MULTIPLA? SIM: true | NÃO: false 
    this.minSel = 1; // MINIMO PARA APARECER OS BOTOES
    

    this.loadPage();
    this.on('loadComplete',function(){
        self.init();
    });
}
tela05.prototype = Object.create(Telas.prototype);
tela05.prototype.constructor = tela05;

tela05.prototype.init = function(){
    this.init_exec_multipla_escolha();
}

ObjTeAt = new tela05();