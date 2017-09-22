const HallScene = cc.Scene.extend({

    self: undefined,

    onEnter: function () {
        cc.log("HallScene onEnter");
        this._super();
        this.setupUI();
    },
    onExit: function () {
        this._super();
        this.removeAllChildren();
    },
    setupUI: function () {
    	 let layer = new cc.Layer();
        this.addChild(layer);
  	     let a = new cc.Sprite("Images/meinv.png");
                        a.attr({
                            x: cc.winSize.width/2,
                            y: cc.winSize.height/2
                        });
                        layer.addChild(a);

        

    }
});