/**
 * relay on :
    TileSelector: if you would like to place units to the battle ground;
 * inject it from the outer factory.
 *
 *@dispatch filterName: battleSceneEntered
 *@dispatch filterName: unitSpriteCreated
 */
var coh = coh || {};

coh.BattleScene = function() {

    var self;
    
    // private fields
    var buf = {
        tmxList : {},
        bgList : {},
        
        /**
         * Saved units in current battle scene.
         * Index by poition x and position y.
        unitMatrix = {
            [positionX] : {
                [positionY] : {
                    unit : [unitObject],
                    unitSprite : [unitSprite],
                },
                ... // other unit groups with the position x;
            },
            // other row data
        }
         */
        unitMatrix : {}
    };

    var handlerList = {
        // private properties
        // should be injected from outside.
        tileSelector : null
    };
    
    // Sorry but I really did't mean to make it so ugly...
    // Just for private fields.
    var argList = [];
    for (var i = 0, arg; arg = arguments[i]; ++i) {
        argList.push("arguments[" + i + "]");
    }
    argList = argList.join(",");
    
    var BSClass = cc.Scene.extend({
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
        
        onEnter : function() {
            coh.utils.FilterUtil.applyFilters("battleSceneEntered", this);
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
        
        /**
         * get unit sprite via given position in the view.
         */
        getUnitData : function(posX, posY) {
            var scale = this.battleMap.scale,
                tile = handlerList.tileSelector.getTilePositionFromCoord(
                    this.battleMap.width * scale, 
                    this.battleMap.height * scale,
                    posX - this.battleMap.x * scale, 
                    posY
                ),
                _buf = buf;
            return _buf.unitMatrix[tile.x] && _buf.unitMatrix[tile.x][tile.y] && _buf.unitMatrix[tile.x][tile.y];
        },
        
        generate : function(isDefender) {
            var player = new coh.Player("", 1, { archer : 24, knight: 4, paladin: 2});
            
            // attacker for default.
            isDefender = isDefender ? "setAsDefender" : "setAsAttacker";
            player[isDefender]();
            
            this.placePlayer(player);
        },
        
        placePlayer : function(player) {
            
            var unitConfig = {},
                units = player.getUnitConfig(),
                _coh = coh;
            
            var unitType;
            for (var unitName in units) {
                // no interfaces changed.
                unitType = _coh.Unit.getType(unitName);
                unitConfig[unitType] || (unitConfig[unitType] = 0);
                unitConfig[unitType] += units[unitName];
            }
            
            var recharge = _coh.Battle.recharge(_coh.LocalConfig.BLANK_DATA_GROUP, unitConfig);
            
            for (var i = 0, row; row = recharge.succeed[i]; ++i) {
                for (var j = 0, status; (status = row[j]) != undefined; ++j) {
                    status && _coh.Battle.getTypeFromStatus(status) && this.placeUnit(player, status, i, j);
                }
            }
        },
        
        /**
         * tileSelector required. Should be injected from outside.
         */
        placeUnit : function(player, status, rowNum, colNum) {
            
            // find correct unit from the player via given status(type defined);
            var _coh = coh,
                _buf = buf,
                unit = player.getUnplacedUnit(status),
                // color is the UI based property. So let's just keep it in Scene.
                unitSprite = _coh.View.getSprite(unit.getName(), "idle", {color : status % _coh.LocalConfig.COLOR_COUNT}),
                // get tile and do the possible translation, for example for a type 2 defender unit.
                tilePosition = handlerList.tileSelector.getTilePosition(player.isAttacker(), _coh.Battle.getTypeFromStatus(status), rowNum, colNum),
                tile = this.battleMap.getLayer(_coh.LocalConfig.MAP_BATTLE_LAYER_NAME).getTileAt(tilePosition);
            
            _coh.utils.FilterUtil.applyFilters("unitSpriteCreated", unitSprite);
            
            unitSprite.attr({
                x : tile.x,
                y : tile.y,
                scale : _coh.LocalConfig.SPRITE_SCALE[unit.getType()],
                //~ scale : 1,
                anchorX: 0,
                anchorY: 1
            });
            this.battleMap.addChild(unitSprite, tilePosition.y);
            
            // set buffer
            // mind types that's not having 1 tile.
            var typeConfig = _coh.LocalConfig.LOCATION_TYPE[unit.getType()];
            for (var rowCount = 0; rowCount < typeConfig[0]; ++rowCount) {
                for (var columnCount = 0; columnCount< typeConfig[1]; ++columnCount) {
                    _buf.unitMatrix[tilePosition.x + columnCount] = _buf.unitMatrix[tilePosition.x + columnCount] || {};
                    _buf.unitMatrix[tilePosition.x + columnCount][tilePosition.y + rowCount] = {
                        unit : unit,
                        unitSprite : unitSprite
                    };
                }
            }
            
            _coh.unitList = _coh.unitList || [];
            _coh.unitList.push(unitSprite);
        }
    });
    
    return self = eval("new BSClass(" + argList + ")");
    
    /**
     * XXXXXX
     * How to locate unit via the position? unitId?
    1. Event triggered;
        click
    2. Handlers in controller captured;
    3. Find Unit instance in model via position;
        instance of Player
    4. Update model if necessary;
        HP decrease 1;
    5. Dispatch filter event, filter triggered;
    6. Handlers in controller captured;
    7. Do update in View;
        BattleScene, update HP info for a sprite.
    */
};