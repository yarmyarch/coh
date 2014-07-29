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
                [positionY] : [UnitWrap],
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
        
        getTileInGlobal : function(posX, posY) {
            var scale = this.battleMap.scale;
            
            return handlerList.tileSelector.getTileFromCoord(
                this.battleMap.width * scale, 
                this.battleMap.height * scale,
                posX - this.battleMap.x * scale, 
                posY
            );
        },
        
        getTileInTurn : function(posX, posY) {
            var tile = this.getTileInGlobal(posX, posY);
            
            // searching for the nearest unit from a given tile;
            return util.getAvaliableTiles(this.isAttackerTurn(), tile.x, tile.y);
        },
        
        /**
         * return the last tile that's having a unit occupied.
         */
        getLastTileInColumn : function(isAttacker, tile) {
            
            if (!buf.unitMatrix[tile.x]) return null;
            
            var _buf = buf,
                range = handlerList.tileSelector.getYRange(isAttacker),
                start = range[0],
                deata = this.isAttackerTurn() ? 1 : -1,
                end = range[range.length - 1],
                y = start,
                lastTileY = start;
            
            while (y != end + deata) {
                if (_buf.unitMatrix[tile.x] && _buf.unitMatrix[tile.x][y]) {
                    lastTileY = y;
                }
                y += deata;
            };
            
            return {x : tile.x, y : lastTileY};
        },
        
        /**
         * get unit sprite via given position in the view.
         */
        getUnitInGlobal : function(posX, posY) {
            var tile = this.getTileInGlobal(posX, posY),
                _buf = buf;
            
            return _buf.unitMatrix[tile.x] && _buf.unitMatrix[tile.x][tile.y];
        },
        
        /**
         * get unit sprite via given position in the view.
         * this will only return ligle units for current player turn, attacker or defender.
         */
        getUnitInTurn : function(posX, posY) {
            var tile = this.getTileInTurn(posX, posY),
                _buf = buf;
            
            return tile && _buf.unitMatrix[tile.x] && _buf.unitMatrix[tile.x][tile.y];
        },
        
        getLastUnitInColumn : function(isAttacker, tile) {
            var tile = this.getLastTileInColumn(isAttacker, tile),
                _buf = buf;
            
            return tile && _buf.unitMatrix[tile.x] && _buf.unitMatrix[tile.x][tile.y];
        },
        
        isLastUnitInColumn : function(isAttacker, unitWrap, tile) {
            return unitWrap == this.getLastUnitInColumn(isAttacker, unitWrap, tile);
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
        locateToUnit : function(unitWrap){
            // if tag locked - for example focusing on some a unit - do nothing.
            !buf.focusTagLocked && this.getFocusTag().locateTo(unitWrap.tileSprite, this.isAttackerTurn());
        },
        
        /**
         * Mark a unit to be deleted.
         */
        focusOnUnit : function(unitWrap){
            
            if (!unitWrap) return;
            buf.focusTagLocked = false;
            
            // sprite changes to the tag;
            this.locateToUnit(unitWrap);
            this.getFocusTag().focusOn(unitWrap.tileSprite, this.isAttackerTurn());
            
            // sprite changes to the unit itself
            unitWrap.check();
            
            // buffer changes
            buf.focusTagLocked = true;
        },
        
        exileUnit : function(unitWrap) {
            
            if (!unitWrap) return;
            buf.focusTagLocked = false;
            
            // sprite changes to the tag;
            this.locateToUnit(unitWrap);
            
            this.getFocusTag().exile(unitWrap.tileSprite, this.isAttackerTurn());
            
            unitWrap.exile(this.isAttackerTurn());
            
            // buffer changes
            buf.focusTagLocked = true;
        },
        
        cancelFocus : function() {
            var _buf = buf;
            _buf.focusTagLocked = false;
            
            // XXXXXX interestingly I can't hide it here, or the cursor flies.
            //~ this.getFocusTag().hide();
        },
        
        removeUnit : function(unitWrap, tile) {
            this.cancelFocus();
            this.getFocusTag().hide();
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
        
        renderPlayer : function(player, matrix) {
            
            var _coh = coh,
                _buf = buf;
            player.isAttacker() && this.setAttacker(player) || this.setDefender(player);
            
            // for animate purpose
            _buf.unitDelay = 0;
            for (var i = 0, row; row = matrix.succeed[i]; ++i) {
                for (var j = 0, status; (status = row[j]) != undefined; ++j) {
                    status && _coh.Battle.getTypeFromStatus(status) && this.placeUnit(player, status, i, j);
                    _buf.unitDelay += _coh.LocalConfig.ASSAULT_DEATA;
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
         * translate rowNum and colNum into tile and position to be placed.
         */
        placeUnit : function(player, status, rowNum, colNum) {
            
            // find correct unit from the player via given status(type defined);
            var _coh = coh,
                _buf = buf,
                scale = this.battleMap.scale,
                
                // color would be kept in the unit object.
                unit = player.getUnplacedUnit(status),
                unitSprite = _coh.View.getSprite(unit.getName(), "idle", {color : _coh.Battle.getColorFromStatus(status)}),
                tileSprite = cc.DrawNode.create(),
                unitWrap = new _coh.UnitWrap(unit, tileSprite, unitSprite),
                
                // get tile and do the possible translation, for example for a type 2 defender unit.
                tilePosition = handlerList.tileSelector.getTilePosition(player.isAttacker(), _coh.Battle.getTypeFromStatus(status), rowNum, colNum),
                shadow = cc.Sprite.create(_coh.res.imgs.shadow),
                typeConfig = _coh.LocalConfig.LOCATION_TYPE[unit.getType()];
            
            shadow.attr({
                x : 0,
                y : 0,
                anchorX: -0.05,
                anchorY: 0.3,
                scaleX : typeConfig[1] * 0.8,
                scaleY : 0.75,
                opacity:164
            });
            
            unitSprite.attr({
                x : 0,
                y : 0,
                scale : _coh.LocalConfig.SPRITE_SCALE[unit.getType()],
                anchorX: 0,
                anchorY: 0
            });
            
            // show it when set to tile.
            tileSprite.attr({
                visible : false
            });
            
            unitSprite.addChild(shadow, _coh.LocalConfig.Z_INDEX.BACKGROUND);
            tileSprite.addChild(unitSprite, _coh.LocalConfig.Z_INDEX.CONTENT);
            this.battleMap.addChild(tileSprite, tilePosition.y);
            
            setTimeout(function() {
                self.setUnitToTile(player.isAttacker(), unitWrap, tilePosition);
            }, _buf.unitDelay);
            
            // XXXXXX For debug usage.
            _coh.unitList = _coh.unitList || [];
            _coh.unitList.push(unitWrap);
        },
        
        setUnitToTile : function(isAttacker, unitWrap, tile) {
            
            // find correct unit from the player via given status(type defined);
            var _coh = coh,
                _buf = buf,
                // get tile and do the possible translation, for example for a type 2 defender unit.
                mapTile = this.battleMap.getLayer(_coh.LocalConfig.MAP_BATTLE_LAYER_NAME).getTileAt(tile),
                unit = unitWrap.unit,
                unitSprite = unitWrap.unitSprite,
                tileSprite = unitWrap.tileSprite,
                srcName ="img_" + (+unit.getColor() || 0);
            
            // set buffer
            // mind types that's not only having 1 tile.
            var typeConfig = _coh.LocalConfig.LOCATION_TYPE[unit.getType()];
            
            
            for (var rowCount = 0; rowCount < typeConfig[0]; ++rowCount) {
                for (var columnCount = 0; columnCount < typeConfig[1]; ++columnCount) {
                    _buf.unitMatrix[tile.x + columnCount] = _buf.unitMatrix[tile.x + columnCount] || {};
                    _buf.unitMatrix[tile.x + columnCount][tile.y - rowCount] = unitWrap;
                }
            }
            
            tileSprite.attr({
                width: mapTile.width * typeConfig[1],
                height: mapTile.height * typeConfig[0]
            });
            tileSprite.attr({
                visible : true,
                x : mapTile.x,
                y : !isAttacker ? - tileSprite.height : tileSprite.height + this.battleMap.height
            });
            
            // Animations appended.
            unitSprite.runAction(cc.repeatForever(_coh.View.getAnimation(unit.getName(), "assult", srcName)));
            tileSprite.runAction(tileSprite.runningAction = cc.sequence(cc.moveTo(coh.LocalConfig.ASSAULT_RATE, mapTile.x, mapTile.y), cc.callFunc(function() {
                unitWrap.unitSprite.runAction(cc.repeatForever(_coh.View.getAnimation(unit.getName(), "idle", srcName)));
            })));
        },
        
        prepareMoving : function(isAttacker, unitWrap, lastTile) {
            var targetTile = this.battleMap.getLayer(_coh.LocalConfig.MAP_BATTLE_LAYER_NAME).getTileAt(
                {x : lastTile.x, y : lastTile.y + (self.isAttackerTurn() ? 1 : -1)}
            );
            
            unitWrap.unitSprite.attr({
                x : 0,
                y : 0
            });
            unitWrap.tileSprite.attr({
                x : targetTile.x,
                y : targetTile.y
            });
        },
        
        removeUnit : function(unitWrap, tile) {
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