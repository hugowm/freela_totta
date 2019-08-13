function ConfigScreen(){
    Base.call(this);

    var self = this;
    
    this.visible = false;
    this.fundo = new PIXI.Graphics();
    this.fundo.beginFill(0xa6ca5c);
    this.fundo.drawRect(0, 0, CONFIG.screen.width, CONFIG.screen.height);
    this.fundo.endFill();
    this.fundo.alpha = .7;
    this.addChild(this.fundo);
    this.bts = {buttonsApi:{},buttonsNav:{}};
    this.progressBar = {sel:CONFIG.progressBar.type};
    
    
    this.btAlign = new PIXI.Text('autoalign', {font:'800 30px Calibri', fill:'#FFFFFF'});
    this.btAlign.x = 570;
    this.btAlign.y = 12;

    this.btAlign.alpha = (CONFIG.buttonsAutoAlign) ? 1 : .5;
    this.btAlign.text = (CONFIG.buttonsAutoAlign) ? 'autoalignON' : 'autoalignOFF';
    this.btAlign.interactive = this.btAlign.buttonMode = true;
    this.btAlign.on('click', function(){
        CONFIG.buttonsAutoAlign = !CONFIG.buttonsAutoAlign;
        this.text = (CONFIG.buttonsAutoAlign) ? 'autoalignON' : 'autoalignOFF';
        this.alpha = (CONFIG.buttonsAutoAlign) ? 1 : .5;
        self.realign();
    });
    
    
    this.addChild(this.btAlign);
    
    
    
    this.configElements();
    
    this.btExibe = new Button('btCloseConfig', 50, 200);
    this.btExibe.sprite.anchor.set(.5);
    this.btExibe.animatePulse();
    this.btExibe.on('clicado', function(){
       self.showConfig(); 
        this.stopAnimation();
    });
    this.addChild(this.btExibe);
    
}
ConfigScreen.prototype = Object.create(Base.prototype);
ConfigScreen.prototype.constructor = ConfigScreen;

ConfigScreen.prototype.open = function(){
    CNFG.io = true;
    this.visible = true;
    $('#adobeAnimate').hide();
}

ConfigScreen.prototype.close = function(){
    CNFG.io = false;
    this.visible = false;
    
}

ConfigScreen.prototype.showConfig = function(){
    var blob = new Blob(['var CONFIG = '+JSON.stringify(CONFIG, null, '\t')], {type: "text/plain;charset=utf-8"});
    saveAs(blob, 'config.js');
}

ConfigScreen.prototype.realign = function(){
    var x = 1;
    this.btAlign.alpha = (CONFIG.buttonsAutoAlign) ? 1 : .5;
    this.btAlign.text = (CONFIG.buttonsAutoAlign) ? 'autoalignON' : 'autoalignOFF';
     for(var bt in CONFIG.buttonsApi){
         if(CONFIG.buttonsAutoAlign){
            if(CONFIG.buttonsApi[bt]){
                this.bts.buttonsApi[bt].x = CONFIG.screen.width - (60 * x);
                this.bts.buttonsApi[bt].y = 0;
                CONFIG.buttonsApi[bt].position.x = this.bts.buttonsApi[bt].x;
                CONFIG.buttonsApi[bt].position.y = this.bts.buttonsApi[bt].y;
               x++; 
            }    
         } else {
            this.bts.buttonsApi[bt].x = CONFIG.buttonsApi[bt].position.x;
            this.bts.buttonsApi[bt].y = CONFIG.buttonsApi[bt].position.y;
         } 
    }
}

