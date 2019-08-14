function Video(file, x, y, w, h){
    Base.call(this);
    this.paused = false;

    file = file.replace('video_','').replace('.png', '.mp4');
    this.texture = PIXI.Texture.fromVideo('videos/'+file);
    this.videoSprite = new PIXI.Sprite(this.texture);
    this.videoSprite.width = w;
    this.videoSprite.height = h;
    
    this.texture.baseTexture.on('loaded', ()=>{
        this.texture.baseTexture.source.pause();
        this.paused = true;
    });
    
    this.addChild(this.videoSprite);

    this.onEvents();
    this.on('clicado',()=>{
        if(this.paused){
            this.texture.baseTexture.source.play();
        } else {
            this.texture.baseTexture.source.pause();
        }
        this.paused = !this.paused;
    });


    this.x = x;
    this._ox = x;
    this.y = y;
}

Video.prototype = Object.create(Base.prototype);
Video.prototype.constructor = Video;