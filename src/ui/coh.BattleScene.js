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
                [positionY] : [UnitTile],
                ... // other unit groups with the position x;
            },
            // other row data
        }
         */
        unitMatrix : {},
        
        focusTag : null,
        
        isAttackerTurn : true,
        
        // if the user is focusing on some a unit, the focusnode would be locked.
        // that means it won't react on any other locate events.
        focusTagLocked : false,
        
        
    };

    var handlerList = {
        // private properties
        // should be injected from outside.
        tileSelector : null
    };
    
    // private functions
    var util = {
        /**
         * Rules: if it's out of X border, locate to the nearest column that's having an unit;
         * Otherwise, locate to the poingint column.
         *
         */
        getAvaliableTiles : function(isAttacker, tileX, tileY) {
            var xRange = handlerList.tileSelector.getXRange(),
                yRange = handlerList.tileSelector.getYRange(isAttacker),
            
                overRight = tileX > xRange[xRange.length - 1],
                overLeft = tileX < xRange[0],
            
                overTop = isAttacker ? tileY < yRange[2] : tileY > yRange[2],
                overBottom = isAttacker ? tileY > yRange[yRange.length - 1] : tileY < yRange[yRange.length - 1],
            
                startX = overRight ? xRange[xRange.length - 1] : overLeft ? xRange[0] : tileX,
                endX = overRight ? xRange[0] : overLeft ? xRange[xRange.length - 1] : tileX,
                deataX = overRight ? -1 : overLeft ? 1 : 0,
                
                /**
                 *Position Y would be a problem.... for cases like this, while 0 is the position of the given tile.
                 *
                ******
                *****
               0 **
                 **
                */
                startY = overTop ? yRange[0] : overBottom ? yRange[yRange.length - 1] : tileY,
                endY = overTop ? yRange[yRange.length - 1] : overBottom ? yRange[0] : tileY,
                deataY = overTop ? (isAttacker ? 1 : -1) : overBottom ? (isAttacker ? -1 : 1) : 0,
            
                _buf = buf,
                x = startX, y = startY;
            
            do {
                do {
                    if (_buf.unitMatrix[x] && _buf.unitMatrix[x][y]) return {x : x, y : y};
                    y += deataY;
                } while (y != endY);
                x += deataX;
            } while (x != endX);
            
            // nothing matches found for given tile.
            return null;
        }
    };
    
    var BSClass = cc.Scene.extend({
        battleLayer : null,
        battleField : null,
        battleMap : null,
        attacker : null,
        defender : null,
        ctor : function (mapSrc, imgSrc) {
            this._super();
            this.battleLayer = new cc.Layer();
            
            this.setBattleField(imgSrc);
            this.setBattleMap(mapSrc);
            
            this.addChild(this.battleLayer);
        },
        
        onEnter : function() {
            this._super();
            coh.utils.FilterUtil.applyFilters("battleSceneEntered", this);
        },
        
        onEnterTransitionDidFinish : function() {
            this._super();
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
        
        getTileFromCoord : function(posX, posY) {
            var scale = this.battleMap.scale;
            
            return handlerList.tileSelector.getTileFromCoord(
                this.battleMap.width * scale, 
                this.battleMap.height * scale,
                posX - this.battleMap.x * scale, 
                posY
            );
        },
        
        /**
         * get unit sprite via given position in the view.
         */
        getUnitTileInGlobal : function(posX, posY) {
            var tile = this.getTileFromCoord(posX, posY),
                _buf = buf;
            
            return _buf.unitMatrix[tile.x] && _buf.unitMatrix[tile.x][tile.y] && _buf.unitMatrix[tile.x][tile.y];
        },
        
        /**
         * get unit sprite via given position in the view.
         * this will only return ligle units for current player turn, attacker or defender.
         */
        getUnitTileInTurn : function(posX, posY) {
            var tile = this.getTileFromCoord(posX, posY),
                _buf = buf;
            
            // searching for the nearest unit from a given tile;
            // Focus to the defender;
            //~ tile = handlerList.tileSelector.filterTurnedTiles(this.isAttackerTurn, tile.x, tile.y);
            tile = util.getAvaliableTiles(this.isAttackerTurn(), tile.x, tile.y);
            
            return tile && _buf.unitMatrix[tile.x] && _buf.unitMatrix[tile.x][tile.y] && _buf.unitMatrix[tile.x][tile.y];
        },
        
        getFocusTag : function() {
            var _buf = buf,
                _coh = coh;
            // create the node if not exist.
            if (!_buf.focusTag) {
                _buf.focusTag = new _coh.cpns.Cursor();
                self.battleMap.addChild(_buf.focusTag, _coh.LocalConfig.Z_INDEX.BACKGROUND);
            }
            
            return _buf.focusTag;
        },
        
        /**
         * Highlight the hovered unit.
         */
        locateToUnit : function(unitTile){
            // if tag locked - for example focusing on some a unit - do nothing.
            !buf.focusTagLocked && this.getFocusTag().locateTo(unitTile.tileSprite, this.isAttackerTurn());
        },
        
        /**
         * Mark a unit to be deleted.
         */
        focusOnUnit : function(unitTile){
            
            buf.focusTagLocked = false;
            
            // sprite changes to the tag;
            this.locateToUnit(unitTile);
            this.getFocusTag().focusOn(unitTile.tileSprite, this.isAttackerTurn());
            
            // sprite changes to the unit itself
            unitTile.check();
            
            // buffer changes
            buf.focusTagLocked = true;
        },
        
        exileUnit : function(unitTile) {
            
            buf.focusTagLocked = false;
            
            // sprite changes to the tag;
            this.locateToUnit(unitTile);
            
            this.getFocusTag().exile(unitTile.tileSprite, this.isAttackerTurn());
            
            unitTile.exile(this.isAttackerTurn());
            
            // buffer changes
            buf.focusTagLocked = true;
        },
        
        cancelFocus : function() {
            buf.focusTagLocked = false;
        },
        
        removeUnit : function(unitTile, tile) {
            this.cancelFocus();
            this.getFocusTag().hide();
        },
        
        getLastUnitInColumn : function(isAttacker, unitTile, tile) {
            var _buf = buf,
                range = handlerList.tileSelector.getYRange(isAttacker),
                start = tile.y,
                deata = this.isAttackerTurn() ? 1 : -1,
                end = range[range.length - 1],
                y = start;
            
            while (y != end + deata) {
                if (_buf.unitMatrix[tile.x][y] && _buf.unitMatrix[tile.x][y] != _buf.unitMatrix[tile.x][tile.y]) {
                    continue;
                }
                y += deata;
            };
            
            return _buf.unitMatrix[tile.x][y];
        },
        
        isLastUnitInColumn : function(isAttacker, unitTile, tile) {
            return unitTile == this.getLastUnitInColumn(isAttacker, unitTile, tile);
        },
        
        setAttackerTurn : function(isAttacker) {
            
            if (buf.isAttackerTurn == isAttacker) return;
            
            var _coh = coh,
                tag = this.getFocusTag();
            
            buf.isAttackerTurn = isAttacker;
            
            tag.setBgColor(isAttacker ? _coh.LocalConfig.ATTACKER_FOCUS_COLOR : _coh.LocalConfig.DEFENDER_FOCUS_COLOR);
            tag.hide();
            
            isAttacker && _coh.utils.FilterUtil.applyFilters("attackerTurnStarted", this);
            !isAttacker && _coh.utils.FilterUtil.applyFilters("defenderTurnStarted", this);
        },
        
        isAttackerTurn : function() {
            return buf.isAttackerTurn;
        },
        
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
            var typeConfig = _coh.LocalConfig.LOCATION_TYPE[unit.getType()],
                unitTile = new _coh.UnitTile(unit, tileSprite, unitSprite);
            for (var rowCount = 0; rowCount < typeConfig[0]; ++rowCount) {
                for (var columnCount = 0; columnCount < typeConfig[1]; ++columnCount) {
                    _buf.unitMatrix[tilePosition.x + columnCount] = _buf.unitMatrix[tilePosition.x + columnCount] || {};
                    _buf.unitMatrix[tilePosition.x + columnCount][tilePosition.y - rowCount] = unitTile;
                }
            }
            
            tileSprite.attr({
                x : tile.x,
                y : tile.y,
                width: tile.width * typeConfig[1],
                height: tile.height * typeConfig[0]
                //~ width: tile.width,
                //~ height: tile.height
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
            
            //~ tileSprite.drawRect(new cc.Point(0,0), new cc.Point(tileSprite.width, tileSprite.height), new cc.Color(128,128,128,64), 4, new cc.Color(255,255,255));
            
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
            
            // XXXXXX For debug usage.
            _coh.unitList = _coh.unitList || [];
            _coh.unitList.push(unitTile);
            _coh.unitMatrix = _buf.unitMatrix;
        },
        
        removeUnit : function(unitTile, tile) {
            // XXXXXX
        }
    });
    
    // Sorry but I really did't mean to make it so ugly...
    // Just for private fields.
    var argList = [];
    for (var i = 0, arg; arg = arguments[i]; ++i) {
        argList.push("arguments[" + i + "]");
    }
    argList = argList.join(",");
    
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