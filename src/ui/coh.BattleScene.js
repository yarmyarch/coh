var coh = coh || {};
coh.BattleScene = cc.Scene.extend({
    bgLayer : null, 
    onEnter:function () {
        this._super();
        this.bgLayer = new cc.Layer();
        var map = cc.TMXTiledMap.create("res/tmxmap/b_market.tmx"),
            winSize = cc.director.getWinSize(),
            scale = 0;
        
        this.bgLayer.addChild(map, 0, 1);
        map.setAnchorPoint(0.5,0.5);
        map.setScale(winSize.height / map.height);
        map.setPosition(winSize.width / 2, winSize.height / 2);

        coh.map2 = map;
        
        this.addChild(this.bgLayer);
    },
    
    generate : function() {
        var player = new coh.Player("", 1, { Archer : 24 });
        player.
    },
    
    placePlayer : function(player) {
        
        var unitConfig = {},
            units = player.getUnits();
        
        var unitType;
        for (var unitName in units) {
            unitType = coh.Unit.getType(unitName);
            unitConfig[unitType] && (unitConfig[unitType]);
            unitConfig[unitType] += units[unitName];
        }
        
        var dataGroup = coh.Battle.recharge(coh.LocalConfig.BLANK_DATA_GROUP, unitConfig);
        
        // XXXXXX ToDo: how to translate dataGroup into map positions?
    }
});
