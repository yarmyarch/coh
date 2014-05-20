var coh = coh || {};
coh.BattleScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var bgLayer = new cc.Layer(),
            map = cc.TMXTiledMap.create("res/tmxmap/b_market.tmx"),
            winSize = cc.director.getWinSize(),
            scale = 0;
        
        bgLayer.addChild(map, 0, 1);
        map.setAnchorPoint(0.5,0.5);
        map.setScale(winSize.height / map.height);
        map.setPosition(winSize.width / 2, winSize.height / 2);

        coh.map2 = map;
        
        this.addChild(bgLayer);
    }
});
