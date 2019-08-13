function hAPI(){
    Base.call(this);
    this.dbug = false;
    this.audioPlayer = AudioManager;
    this.createInterface();    
    this.progressBar = new ProgressBar(this.dbug);
    //this.makeHelp();
    if(this.dbug){
        this.startDebug();
    }
    var self = this;
    setTimeout(function(){
        self.checkContinue();
    },10);
    
}
hAPI.prototype = Object.create(Base.prototype);
hAPI.prototype.constructor = hAPI;

hAPI.prototype.playAudio = function(audio){
    audio = 'telas/'+this.menu.bts[currentPage].folder+'/'+audio+'.mp3';
    this.audioPlayer.play(audio);
}

hAPI.prototype.createInterface = function(){
    this.btnMenu = new Button('bt_menu_1', 0 , 0);
    this.btnMenu.textures.push('bt_menu_2');
    this.btnMenu.textures.push('bt_menu_3');
    this.btnHelp = new Button('bt_ajuda_1', 0 , 0);
    this.btnHelp.textures.push('bt_ajuda_2');
    this.btnHelp.textures.push('bt_ajuda_3');
    this.btnAudio = new Button('bt_audio_1', 0 , 0);
    this.btnAudio.textures.push('bt_audio_2');
    this.btnAudio.textures.push('bt_audio_3');
    this.btnAudio2 = new Button('bt_audio_1_1', 0 , 0);
    this.btnAudio2.textures.push('bt_audio_1_2');
    this.btnAudio2.textures.push('bt_audio_1_3');
    this.btnFechar = new Button('bt_fechar_1', 0 , 0);
    this.btnFechar.textures.push('bt_fechar_2');
    this.btnFechar.textures.push('bt_fechar_3');
    this.btnPrev = new Button('bt_prev_1', 0, 0);
    this.btnPrev.textures.push('bt_prev_2');
    this.btnPrev.textures.push('bt_prev_3');
    this.btnNext = new Button('bt_next_1', 0, 0);
    this.btnNext.doNext();
    this.btnNext.textures.push('bt_next_2');
    this.btnNext.textures.push('bt_next_3');
    
    this.logo = new PIXI.Sprite(SPRITES['logo']);
    this.lineTopo = new PIXI.Sprite(SPRITES['lineTopo']);
    this.configButtons();
    this.CTELA = new Base();
    this.m = new PIXI.Graphics();
    this.m.beginFill(0xFF0000);
    this.m.drawRect(0, 90, CONFIG.screen.width, CONFIG.screen.height - 90);
    this.m.endFill();
    this.CTELA.mask = this.m;
    this.CTELA.y = 90;
    this.telas = [];
    
    this.menu = new Menu(DATA_CURSO.telas); 
    this.title = new PIXI.Text(DATA_CURSO.nome_curso, {font: '800 28px Calibri', fill: '#dc0000'});
    this.title_tela = new PIXI.Text(this.menu.bts[currentPage].t.replace('- ', ''), {font: '19px Calibri', fill: '#404040'});
}

hAPI.prototype.makeHelp = function(){
    this.ajuda = new Base();
    var g = new PIXI.Graphics();
    g.beginFill(0xFFFFFF);
    g.drawRect(0, 0, CONFIG.screen.width, CONFIG.screen.height - 100);
    g.endFill();
    g.alpha = .7;
    g.x = -33;
    this.ajuda.addChild(g);
    var a = new PIXI.Sprite(PIXI.Texture.fromImage('assets/ajuda/ajuda.png'));
    this.ajuda.addChild(a);
    var bt = new Button('btFecharAjuda', 400, 300), self = this;
    bt.textures.push('btFecharAjuda2');
    bt.on('clicado', function(){
        self.removeChild(self.ajuda);
    })
    this.ajuda.addChild(bt);
    this.ajuda.x = 33;
    this.ajuda.y = 60;
}

