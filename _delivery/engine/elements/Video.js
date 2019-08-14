function Video(file, x, y){
    Base.call(this);
    this.texture = PIXI.Texture.fromVideo('videos/'+file);


    // create a new Sprite using the video texture (yes it's that easy)
    var videoSprite = new PIXI.Sprite(texture);

    videoSprite.width = 200;
    videoSprite.height = 200;

    this.x = x;
    this._ox = x;
    this.y = y;
}

Video.prototype = Object.create(Base.prototype);
Video.prototype.constructor = Video;