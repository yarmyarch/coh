var coh = coh || {};
coh.BattleScene = cc.Scene.extend({
    bgLayer : null, 
    onEnter:function () {
        this._super();
        this.bgLayer = new cc.Layer();
        
        var _coh = coh,
            map = cc.TMXTiledMap.create(_coh.res.map.market.tmx),
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
        //~ player.
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
        
        var recharge = _coh.Battle.recharge(_coh.LocalConfig.BLANK_DATA_GROUP, unitConfig);
        
        for (var i = 0, row; row = recharge.succeed[i]; ++i) {
            for (var j = 0, status; status = row[j]; ++j) {
                this.placeUnit(player, status, i, j);
            }
        }
    },
    
    placeUnit : function(player, status, rowNum, colNum) {
        
        // find correct unit from the player via given status(type defined);
        var unit = coh.View.getSprite("archer", "idle", {color : status % coh.LocalConfig.COLOR_COUNT});
        
        // find position from given rowNum and colNum;
        this.bgLayer.addChild(unit);
    }
});
