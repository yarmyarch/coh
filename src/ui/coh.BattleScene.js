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
        // used for the battle util, records the status data group.
        statusMatrix : {},
        
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
         * Otherwise, locate to the poingint column, and always try to find a unit that's closer to the front line.
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
            
                startY = overTop ? yRange[0] : overBottom ? yRange[yRange.length - 1] : tileY,
                endY = overTop ? yRange[yRange.length - 1] : yRange[0],
                deataY = overTop ? (isAttacker ? 1 : -1) : (isAttacker ? -1 : 1),
            
                _buf = buf,
                x = startX, y = startY;
            
            do {
                y = startY;
                do {
                    if (_buf.unitMatrix[x] && _buf.unitMatrix[x][y]) return {x : x, y : y};
                    y += deataY;
                } while (y != endY);
                x += deataX;
            } while (x != endX);
            
            // nothing matches found for given tile.
            return null;
        },
        
        getRealColumnTile : function(unitWrap, columnTile) {
            var typeConfig = unitWrap.getTypeConfig(),
                isAttacker = unitWrap.getPlayer().isAttacker(),
                yRange = handlerList.tileSelector.getYRange(isAttacker),
                // find the possible tile that can hold the unit.
                realColTile = columnTile,
                // target will use the given x and found y(in realColTile) for further calculating.
                targetTile;
            
            // check from left to right, for max to 4(type 4) possible tiles.
            for (var i = 0; i < typeConfig[1]; ++i) {
                targetTile = self.getLastTileInColumn(isAttacker, {x : columnTile.x + i, y : columnTile.y});
                if (targetTile && columnTile && (isAttacker ? (targetTile.y > realColTile.y) : (targetTile.y < realColTile.y))) {
                    realColTile = targetTile;
                }
            }
            targetTile = {
                x : columnTile.x,
                y : realColTile.y
            };
            
            targetTile = yRange[0] == targetTile.y ? {
                x : targetTile.x,
                y : yRange[2] + (isAttacker ? 1 : -1) * (typeConfig[0] - 1)
            } : {
                x : targetTile.x, 
                y : targetTile.y + (isAttacker ? 1 : -1) * typeConfig[0]
            };
            
            return targetTile;
        },
        
        /**
         * @param callback {Function} would be checked when the moving animate finished.
         */
        setUnitToTile : function(unitWrap, tile, callback) {
            
            // find correct unit from the player via given status(type defined);
            var _coh = coh,
                _buf = buf,
                isAttacker = unitWrap.getPlayer().isAttacker(),
                // get tile and do the possible translation, for example for a type 2 defender unit.
                mapTile = self.battleMap.getLayer(_coh.LocalConfig.MAP_BATTLE_LAYER_NAME).getTileAt(tile),
                unit = unitWrap.unit,
                unitSprite = unitWrap.unitSprite,
                tileSprite = unitWrap.tileSprite,
                srcName ="img_" + (+unit.getColor() || 0),
                typeConfig = unitWrap.getTypeConfig();
            
            // set unit matrix for further usage.
            // mind types that's not only having 1 tile.
            for (var rowCount = 0; rowCount < typeConfig[0]; ++rowCount) {
                for (var columnCount = 0; columnCount < typeConfig[1]; ++columnCount) {
                    _buf.unitMatrix[tile.x + columnCount] = _buf.unitMatrix[tile.x + columnCount] || {};
                    self.bindUnitToTile(unitWrap, {x : tile.x + columnCount, y : tile.y - rowCount});
                }
            }
            
            // XXXXXX if there exist tiles in the unitWrap and having the same column number (x), move it directly here.
            // Mind type 4, whose x was modified while handling exiledTileFrom.
            
            tileSprite.attr({
                width: mapTile.width * typeConfig[1],
                height: mapTile.height * typeConfig[0]
            });
            tileSprite.attr({
                visible : true,
                x : mapTile.x,
                y : isAttacker ? - tileSprite.height : tileSprite.height + self.battleMap.height,
                zIndex : tile.y
            });
            
            // Animations appended.
            unitSprite.runAction(cc.repeatForever(_coh.View.getAnimation(unit.getName(), "assult", srcName)));
            tileSprite.runAction(tileSprite.runningAction = cc.sequence(cc.moveTo(coh.LocalConfig.ASSAULT_RATE, mapTile.x, mapTile.y), cc.callFunc(function() {
                unitWrap.unitSprite.runAction(cc.repeatForever(_coh.View.getAnimation(unit.getName(), "idle", srcName)));
                _coh.Util.isExecutable(callback) && callback();
            })));
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
                    scale : winSize.width / sprite.width,
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
        
        getTileInTurn : function(isAttacker,  posX, posY) {
            var tile = this.getTileInGlobal(posX, posY);
            
            // searching for the nearest unit from a given tile;
            return util.getAvaliableTiles(isAttacker, tile.x, tile.y);
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
        
        isTileInGround : function(isAttacker, tile) {
            return handlerList.tileSelector.isTileInGround(isAttacker, tile);
        },
        
        getUnit : function(tile) {
            var _buf = buf;
            return tile && _buf.unitMatrix[tile.x] && _buf.unitMatrix[tile.x][tile.y];
        },
        
        /**
         * get unit sprite via given position in the view.
         */
        getUnitInGlobal : function(posX, posY) {
            return this.getUnit(this.getTileInGlobal(posX, posY));
        },
        
        /**
         * get unit sprite via given position in the view.
         * this will only return ligle units for current player turn, attacker or defender.
         */
        getUnitInTurn : function(isAttacker, posX, posY) {
            return this.getUnit(this.getTileInTurn(isAttacker, posX, posY));
        },
        
        getLastUnitInColumn : function(isAttacker, tile) {
            return this.getUnit(this.getLastTileInColumn(isAttacker, tile));
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
            if (buf.focusTagLocked) return;
            
            var tag = this.getFocusTag(),
                isAttacker = unitWrap.getPlayer().isAttacker(),
                _coh = coh;
            
            tag.locateTo(isAttacker, unitWrap.tileSprite, isAttacker ? _coh.LocalConfig.ATTACKER_FOCUS_COLOR : _coh.LocalConfig.DEFENDER_FOCUS_COLOR);
            if (isAttacker != this.isAttackerTurn()) {
                tag.arrowDirection.setVisible(false);
            }
        },
        
        /**
         * Mark a unit to be deleted.
         */
        focusOnUnit : function(unitWrap){
            
            if (!unitWrap) return;
            buf.focusTagLocked = false;
            
            var tag = this.getFocusTag(),
                isAttacker = unitWrap.getPlayer().isAttacker(),
                _coh = coh;
            
            // sprite changes to the tag;
            this.locateToUnit(unitWrap);
            tag.focusOn(isAttacker, unitWrap.tileSprite);
            
            // sprite changes to the unit itself
            unitWrap.check();
            
            // buffer changes
            buf.focusTagLocked = true;
        },
        
        /**
         *@return if the unit could be exiled for a relocation.
         *  mainly for types that's occupying 2 columns.
         */
        exileUnit : function(unitWrap) {
            
            if (!unitWrap) return false;
            
            // do validate for types that's having more than 2 columns.
            var typeConfig = unitWrap.getTypeConfig(),
                isAttacker = unitWrap.getPlayer().isAttacker(),
                tiles = unitWrap.getTileRecords(),
                lastUnit,
                _buf = buf;
            
            for (var i in tiles) {
                if (self.getLastUnitInColumn(isAttacker, tiles[i]) != unitWrap) return false;
            }
            
            for (var i in tiles) {
                self.unbindUnitToTile(unitWrap, tiles[i]);
            }
            
            buf.focusTagLocked = false;
            
            // sprite changes to the tag;
            this.locateToUnit(unitWrap);
            
            this.getFocusTag().exile(unitWrap.tileSprite, isAttacker);
            
            unitWrap.exile(isAttacker);
            
            // buffer changes
            buf.focusTagLocked = true;
            
            return true;
        },
        
        cancelFocus : function() {
            var _buf = buf;
            _buf.focusTagLocked = false;
            
            // interestingly I can't hide it here, or the cursor fails.
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
                    if (!player.getNumOfUnplacedUnit()) return;
                }
            }
        },
        
        getDefaultDataGroup : function(isAttacker) {
            return handlerList.tileSelector.getDefaultDataGroup(isAttacker);
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
                tilePosition = handlerList.tileSelector.getTilePosition(player.isAttacker(), _coh.Battle.getTypeFromStatus(status), rowNum, colNum);
            
            // init unitWrap
            unitWrap.setPlayer(player);
            
            setTimeout(function() {
                self.battleMap.addChild(tileSprite, tilePosition.y);
                util.setUnitToTile(unitWrap, tilePosition);
            }, _buf.unitDelay);
            
            // XXXXXX For debug usage.
            _coh.unitList = _coh.unitList || [];
            _coh.unitList.push(unitWrap);
        },
        
        setUnitToTile : function(unitWrap, tile, callback) {
            tile = handlerList.tileSelector.transformUpdate(unitWrap.getPlayer().isAttacker(), unitWrap.unit.getType(), tile);
            util.setUnitToTile(unitWrap, tile, callback);
        },
        
        bindUnitToTile : function(unitWrap, tile) {
            var _buf = buf,
                type = unitWrap.unit.getType(),
                playerId = unitWrap.getPlayer().getId(),
                indexes = handlerList.tileSelector.getArrowIndex(unitWrap.getPlayer().isAttacker(), type, tile.x, tile.y);
            
            _buf.unitMatrix[tile.x][tile.y] = unitWrap;
            
            // It should be removed/updated when moved or removed.
            // That's why I didn't want to do this.
            unitWrap.addTileRecord(tile);
            
            // modify the status matrix for the player
            !_buf.statusMatrix[playerId] && (_buf.statusMatrix[playerId] = []);
            !_buf.statusMatrix[playerId][indexes.row] && (_buf.statusMatrix[playerId][indexes.row] = []);
            _buf.statusMatrix[playerId][indexes.row][indexes.column] = coh.Battle.getStatus(type, unitWrap.unit.getColor());
        },
        
        unbindUnitToTile : function(unitWrap, tile) {
            buf.unitMatrix[tile.x][tile.y] = null;
            delete buf.unitMatrix[tile.x][tile.y];
            unitWrap.removeTileRecord(tile);
            
            var indexes = handlerList.tileSelector.getArrowIndex(unitWrap.getPlayer().isAttacker(), type, tile.x, tile.y);
            _buf.statusMatrix[unitWrap.getPlayer().getId()][indexes.row][indexes.column] = 0;
        },
        
        unbindUnit : function(unitWrap) {
            var tiles = unitWrap.getTileRecords();
            for (var i in tiles) {
                self.unbindUnitToTile(unitWrap, tiles[i]);
            }
        },
        
        /**
         * @param columnTile the last tile of the column specificed by columnTile.y;
         * @param lastTile the tile where the mouse just moved from, it's also a tile that's having the last unit in that column.
         */
        prepareMoving : function(unitWrap, columnTile, lastTile) {
            var _buf = buf,
                isAttacker = unitWrap.getPlayer().isAttacker(),
                typeConfig = _coh.LocalConfig.LOCATION_TYPE[unitWrap.unit.getType()],
                focusTag = self.getFocusTag(),
                // find the possible tile from direction 1,
                // while direction 1 is where the last tile comes from.
                targetTile = util.getRealColumnTile(
                    unitWrap, {
                        x : lastTile.x > columnTile.x ? columnTile.x : columnTile.x + 1 - typeConfig[1],
                        y : columnTile.y
                    }),
                targetMapTile;
            
            if (!handlerList.tileSelector.isTileInGround(isAttacker, targetTile)) {
                // try to find it in another direction.
                targetTile = util.getRealColumnTile(
                    unitWrap, {
                        x : lastTile.x < columnTile.x ? columnTile.x : columnTile.x + 1 - typeConfig[1],
                        y : columnTile.y
                    });
            }
            // faild finding a possible tile, do nothing.
            if (!handlerList.tileSelector.isTileInGround(isAttacker, targetTile)) {
                focusTag.arrowDirection.setVisible(false);
                return false;
            }
            
            targetTile = handlerList.tileSelector.transformUpdate(isAttacker, unitWrap.unit.getType(), targetTile);
            
            targetMapTile = this.battleMap.getLayer(_coh.LocalConfig.MAP_BATTLE_LAYER_NAME).getTileAt(targetTile);
            
            focusTag.arrowDirection.attr({
                visible : true,
                rotation : isAttacker ? 0 : 180,
                x : unitWrap.tileSprite.width / 2 - focusTag.x + targetMapTile.x
            });
            
            unitWrap.unitSprite.attr({
                x : 0,
                y : 0
            });
            unitWrap.tileSprite.attr({
                x : targetMapTile.x,
                y : targetMapTile.y,
                zIndex : targetTile.y
            });
            
            return true;
        },
        
        removeUnit : function(unitWrap, tile) {
            this.cancelFocus();
            this.getFocusTag().hide();
            
            self.battleMap.removeChild(unitWrap.tileSprite, true);
            self.unbindUnit(unitWrap);
            // XXXXXX do the relocation here.
            // Play the removing animate in target tile.
        },
        
        getStatusMatrix : function() {
            return buf.statusMatrix;
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
};