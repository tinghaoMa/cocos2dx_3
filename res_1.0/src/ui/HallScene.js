const HallScene = cc.Scene.extend({

    self: undefined,

    onEnter: function () {
        cc.log("我是从远端更新下来的HallScene");
        cc.log("HallScene onEnter");
        this._super();
        this.setupUI();
        GameSocketClient.onRoomList(this.onRoomUserList);
        HallScene.self = this;

    },
    onExit: function () {
        this._super();
        this.removeAllChildren();
        GameSocketClient.removeOnRoomList();
    },
    onRoomUserList: function (romeArr) {
        HallScene.self.openRoomsLayer.reloadData(romeArr);
    },
    setupUI: function () {
        this.setBg();

        let avatar = new UserAvatarSprite();
        avatar.attr({x: 12, y: cc.winSize.height - 3, anchorX: 0, anchorY: 1});
        this.addChild(avatar);
        avatar.loadImgFromUrl(LoginUser.headimgurl);

        let userNameLabel = new ccui.Text(LoginUser.nickname, res.defFont, 24);
        userNameLabel.attr({x: avatar.x + avatar.width + 12, y: cc.winSize.height - 20, anchorX: 0, anchorY: 1});
        this.addChild(userNameLabel);

        let lvNameLabel = new ccui.Text("Lv.1", res.defFont, 24);
        lvNameLabel.setTextColor(cc.color(255, 184, 35, 255));
        lvNameLabel.attr({x: userNameLabel.x, y: cc.winSize.height - 55, anchorX: 0, anchorY: 1});
        lvNameLabel.setString("Lv.10");
        this.addChild(lvNameLabel);

        let slider = new ccui.Slider();
        slider.attr({x: userNameLabel.x + 80, y: cc.winSize.height - 55, anchorX: 0, anchorY: 1});
        this.addChild(slider);

        //顶部功能列表
        let hallTopLayer = new HallTopLayer();
        this.addChild(hallTopLayer);

        //公开房列表
        this.openRoomsLayer = new OpenRoomsLayer();
        this.addChild(this.openRoomsLayer);

        //创建房间按钮
        let creatRoomBtn = new cc.MenuItemImage(
            "#btn_creat_index_nor.png",
            "#btn_creat_index_pre.png",
            this.onCreatRoomBtnClicked,
            this);
        creatRoomBtn.attr({x: cc.winSize.width - 40, y: 368, anchorX: 1, anchorY: 0});
        //加入房间按钮
        let joinRoomBtn = new cc.MenuItemImage(
            "#btn_join_index_nor.png",
            "#btn_join_index_pre.png",
            this.onJoinRoomBtnClicked,
            this);
        joinRoomBtn.attr({x: cc.winSize.width - 40, y: 156, anchorX: 1, anchorY: 0});


        let menu = new cc.Menu(creatRoomBtn, joinRoomBtn);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        //荷官  （帧动画）
        let dealer = cc.Sprite.create("res/dealer/dealer_1.png");
        dealer.attr({x: cc.winSize.width / 2 - 50, y: -100, anchorX: 0.5, anchorY: 0});
        dealer.setScale(0.5);
        this.addChild(dealer);
        let animation = cc.Animation.create();
        for (let i = 1; i <= 50; i++) {
            animation.addSpriteFrameWithFile("res/dealer/dealer_" + i + ".png");
        }
        animation.setDelayPerUnit(0.05);
        animation.setLoops(999999);
        dealer.runAction(cc.Animate(animation));
        let action = cc.animate(animation);
        dealer.runAction(action);


        /** 骨骼动画
         cc.spriteFrameCache.addSpriteFrames(res.dt_nv20_plist, res.dt_nv20);
         cc.spriteFrameCache.addSpriteFrames(res.dt_nv21_plist, res.dt_nv21);
         cc.spriteFrameCache.addSpriteFrames(res.dt_nv22_plist, res.dt_nv22);
         cc.spriteFrameCache.addSpriteFrames(res.dt_nv23_plist, res.dt_nv23);
         cc.spriteFrameCache.addSpriteFrames(res.dt_nv24_plist, res.dt_nv24);
         cc.spriteFrameCache.addSpriteFrames(res.dt_nv25_plist, res.dt_nv25);

         ccs.armatureDataManager.addArmatureFileInfo("res/loadingLayerAni/dt_nv2.ExportJson");
         let dt_nv2 = new ccs.Armature("dt_nv2");
         dt_nv2.setScale(0.5);
         dt_nv2.attr({x: cc.winSize.width / 2 - 40, y: -400, anchorY: 0});
         dt_nv2.animation.play("Animation1");
         this.addChild(dt_nv2);
         */

            //底部功能按钮
        let bottomLayer = new HallBottomLayer();
        this.addChild(bottomLayer);

    },

    setBg: function () {
        let bgSprite = new cc.Sprite(res.hall_bg);
        let sc = 1;
        if (cc.scFlag === cc.scFlagW) {
            sc = cc.winSize.width / bgSprite.width;
        } else if (cc.scFlag === cc.scFlagH) {
            sc = cc.winSize.height / bgSprite.height;
        }
        bgSprite.attr({x: cc.winSize.width / 2, y: cc.winSize.height / 2, scale: sc});
        this.addChild(bgSprite, 0);
    },

    onCreatRoomBtnClicked: function () {
        cc.log("点击创建房间");
        let dialog = new CreateRoomDialog();
        dialog.createBtn.addClickEventListener(this.onCreatRoomSuccess);
        dialog.show();
    },
    onJoinRoomBtnClicked: function () {
        cc.log("点击加入房间");
        let dialog = new JoinRoomDialog();
        dialog.onJoinClick = function (roomId) {
            cc.log(roomId);
        };
        dialog.show();
    },

    onCreatRoomSuccess: function () {
        GameSocketClient.createRoom(function () {
            cc.director.pushScene(new GameScene());
        });

    }
});