hAPI.prototype.draw = function(){
    this.title.x = 1100;
    this.title.y = 20;
    this.title_tela.x = 1100;
    this.title_tela.y = 50;
    this.lineTopo.x = 205;
    this.logo.x = CONFIG.logo.position.x;
    this.logo.y = CONFIG.logo.position.y;
    this.logo.visible = CONFIG.logo.visible;
    this.btnMenu.visible = CONFIG.buttonsApi.btnMenu.visible;
    this.btnHelp.visible = CONFIG.buttonsApi.btnHelp.visible;
    this.btnFechar.visible = CONFIG.buttonsApi.btnFechar.visible;
    this.btnAudio.visible = CONFIG.buttonsApi.btnAudio.visible;
    
    this.btnMenu.x = CONFIG.buttonsApi.btnMenu.position.x;
    this.btnMenu.y = CONFIG.buttonsApi.btnMenu.position.y;
    this.btnHelp.x = CONFIG.buttonsApi.btnHelp.position.x;
    this.btnHelp.y = CONFIG.buttonsApi.btnHelp.position.y;
    this.btnFechar.x = CONFIG.buttonsApi.btnFechar.position.x;
    this.btnFechar.y = CONFIG.buttonsApi.btnFechar.position.y;
    this.btnAudio.x = CONFIG.buttonsApi.btnAudio.position.x;
    this.btnAudio.y = CONFIG.buttonsApi.btnAudio.position.y;
    
    this.btnNext.visible = CONFIG.buttonsNav.btnNext.visible;
    this.btnNext.x = CONFIG.buttonsNav.btnNext.position.x;
    this.btnNext.y = CONFIG.buttonsNav.btnNext.position.y;
    this.btnPrev.visible = CONFIG.buttonsNav.btnPrev.visible;
    this.btnPrev.x = CONFIG.buttonsNav.btnPrev.position.x;
    this.btnPrev.y = CONFIG.buttonsNav.btnPrev.position.y;
    

    var x = 1;
    for(var bt in CONFIG.buttonsApi){
        if(CONFIG.buttonsApi[bt] && CONFIG.buttonsAutoAlign){
            this[bt].x = CONFIG.screen.width - (60 * x);
            this[bt].y = 0;
           x++; 
        }    
    }
    
    
    
    this.btnAudio2.x = this.btnAudio.x;
    
    this.addChild(this.CTELA);
    this.addChild(this.btnFechar);
    this.addChild(this.btnAudio2);
    this.addChild(this.btnAudio);
    this.addChild(this.btnHelp);
    this.addChild(this.btnMenu);
    this.addChild(this.title);
    this.addChild(this.title_tela);
    //this.addChild(this.progressBar);
    this.addChild(this.logo);
    //this.addChild(this.lineTopo);
    //this.addChild(this.menu);
    this.addChild(this.btnPrev);
    this.addChild(this.btnNext);
    
}

hAPI.prototype.changePage = function(page){
    this.btnNext.stopAnimation();
    var page = (parseInt(page));
    page = (page <= this.menu.bts.length-1) ? page : this.menu.bts.length-1;
    var c = currentPage;
    currentPage = page;
    lastPage = (currentPage > lastPage) ? currentPage : lastPage;
    this.progressBar.update(lastPage, this.menu.bts.length, this.dbug);
    if(currentPage > 0){
        this.btnPrev.enable();
    } else {
        this.btnPrev.disable();
    }

    if(currentPage == lastPage || currentPage == this.menu.bts.length-1){
        this.btnNext.disable();
    } else {
        this.btnNext.enable();
    }

    if(this.dbug && currentPage != this.menu.bts.length-1){
        this.btnNext.enable();
    }

    this.menu.organize(currentPage, lastPage, this.dbug);
    if (ObjTeAt){
        this.CTELA.removeChild(this.telas[c]);
    }
    
    if(LMSInitialize()){
        LMSSetValue("cmi.core.lesson_location", page);
    } else {
        localStorage.setItem("lastLocationHades", page);
    }

    this.audioPlayer.stop();

    if(stage){
        stage.enableDOMEvents(false);
        createjs.Ticker.removeEventListener('tick', stage);
        stage.removeChild(exportRoot);
        exportRoot = null;
        stage = null;
        //canvas = null;
    }
    $("#adobeAnimate").hide();
    
    this.loadPage(page); 
}

