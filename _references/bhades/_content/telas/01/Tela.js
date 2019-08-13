function tela01(){
    Telas.call(this);
    var self = this;

    this.loadPage();
    this.on('loadComplete',function(){
        self.init();
    });
}
tela01.prototype = Object.create(Telas.prototype);
tela01.prototype.constructor = tela01;

tela01.prototype.init = function(){
    this.init_exec_drags();
}

ObjTeAt = new tela01();