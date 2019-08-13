var AudioManager = {
    play : function(a, fn){
        if(AudioManager.audio){
            AudioManager.audio.pause();
        } 
        AudioManager.audio = new Audio(a);
        AudioManager.audio.play();
        $(AudioManager.audio).bind("ended", function(){
            if(fn) fn();
        })
    },
    
    stop : function(){
        if(AudioManager.audio){
            AudioManager.audio.pause();
        }
    }
}