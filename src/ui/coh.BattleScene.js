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
        unitMatrix : {},
        
        focusNode : null
    };

    var handlerList = {
        // private properties
        // should be injected from outside.
        tileSelector : null
    };
    
    // private functions
    var util = {
        getFocusTag : function() {
            var _buf = buf,
                _coh = coh;
            // create the node if not exist.
            if (!_buf.focusNode) {
                _buf.focusNode = new coh.cpns.Cursor();
                self.battleMap.addChild(_buf.focusNode);
            }
            
            return _buf.focusNode;
        }
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
        attacker : null,
        defender : null,
        isAttackerTurn : true,
        ctor : function (mapSrc, imgSrc) {
            this._super();
            this.battleLayer = new cc.Layer();
            
            this.setBattleField(imgSrc);
            this.setBattleMap(mapSrc);
            
            this.addChild(this.battleLayer);
        },
        
        onEnter : function() {
            coh.utils.FilterUtil.applyFilters("battleSceneEntered", this);
        },
        
        onEnterTransitionDidFinish : function() {
            coh.utils.FilterUtil.applyFilters("battleSceneReady", this);
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
            
            this.battleLayer.addChild(_buf.bgList[imgSrc], coh.LocalConfig.Z_INDEX.BACKGROUND);
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
            
            this.battleLayer.addChild(_buf.tmxList[mapSrc], coh.LocalConfig.Z_INDEX.CONTENT);
            this.battleMap = _buf.tmxList[mapSrc];
        },
        
        setTileSelector : function(selector) {
            handlerList.tileSelector = selector;
        },
        
        /**
         * get unit sprite via given position in the view.
         */
        getUnitData : function(isAttacker, posX, posY) {
            var scale = this.battleMap.scale,
                tile = handlerList.tileSelector.getTilePositionFromCoord(
                    this.battleMap.width * scale, 
                    this.battleMap.height * scale,
                    posX - this.battleMap.x * scale, 
                    posY
                ),
                _buf = buf;
            
            tile = handlerList.tileSelector.filterTurnedTiles(isAttacker, tile.x, tile.y);
            
            return _buf.unitMatrix[tile.x] && _buf.unitMatrix[tile.x][tile.y] && _buf.unitMatrix[tile.x][tile.y];
        },
        
        // XXXXXX
        locateUnit : function(){},
        focusUnit : function(){},
        
        generatePlayerMatrix : function(player) {
            
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
            
            return recharge;
        }, 
        
        renderPlayer : function(player, matrix) {
            
            player.isAttacker() && this.setAttacker(player) || this.setDefender(player);
            
            for (var i = 0, row; row = matrix.succeed[i]; ++i) {
                for (var j = 0, status; (status = row[j]) != undefined; ++j) {
                    status && _coh.Battle.getTypeFromStatus(status) && this.placeUnit(player, status, i, j);
                }
            }
        },
        
        setAttacker : function(attacker) {
            this.attacker = attacker;
        },
        
        setDefender : function(defender) {
            this.defender = defender;
        },
        
        /**
         * tileSelector required. Should be injected from outside.
         */
        placeUnit : function(player, status, rowNum, colNum) {
            
            // find correct unit from the player via given status(type defined);
            var _coh = coh,
                _buf = buf,
                scale = this.battleMap.scale,
                unit = player.getUnplacedUnit(status),
                // color is the UI based property. So let's just keep it in Scene.
                unitSprite = _coh.View.getSprite(unit.getName(), "idle", {color : status % _coh.LocalConfig.COLOR_COUNT}),
                // get tile and do the possible translation, for example for a type 2 defender unit.
                tilePosition = handlerList.tileSelector.getTilePosition(player.isAttacker(), _coh.Battle.getTypeFromStatus(status), rowNum, colNum),
                tile = this.battleMap.getLayer(_coh.LocalConfig.MAP_BATTLE_LAYER_NAME).getTileAt(tilePosition),
                
                tileSprite = cc.DrawNode.create(),
                shadow = cc.Sprite.create(_coh.res.imgs.shadow);
            
            // set buffer
            // mind types that's not having 1 tile.
            var typeConfig = _coh.LocalConfig.LOCATION_TYPE[unit.getType()];
            for (var rowCount = 0; rowCount < typeConfig[0]; ++rowCount) {
                for (var columnCount = 0; columnCount < typeConfig[1]; ++columnCount) {
                    _buf.unitMatrix[tilePosition.x + columnCount] = _buf.unitMatrix[tilePosition.x + columnCount] || {};
                    _buf.unitMatrix[tilePosition.x + columnCount][tilePosition.y - rowCount] = {
                        unit : unit,
                        tileSprite : tileSprite,
                        unitSprite : unitSprite
                    };
                }
            }
            
            tileSprite.attr({
                x : tile.x,
                y : tile.y,
                //~ width: tile.width * typeConfig[1],
                //~ height: tile.height * typeConfig[0]
                width: tile.width,
                height: tile.height
            });
            
            shadow.attr({
                x : 0,
                y : 0,
                anchorX: -0.05,
                anchorY: 0.3,
                scaleX : typeConfig[1] * 0.8,
                scaleY : 0.75,
                opacity:164
            });
            
            tileSprite.drawRect(new cc.Point(0,0), new cc.Point(tileSprite.width, tileSprite.height), new cc.Color(128,128,128,64), 4, new cc.Color(255,255,255));
            
            unitSprite.attr({
                x : 0,
                y : 0,
                scale : _coh.LocalConfig.SPRITE_SCALE[unit.getType()],
                anchorX: 0,
                anchorY: 0
            });
            unitSprite.addChild(shadow, _coh.LocalConfig.Z_INDEX.BACKGROUND);
            tileSprite.addChild(unitSprite, _coh.LocalConfig.Z_INDEX.CONTENT);
            this.battleMap.addChild(tileSprite, tilePosition.y);
            
            _coh.unitList = _coh.unitList || [];
            _coh.unitList.push(unitSprite);
            _coh.unitMatrix = _buf.unitMatrix;
        },
        
        util : util
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