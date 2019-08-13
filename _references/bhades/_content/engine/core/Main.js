Main = {
    loader : new Loader(),
    init : function(){
        RENDERER.view.id = 'hAPI';
        document.body.appendChild(RENDERER.view);
        RENDERER.backgroundColor = 0xFFFFFF;
        RENDERER.render(STAGE);
        STAGE.addChild(Main.loader);
        SPRITES.on('loadComplete', function(){
            Main.loader.off();
            Main.API = new hAPI();
            STAGE.addChild(Main.API);
            Main.configurations = new ConfigScreen();
            STAGE.addChild(Main.configurations);
            Main.API.draw();
            Main.animate();  
        });
        SPRITES.load();
    },
    animate : function(){
        RENDERER.render(STAGE);
        Main.update();
        requestAnimationFrame(function(){
            Main.animate();
        })
    },
    update : function(){
        for(var i = 0; i < TOUP.length; i++){
            TOUP[i].update();
        }
    },
    
    openConfigurations : function(){
        Main.configurations.open();
    },
    
    startDebug : function(){
        Main.API.startDebug();
    }
    
}