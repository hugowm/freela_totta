// TROCAR A PALAVRA "tela_nn" POR "tela + numero da tela" (ex: tela03);

/*

Elementos obrigatórios esperados:
    Botões:
        botao confirmar: btConfirm.png | btConfirm2.png
        botao limpar: btClear.png | btClear2.png
        botao rever: btRever.png | btRever2.png
    ** a segunda imagem nos botões é o "hovermouse"

    Feeds:
        feed positivo: feed1.png
        feed negativo: feed2.png

    Alternativas:
        alternativa 1: opc1.png
        alternativa 2: opc2.png
        alternativa 3: opc3.png
        ...
        alternativa N: opcN.png
    ** para indicar as respostas corretas, coloque um "_cr" no final do nome do arquivo (ex: opc2_cr.png)
        
Elementos opcionais:
    Imagens:
        imagem 1: img1.png
        imagem 2: img2.png
        imagem 3: img3.png
        ...
        imagem N: imgN.png
        
    Botoes de Audio:
        audio_nomeDoAudio.png (o audio deve estar na mesma pasta da tela)
*/

function tela_nn(){
    Telas.call(this);
    var self = this;
    this.isCorrect = true;
    
    
    // CONFIGURAÇÕES DA TELA
    this.multSel = true; // SELEÇÃO MULTIPLA? SIM: true | NÃO: false 
    this.minSel = 2; // MINIMO PARA APARECER OS BOTOES
    

    this.loadPage();
    this.on('loadComplete',function(){
        self.init();
    });
}
tela_nn.prototype = Object.create(Telas.prototype);
tela_nn.prototype.constructor = tela_nn;

tela_nn.prototype.init = function(){
    this.init_exec_multipla_escolha();
}

ObjTeAt = new tela_nn();