function tela00(){
    Telas.call(this);
    var self = this;

    this.loadPage();
    this.on('loadComplete',function(){
        self.init();
    });
}
tela00.prototype = Object.create(Telas.prototype);
tela00.prototype.constructor = tela00;

tela00.prototype.init = function(){
    this.open();
    setTimeout(()=>{
        Main.API.enableNext();
    },2000);
}

ObjTeAt = new tela00();