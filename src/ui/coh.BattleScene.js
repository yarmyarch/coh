/**
 * relay on tileSelector, if you would like to place units to the battle ground.
 * inject it from the outer factory.
 */
var coh = coh || {};
    
(function() {

// local buffer for class BattleScene only.
var buf = {
    tmxList : {},
    bgList : {}
};

var handlerList = {
    // private properties
    // should be injected from outside.
    tileSelector : null
};

coh.BattleScene = cc.Scene.extend({
    battleLayer : null,
    battleField : null,
    battleMap : null,
    ctor:function (mapSrc, imgSrc) {
        this._super();
        this.battleLayer = new cc.Layer();
        
        this.setBattleField(imgSrc);
        this.setBattleMap(mapSrc);
        
        this.addChild(this.battleLayer);
    },
    
    /**
     * set background image.
     */
    setBattleField : function(imgSrc) {
        // 
        if (!imgSrc) return;
        
        var _buf = buf;
        if (!_buf.bgList[imgSrc]) {
            var sprite = cc.Sprite.create(imgSrc),
                winSize = cc.director.getWinSize();
            
            sprite.attr({
                anchorX : 0.5,
                anchorY : 0.5,
                scale : winSize.height / sprite.height,
                x : winSize.width / 2,
                y : winSize.height / 2 
            });
            
            _buf.bgList[imgSrc] = sprite;
        }
        
        if (this.battleField) {
            this.battleLayer.removeChild(this.battleField);
        }
        
        this.battleLayer.addChild(_buf.bgList[imgSrc], 0);
        this.battleField = _buf.bgList[imgSrc];
    },
    
    /**
     * set battle ground tmx map.
     */
    setBattleMap : function(mapSrc) {
        // 
        if (!mapSrc) return;
        
        var _buf = buf;
        if (!_buf.tmxList[mapSrc]) {
            var map = cc.TMXTiledMap.create(mapSrc),
                winSize = cc.director.getWinSize();
            
            map.attr({
                anchorX : 0.5,
                anchorY : 0.5,
                scale : winSize.height / map.height,
                x : winSize.width / 2,
                y : winSize.height / 2,
                
            });
            
            _buf.tmxList[mapSrc] = map;
        }
        
        if (this.battleMap) {
            this.battleLayer.removeChild(this.battleMap);
        }
        
        this.battleLayer.addChild(_buf.tmxList[mapSrc], 1);
        this.battleMap = _buf.tmxList[mapSrc];
    },
    
    setTileSelector : function(selector) {
        handlerList.tileSelector = selector;
    },
    
    generate : function(isDefender) {
        var player = new coh.Player("", 1, { archer : 24 });
        
        // attacker for default.
        isDefender = isDefender ? "setAsDefender" : "setAsAttacker";
        player[isDefender]();
        
        this.placePlayer(player);
    },
    
    placePlayer : function(player) {
        
        var unitConfig = {},
            units = player.getUnits(),
            _coh = coh;
        
        var unitType;
        for (var unitName in units) {
            // no interfaces changed.
            unitType = _coh.Unit.getType(unitName);
            unitConfig[unitType] || (unitConfig[unitType] = 0);
            unitConfig[unitType] += units[unitName].length;
        }
        
        var recharge = _coh.Battle.recharge(_coh.LocalConfig.BLANK_DATA_GROUP, unitConfig);
        
        console.log(recharge.succeed);
        
        for (var i = 0, row; row = recharge.succeed[i]; ++i) {
            for (var j = 0, status; (status = row[j]) != undefined; ++j) {
                console.log(i + " " + j + " " + status);
                status && this.placeUnit(player, status, i, j);
            }
        }
    },
    
    /**
     * tileSelector required. Should be injected from outside.
     */
    placeUnit : function(player, status, rowNum, colNum) {
        
        // find correct unit from the player via given status(type defined);
        var _coh = coh,
            unit = _coh.View.getSprite("archer", "idle", {color : status % _coh.LocalConfig.COLOR_COUNT}),
            tilePosition = handlerList.tileSelector.getTilePosition(player.isAttacker(), rowNum, colNum),
            tile = this.battleMap.getLayer(_coh.LocalConfig.MAP_BATTLE_LAYER_NAME).getTileAt(tilePosition);
        
        unit.attr({
            x : tile.x,
            y : tile.y,
            scale : _coh.LocalConfig.UNIT_GLOBAL_SCALE,
            anchorX: 0,
            anchorY: 1
        });
        
        var label = cc.LabelTTF.create(rowNum + ", " + colNum, "Arial", 24);
        label.attr({
            x : tile.x,
            y : tile.y,
            anchorX: 0,
            anchorY: 1
        });
        
        this.battleMap.addChild(unit, tilePosition.y);
        this.battleMap.addChild(label, tile.x);
        
        _coh.unitList = _coh.unitList || [];
        _coh.unitList.push(unit);
    }
});

})();