ConfigScreen.prototype.configElements = function(){
    var self = this;
    this.bts.buttonsApi.btnFechar = new Drag('bt_fechar_1', CONFIG.buttonsApi.btnFechar.position.x , CONFIG.buttonsApi.btnFechar.position.y, true);
    this.bts.buttonsApi.btnAudio = new Drag('bt_audio_1', CONFIG.buttonsApi.btnAudio.position.x , CONFIG.buttonsApi.btnAudio.position.y, true);
    this.bts.buttonsApi.btnHelp = new Drag('bt_ajuda_1', CONFIG.buttonsApi.btnHelp.position.x , CONFIG.buttonsApi.btnHelp.position.y, true);
    this.bts.buttonsApi.btnMenu = new Drag('bt_menu_1', CONFIG.buttonsApi.btnMenu.position.x , CONFIG.buttonsApi.btnMenu.position.y, true);
    
    this.bts.buttonsNav.btnPrev = new Drag('bt_prev_1', CONFIG.buttonsNav.btnPrev.position.x, CONFIG.buttonsNav.btnPrev.position.y, true);
    this.bts.buttonsNav.btnNext = new Drag('bt_next_1', CONFIG.buttonsNav.btnNext.position.x, CONFIG.buttonsNav.btnNext.position.y, true);
    
    this.logo = new Drag('logo', CONFIG.logo.position.x, CONFIG.logo.position.y, true);
    this.addChild(this.logo);
    
    
    this.logo.alpha = (CONFIG.logo.visible) ? 1 : .5;
    this.logo.g = grps;
    this.logo.n = bt;
    this.logo.on('selecionado', function(){
        CONFIG.logo.visible = !CONFIG.logo.visible;
        this.alpha = (CONFIG.logo.visible) ? 1 : .5;
    });
    this.logo.on('moved',function(){
        CONFIG.logo.position.x = this.x;
        CONFIG.logo.position.y = this.y;
    });
    
    
    
    
    for(var grps in this.bts){
        var grp = this.bts[grps], x = 1;
        for(var bt in grp){
            var b = grp[bt];
            if(grps == 'buttonsApi' && CONFIG.buttonsAutoAlign){
                b.x = CONFIG.screen.width - (60 * x);
                b.y = 0;
                x++;
            }
            b.alpha = (CONFIG[grps][bt].visible) ? 1 : .5;
            b.g = grps;
            b.n = bt;
            b.on('selecionado', function(){
                CONFIG[this.g][this.n].visible = !CONFIG[this.g][this.n].visible;
                this.alpha = (CONFIG[this.g][this.n].visible) ? 1 : .5;
            });
            b.on('moved',function(){
                CONFIG[this.g][this.n].position.x = this.x;
                CONFIG[this.g][this.n].position.y = this.y;
                CONFIG.buttonsAutoAlign = false;
                self.realign();
            });
            this.addChild(b);
        }
    }
    var fpb = new PIXI.Graphics();
    fpb.beginFill(0xFFFFFF);
    fpb.drawRect(0, 0, 630, 30);
    fpb.endFill();
    fpb.x = 180;
    fpb.y = 520;
    this.addChild(fpb);
    for(var t = 1; t <= 8; t++){
        this.progressBar['type'+t] = new PIXI.Sprite(SPRITES['progress_tipo0'+t]);
        this.progressBar['type'+t].visible = (this.progressBar.sel == t);
        this.progressBar['type'+t].x = 194;
        this.progressBar['type'+t].y = (t == 1) ? 530 : 525;
        this.addChild(this.progressBar['type'+t]);
        this.progressBar['type'+t].interactive = this.progressBar['type'+t].buttonMode = true;
        this.progressBar['type'+t].on('click',function(){
            self.changePBtype();
        });
        this.progressBar['type'+t].on('touchend',function(){
            self.changePBtype();
        });
    }
}  

ConfigScreen.prototype.changePBtype = function(){
    this.progressBar['type'+this.progressBar.sel].visible = false;
    this.progressBar.sel = (this.progressBar.sel == 8) ? 1 : this.progressBar.sel + 1;
    this.progressBar['type'+this.progressBar.sel].visible = true;
    CONFIG.progressBar.type = this.progressBar.sel;
}