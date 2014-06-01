var coh = coh || {};
coh.BattleScene = cc.Scene.extend({
    bgLayer : null, 
    onEnter:function () {
        this._super();
        this.bgLayer = new cc.Layer();
        
        var _coh = coh,
            map = cc.TMXTiledMap.create(_coh.res.map.battle.tmx),
            winSize = cc.director.getWinSize(),
            scale = 0;
        
        this.bgLayer.addChild(map, 0, 1);
        map.setAnchorPoint(0.5,0.5);
        map.setScale(winSize.height / map.height);
        map.setPosition(winSize.width / 2, winSize.height / 2);

        _coh.map2 = map;
        
        this.addChild(this.bgLayer);
    },
    
    generate : function() {
        var player = new coh.Player("", 1, { Archer : 24 });
        player.
    },
    
    placePlayer : function(player) {
        
        var unitConfig = {},
            units = player.getUnits(),
            _coh = coh;
        
        var unitType;
        for (var unitName in units) {
            // no interfaces changed.
            unitType = _coh.Unit.getType(unitName);
            unitConfig[unitType] && (unitConfig[unitType]);
            unitConfig[unitType] += units[unitName];
        }
        
        var dataGroup = _coh.Battle.recharge(_coh.LocalConfig.BLANK_DATA_GROUP, unitConfig);
        
        for (var i = 0, row; row = dataGroup[i]; ++i) {
            for (var j = 0, target; target = row[j]; ++j) {
                
            }
        }
        
        // XXXXXX ToDo: how to translate dataGroup into map positions?
        // Maybe I should make units configs to prevent to much js files.
    }
});