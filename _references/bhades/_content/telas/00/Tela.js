// LEMBRE-SE DE TROCAR "tela00" POR "telaNN" (sendo NN o número da tela em questão)
function tela00(){
    Telas.call(this);
    var self = this;
    /* tela simples com jpeg
        coloque abaixo o nome da imagem 
    */
    this.src_img = 'img.jpg';
    /*
        se houver narração, coloque o nome do audio abaixo, se não houver, deixe o valor como false
    */
//    this.audio = false;
    this.audio = 'audio.mp3';
    
    // FIM DA CONFIGURAÇÃO
    
    this.draw();
}
tela00.prototype = Object.create(Telas.prototype);
tela00.prototype.constructor = tela00;

tela00.prototype.init = function(){
    this.init_exec_drags();
}

tela00.prototype.draw = function(){
    this.img = new PIXI.Sprite(PIXI.Texture.fromImage('telas/'+Main.API.menu.bts[currentPage].folder+'/'+this.src_img));
    this.addChild(this.img);
    
    if(this.audio){
        AudioManager.play('telas/'+Main.API.menu.bts[currentPage].folder+'/'+this.audio, function(){
            Main.API.enableNext();
            console.log("LOUCURA")
        });
    } else {
        Main.API.enableNext();
    }
    
}

ObjTeAt = new tela00();