hAPI.prototype.configButtons = function(){
    
    var self = this;
    
    this.btnNext.disable();
    this.btnPrev.disable();
    
    
    
    this.btnNext.on('clicado',function(){
        if(currentPage <= self.menu.bts.length){
            self.changePage(currentPage + 1);
            this.stopAnimation();
        }
    });
    
    this.btnPrev.on('clicado', function(){
        if(currentPage > 0){
            self.changePage(currentPage-1);
        }
    })
    
    this.btnMenu.on('clicado',function(){
       Main.API.menu.open(); 
    });
    this.btnAudio2.visible = false;
    this.btnAudio.on('clicado',function(){
        this.visible = false;
        self.btnAudio2.visible = true;
    });
    this.btnAudio2.on('clicado',function(){
        this.visible = false;
        self.btnAudio.visible = true;
    });
    
    this.btnHelp.on('clicado', function(){
        self.addChild(self.ajuda);
    })
    
}

hAPI.prototype.enableNext = function(){
    if(currentPage < this.menu.bts.length -1){
        this.btnNext.enable(currentPage == lastPage);
        var lp = (currentPage == lastPage) ? lastPage+1 : lastPage;
        this.menu.organize(currentPage, lp, this.dbug);
    } else {
        terminaLMS();
    }
}

hAPI.prototype.init = function(){
    iniciaLMS();
    this.changePage(currentPage);
}



hAPI.prototype.loadPage = function(page){
    var self = this;
    $('base').attr('href', '');
    if(this.telas[page] == undefined){
//    if(1==1){
        if(!self.menu.bts[page].adobeAnimate){
            $.getScript('telas/'+self.menu.bts[page].folder+'/Tela.js', function(){
                self.telas[page] = ObjTeAt;
                self.CTELA.addChild(self.telas[page]);
            });
        } else {
            Main.loader.on();
            $('#adobeAnimate').html('');
            $.ajax({
                url : 'telas/'+self.menu.bts[page].folder+'/Tela.html',
                context : document.body
            }).done(function(a, b, c){
                $('base').attr('href', "telas/"+self.menu.bts[page].folder+"/");
                $('#adobeAnimate').append(a).show().css({marginLeft:$('#hAPI')[0].offsetLeft});
                init();
                Main.loader.off();
            });
        }
    } else {
        this.CTELA.addChild(this.telas[page]);
        this.telas[page].init();
    }
    this.title_tela.text = self.menu.bts[page].t.replace('- ','');
        
}

hAPI.prototype.startDebug = function(){
    if(!this.dbug){
        this.dbug = true;
        this.progressBar.liberar();
        this.enableNext();
        this.debug_display = new PIXI.Text('DEBUG', {font: '800 22px Calibri', fill:'#FF0000'});
        this.debug_display.x = 650;
        this.debug_display.y = 20;
        this.addChild(this.debug_display);
    }
}

hAPI.prototype.checkContinue = function(){
    var ll, self = this;
    if(LMSInitialize()){
        ll = (LMSGetValue("cmi.core.lesson_location") > 0) ? LMSGetValue("cmi.core.lesson_location") : 0;
    } else {
        ll = (localStorage.getItem('lastLocationHades') > 0) ? localStorage.getItem('lastLocationHades') : 0;
    }
    if(ll > 0){
        this.confirm = new Confirm('Olá aluno, deseja continuar da pagina '+(parseInt(ll)+1)+'?');
        this.addChild(this.confirm);
        this.confirm.on('closed', function(ret){
            currentPage = (ret) ? ll : 0;
            self.init();
        });
    } else {
        this.init();
    }
}