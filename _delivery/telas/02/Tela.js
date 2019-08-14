function tela01(){
    Telas.call(this);
    var self = this;
    this.img = new PIXI.Sprite(PIXI.Texture.fromImage('telas/'+Main.API.menu.bts[currentPage].folder+'/fundo.jpg'));
    this.camadas[0].addChild(this.img);
    this.loadPage();
    this.on('loadComplete',function(){
        self.init();
    });
}
tela01.prototype = Object.create(Telas.prototype);
tela01.prototype.constructor = tela01;

tela01.prototype.init = function(){
    
    var texture = PIXI.Texture.fromVideo('telas/'+Main.API.menu.bts[currentPage].folder+'/video1.mp4');

    // create a new Sprite using the video texture (yes it's that easy)
    var videoSprite = new PIXI.Sprite(texture);

    videoSprite.width = 200;
    videoSprite.height = 200;

    this.camadas[1].addChild(videoSprite);
    


    this.open();
    setTimeout(()=>{
        Main.API.enableNext();
    },2000);
}

ObjTeAt = new tela01();