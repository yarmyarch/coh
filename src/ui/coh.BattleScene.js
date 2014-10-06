/**
 *@require {Battle}: Utils for battle scene.
 *@require {MapUtil}: if you would like to place units to the battle ground;
 *  inject it from the outer factory.
 *
 * @impliments FilterUtil, can add and apply filters.
 * to many of them my friend. Just search for "applyFilters" to find all.
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
                [positionY] : [UnitBody],
                ... // other unit groups with the position x;
            },
            // other row data
        }
         */
        unitMatrix : {},
        // used for the battle util, records the status data group.
        statusMatrix : {},
        
        // Units that are ready to charge.
        phalanxList : [],
        
        focusTag : null,
        
        isAttackerTurn : true,
        
        // if the user is focusing on some a unit, the focusnode would be locked.
        // that means it won't react on any other locate events.
        focusTagLocked : false
    };

    var handlerList = {
        // private properties
        // should be injected from outside.
        mapUtil : null
    };
    
    // private functions
    var util = {
        /**
         * Rules: if it's out of X border, locate to the nearest column that's having an unit;
         * Otherwise, locate to the poingint column, and always try to find a unit that's closer to the front line.
         */
        getAvaliableTiles : function(isAttacker, tileX, tileY) {
            var _ts = handlerList.mapUtil,
                xRange = _ts.getXRange(),
                yRange = _ts.getYRange(isAttacker),
            
                overRight = tileX > xRange[xRange.length - 1],
                overLeft = tileX < xRange[0],
            
                overTop = isAttacker ? tileY < yRange[_ts.PUBLIC_ROW_COUNT] : tileY > yRange[_ts.PUBLIC_ROW_COUNT],
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
        
        getRealColumnTile : function(unitBody, columnTile) {
            var _ts = handlerList.mapUtil,
                typeConfig = unitBody.getTypeConfig(),
                isAttacker = unitBody.getPlayer().isAttacker(),
                yRange = _ts.getYRange(isAttacker),
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
                y : yRange[_ts.PUBLIC_ROW_COUNT] + (isAttacker ? 1 : -1) * (typeConfig[0] - 1)
            } : {
                x : targetTile.x, 
                y : targetTile.y + (isAttacker ? 1 : -1) * typeConfig[0]
            };
            
            return targetTile;
        },
        
        /**
         * When 1 unit removed, all other units behind it should be in movinging mode to the front line.
         * This function is used to find the directly affected units behind the given unit.
         * @param tileRecords should be parsed incase the given unitWarps isn't holding the tile infomation.
         */
        getMovingUnits : function(unitBodies, tileRecords) {
            
            var _buf = buf,
                tiles,
                columns,
                isAttacker,
                startY,
                i, j,
                tmpUnit,
                result = [];
            
            for (i = 0; unitBodies[i]; ++i) {
                tiles = tileRecords[i],
                columns = {},
                isAttacker = unitBodies[i].getPlayer().isAttacker(),
                startY = 0;
                
                for (j in tiles) {
                    columns[tiles[j].x] = tiles[j].x;
                    startY = startY && (isAttacker ? Math.max : Math.min)(startY, tiles[j].y) || tiles[j].y;
                }
                for (j in columns) {
                    tmpUnit = _buf.unitMatrix[columns[j]][startY  + (isAttacker ? 1 : -1)];
                    tmpUnit && result.push(tmpUnit);
                }
            }
            
            return result;
        },
        
        /**
         * Find the best tile for given unit in the battle field,
         * When in it's column it's the first blank tile count from the front line.
         *
         * @param [isBlankFukc] {Function({UnitBody})} optional. Function used to check if the tile should be treated as a "blank" tile.
         *  if not specificed, "blank" means no unit is at the found tile.
         *  return true if it's a "blank" tile for the comparation, that means when the unit is trying to move to the front line, it should pass through the tile checked.
         *
         * @return the distance from it's current column to the target tile. Always positive.
         */
        getValidDistance : function(unitBody, isBlankFukc) {
            var _ts = handlerList.mapUtil,
                _buf = buf,
                tiles = unitBody.getTileRecords(),
                isAttacker = unitBody.getPlayer().isAttacker(),
                yRange = _ts.getYRange(isAttacker),
                startY,
                deataY = isAttacker ? -1 : 1,
                endY = yRange[_ts.PUBLIC_ROW_COUNT],
                columns = {},
                y, i, distance = 0, 
                unitFound,
                checkIsBlank = checkIsBlank || function(unitBody) {
                    return !unitBody;
                };
            
            for (i in tiles) {
                columns[tiles[i].x] = tiles[i].x;
                startY = startY && (isAttacker ? Math.min : Math.max)(startY, tiles[i].y) || tiles[i].y;
            }
            
            if (isAttacker ? startY <= endY : startY >= endY) return 0;
            
            y = startY;
            // Magic again...
            do {
                y += deataY;
                unitFound = false;
                for (i in columns) {
                    if (!checkIsBlank(_buf.unitMatrix[columns[i]][y])) {
                        unitFound = true;
                        break;
                    } else {
                        unitFound = false;
                    }
                }
                if (!unitFound) {
                    distance -= deataY;
                } else {
                    break;
                }
            } while (y != endY);
            
            // return moved distance.
            return distance * deataY;
        },
        
        /**
         * try to reset the positoin of given units, make sure there would be no blank tiles in front of them.
         *@return distance moved.
         */
        moveToFrontLine : function(unitBody) {
            var _ts = handlerList.mapUtil,
                validTile = self.getValidTile(unitBody),
                distance = util.getValidDistance(unitBody),
                isAttacker = unitBody.getPlayer().isAttacker();
            
            if (distance) {
                self.setUnitToTile(unitBody, {x : validTile.x, y : validTile.y - (isAttacker ? 1 : -1) * distance});
            }
        },
        
        /**
         * withdraw a single unit back to rowCount tiles from the front line.
         * if it's running out of the border, kill the unit.
         * @return <bool> if the unit is still in the battle ground.
         */
        withdraw : function(unitBody, rowCount) {
            var _ts = handlerList.mapUtil,
                _buf = buf,
                isAttacker = unitBody.getPlayer().isAttacker(),
                yRange = _ts.getYRange(isAttacker),
                validTile = self.getValidTile(unitBody);
            
            // out of range, kill the unit.
            if (isAttacker ? validTile.y - rowCount > yRange[yRange.length - 1] : validTile.y - rowCount < yRange[yRange.length - 1]) {
                self.removeUnit(unitBody);
                return false;
            }
            
            self.setUnitToTile(unitBody, {x : validTile.x, y : validTile.y + rowCount * (isAttacker ? 1 : -1)});
            
            return true;
        },
        
        inPhalanx : function(phalanxHash, cType, unitBody) {
            var unitId = unitBody.getId(),
                phalanxes = phalanxHash[unitId];
            
            if (phalanxes && phalanxes.length) {
                // phalanx type won't be 0.
                for (var i = 0, pType; pType = phalanxes[i]; ++i) {
                    if (pType == cType) return true;
                }
            } 
            return false;
        },
        
        /**
         * @return the priority of a unitBody.
         * It's a value that contains the current mode/action of the affected unit.
         */
        getPriority : function(unitBody) {
            // set "ranged" as a skill, and use filters for the skill to fix the priority while queueing.
            var priority = unitBody.unit.getPriority(),
                _lc = coh.LocalConfig;
            
            // ranged ones would be handled when getPriority, within the filter getUnitPriority.
            priority = (unitBody.unit.getMode() + _lc.PRIORITIES.PHALANX) * _lc.PRIORITY_CHUNK + priority;
            
            return priority;
        },
        
        /**
         *@param convert convert object generated from coh.Battle that having data below:
            {
                column : column number,
                row : row number,
                converts : [<typeId>],
                isAttacker : <bool>
            }
         * For each phalanxes created, status of units within the phalanx should be updated,
         * while the updates would be applied to battleScene in setUnitToTile.
         */
        getPhalanx : function(convert) {
            var _buf = buf,
                _coh = coh,
                // right bottom tile of the convert
                rbTile = handlerList.mapUtil.getTilePosition(convert.isAttacker, _coh.LocalConfig.UNIT_TYPES.SOLDIER, convert.row, convert.column),
                convertMatrix,
                unitBodies,
                unitBody,
                halt = false,
                row, column,
                // used to check dulplicated phalanxes for a single unit.
                // indexed by unitid.
                phalanxHash = {},
                i,j,k;
            
            for (i = 0, cType; cType = convert.converts[i]; ++i) {
                convertMatrix = _coh.LocalConfig.CONVERT_MATRIX[cType];
                headUnit = null;
                halt = false;
                unitBodies = [];
                for (j = 0; row = convertMatrix[j]; ++j) {   
                    for (k = 0; column = row[k]; ++k) {
                        unitBody = _buf.unitMatrix[rbTile.x - column.length + j + 1][rbTile.y - row.length + k + 1];
                        
                        // if the unit is in another phalanx, create a copy of it for the new one.
                        if (util.inPhalanx(phalanxHash, cType, unitBody)) {
                            // cloned units won't be counted into the backup of the player.
                            unitBody = unitBody.clone();
                        }
                        
                        unitBodies.push(unitBody);
                        phalanxHash[unitBody.unit.getId()] = (phalanxHash[unitBody.unit.getId()] || []).concat(cType);
                    }
                }
                
                // create the phalanx object.
                
                // for walls, each unit is a single phalanx.
                if (cType == _coh.LocalConfig.CONVERT_TYPES.WALL) {
                    for (j = 0, unitBody; unitBody = unitBodies[j]; ++j) {
                        _buf.phalanxList.push(new _coh.Phalanx(cType, [unitBody]));
                    }
                } else {
                    _buf.phalanxList.push(new _coh.Phalanx(cType, unitBodies));
                }
                
                // XXXXXX To Be Continued.
                // phalanxes except for walls won't react to any mouse events.
                
                // queue phalanxes first, then
                // gather all convertedUnitBodies and make a queue for them.
            }
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
            
            // XXXXXX not it used here at the moment. Maybe filters related to the battle scene should be optimized in future.
            coh.utils.FilterUtil.activate(this);
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
        
        setMapUtil : function(selector) {
            handlerList.mapUtil = selector;
        },
        
        getTileInGlobal : function(posX, posY) {
            var scale = this.battleMap.scale;
            
            return handlerList.mapUtil.getTileFromCoord(
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
                range = handlerList.mapUtil.getYRange(isAttacker),
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
            return handlerList.mapUtil.isTileInGround(isAttacker, tile);
        },
        
        getPositionFromTile : function(tile) {
            return self.getMapTile(tile).getPosition();
        },
        
        getMapTile : function(tile) {
            return self.battleMap.getLayer(coh.LocalConfig.MAP_BATTLE_LAYER_NAME).getTileAt(tile);
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
        
        isLastUnitInColumn : function(isAttacker, unitBody, tile) {
            return unitBody == this.getLastUnitInColumn(isAttacker, unitBody, tile);
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
        locateToUnit : function(unitBody){
            
            // if tag locked - for example focusing on some a unit - do nothing.
            if (buf.focusTagLocked) return;
            
            var tag = this.getFocusTag(),
                isAttacker = unitBody.getPlayer().isAttacker(),
                _coh = coh;
            
            tag.locateTo(isAttacker, unitBody.tileSprite, isAttacker ? _coh.LocalConfig.ATTACKER_FOCUS_COLOR : _coh.LocalConfig.DEFENDER_FOCUS_COLOR);
            if (isAttacker != this.isAttackerTurn()) {
                tag.arrowDirection.setVisible(false);
            }
        },
        
        /**
         * Mark a unit to be deleted.
         */
        focusOnUnit : function(unitBody){
            
            if (!unitBody) return;
            buf.focusTagLocked = false;
            
            var tag = this.getFocusTag(),
                isAttacker = unitBody.getPlayer().isAttacker(),
                _coh = coh;
            
            // sprite changes to the tag;
            this.locateToUnit(unitBody);
            tag.focusOn(isAttacker, unitBody.tileSprite);
            
            // sprite changes to the unit itself
            unitBody.check();
            
            // buffer changes
            buf.focusTagLocked = true;
        },
        
        /**
         *@return if the unit could be exiled for a relocation.
         *  mainly for types that's occupying 2 columns.
         */
        exileUnit : function(unitBody) {
            
            if (!unitBody) return false;
            
            // do validate for types that's having more than 2 columns.
            var typeConfig = unitBody.getTypeConfig(),
                isAttacker = unitBody.getPlayer().isAttacker(),
                tiles = unitBody.getTileRecords(),
                lastUnit,
                _buf = buf;
            
            for (var i in tiles) {
                if (self.getLastUnitInColumn(isAttacker, tiles[i]) != unitBody) return false;
            }
            
            for (var i in tiles) {
                self.unbindUnitToTile(unitBody, tiles[i]);
            }
            
            buf.focusTagLocked = false;
            
            // sprite changes to the tag;
            this.locateToUnit(unitBody);
            
            this.getFocusTag().exile(unitBody.tileSprite, isAttacker);
            
            unitBody.exile(isAttacker);
            
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
        
        getDefaultDataGroup : function(isAttacker) {
            return handlerList.mapUtil.getDefaultDataGroup(isAttacker);
        },
        
        renderPlayer : function(player, matrix) {
            
            var _coh = coh,
                _buf = buf;
            
            // for animate purpose
            _buf.unitDelay = 0;
            for (var i = 0, row; row = matrix.succeed[i]; ++i) {
                for (var j = 0, status; (status = row[j]) != undefined; ++j) {
                    status && _coh.UnitFactory.getTypeFromStatus(status) && this.placeUnit(player, status, i, j);
                    _buf.unitDelay += _coh.LocalConfig.ASSAULT_DEATA;
                    if (!player.getNumOfUnplacedUnit()) return;
                }
            }
        },
        
        /**
         * mapUtil required. Should be injected from outside.
         * translate rowNum and colNum into tile and position to be placed.
         */
        placeUnit : function(player, status, rowNum, colNum) {
            
            // find correct unit from the player via given status(type defined);
            var _coh = coh,
                _buf = buf,
                scale = this.battleMap.scale,
                
                // color would be kept in the unit object.
                unit = player.getUnplacedUnit(status),
                unitBody = new _coh.UnitBody(unit),
                tileSprite = unitBody.tileSprite,
                
                // get tile and do the possible translation, for example for a type 2 defender unit.
                tilePosition = handlerList.mapUtil.getTilePosition(player.isAttacker(), _coh.UnitFactory.getTypeFromStatus(status), rowNum, colNum);
            
            // init unitBody
            unitBody.setPlayer(player);
            unitBody.setBattleScene(self);
            
            setTimeout(function() {
                self.battleMap.addChild(tileSprite, tilePosition.y);
                self.setUnitToTile(unitBody, tilePosition);
            }, _buf.unitDelay);
            
            // XXXXXX For debug usage.
            _coh.unitList = _coh.unitList || [];
            _coh.unitList.push(unitBody);
        },
        
        /**
         * @param tile the bottom left tile of the unit.
         * @param callback {Function} would be checked when the moving animate finished.
         */
        setUnitToTile : function(unitBody, tile, callback) {
            
            // find correct unit from the player via given status(type defined);
            var _coh = coh,
                _buf = buf,
                isAttacker = unitBody.getPlayer().isAttacker(),
                // get tile and do the possible translation, for example for a type 2 defender unit.
                mapTile = self.getMapTile(tile),
                unit = unitBody.unit,
                unitSprite = unitBody.unitSprite,
                tileSprite = unitBody.tileSprite,
                srcName = "img_" + (+unit.getColor() || 0),
                typeConfig = unitBody.getTypeConfig(),
                // if there exist tiles in the unitBody and having the same column number (x), move it directly here.
                // Mind type 4, whose x was modified while handling exiledTileFrom.
                originalY = self.getValidTile(unitBody);
            
            // prevent focus, no other mouse/touch actions during the moving;
            _buf.focusTagLocked = true;
            
            if (originalY) {
                originalY = self.getPositionFromTile({x : tile.x, y : originalY.y}).y;
            }
            self.unbindUnit(unitBody);
            
            // set unit matrix for further usage.
            // mind types that's not only having 1 tile.
            for (var rowCount = 0; rowCount < typeConfig[0]; ++rowCount) {
                for (var columnCount = 0; columnCount < typeConfig[1]; ++columnCount) {
                    _buf.unitMatrix[tile.x + columnCount] = _buf.unitMatrix[tile.x + columnCount] || {};
                    self.bindUnitToTile(unitBody, {x : tile.x + columnCount, y : tile.y - rowCount});
                }
            }
            
            tileSprite.attr({
                width: mapTile.width * typeConfig[1],
                height: mapTile.height * typeConfig[0]
            });
            tileSprite.attr({
                visible : true,
                x : mapTile.x,
                y : originalY || (isAttacker ? - tileSprite.height : tileSprite.height + self.battleMap.height),
                zIndex : tile.y
            });
            
            // Animations appended.
            unitSprite.runAction(cc.repeatForever(_coh.View.getAnimation(unit.getName(), "assult", srcName)));
            tileSprite.runAction(tileSprite.runningAction = cc.sequence(cc.moveTo(coh.LocalConfig.ASSAULT_RATE, mapTile.x, mapTile.y), cc.callFunc(function() {
                unitBody.unitSprite.runAction(cc.repeatForever(_coh.View.getAnimation(unit.getName(), "idle", srcName)));
                
                _coh.Util.isExecutable(callback) && callback();
                
                // restore focus tag.
                _buf.focusTagLocked = false;
            })));
        },
        
        bindUnitToTile : function(unitBody, tile) {
            var _buf = buf,
                type = unitBody.unit.getType(),
                playerId = unitBody.getPlayer().getId(),
                indexes = handlerList.mapUtil.getArrowIndex(unitBody.getPlayer().isAttacker(), type, tile.x, tile.y);
            
            _buf.unitMatrix[tile.x][tile.y] = unitBody;
            
            // It should be removed/updated when moved or removed.
            // That's why I didn't want to do this.
            unitBody.addTileRecord(tile);
            
            // modify the status matrix for the player
            !_buf.statusMatrix[playerId] && (_buf.statusMatrix[playerId] = []);
            !_buf.statusMatrix[playerId][indexes.row] && (_buf.statusMatrix[playerId][indexes.row] = []);
            _buf.statusMatrix[playerId][indexes.row][indexes.column] = unitBody.unit.getStatus();
        },
        
        unbindUnitToTile : function(unitBody, tile) {
            var _buf = buf,
                type = unitBody.unit.getType(),
                indexes = handlerList.mapUtil.getArrowIndex(unitBody.getPlayer().isAttacker(), type, tile.x, tile.y);
            
            _buf.unitMatrix[tile.x][tile.y] = null;
            delete buf.unitMatrix[tile.x][tile.y];
            unitBody.removeTileRecord(tile);
            
            _buf.statusMatrix[unitBody.getPlayer().getId()][indexes.row][indexes.column] = 0;
        },
        
        unbindUnit : function(unitBody) {
            var tiles = unitBody.getTileRecords();
            for (var i in tiles) {
                self.unbindUnitToTile(unitBody, tiles[i]);
            }
            unitBody.battleScene = null;
        },
        
        /**
         * @param columnTile the last tile of the column specificed by columnTile.y;
         * @param lastTile the tile where the mouse just moved from, it's also a tile that's having the last unit in that column.
         */
        prepareMoving : function(unitBody, columnTile, lastTile) {
            var _buf = buf,
                isAttacker = unitBody.getPlayer().isAttacker(),
                typeConfig = _coh.LocalConfig.LOCATION_TYPE[unitBody.unit.getType()],
                focusTag = self.getFocusTag(),
                // find the possible tile from direction 1,
                // while direction 1 is where the last tile comes from.
                targetTile = util.getRealColumnTile(
                    unitBody, {
                        x : lastTile.x > columnTile.x ? columnTile.x : columnTile.x + 1 - typeConfig[1],
                        y : columnTile.y
                    }),
                targetMapTile;
            
            if (!handlerList.mapUtil.isTileInGround(isAttacker, targetTile)) {
                // try to find it in another direction.
                targetTile = util.getRealColumnTile(
                    unitBody, {
                        x : lastTile.x < columnTile.x ? columnTile.x : columnTile.x + 1 - typeConfig[1],
                        y : columnTile.y
                    });
            }
            // faild finding a possible tile, do nothing.
            if (!handlerList.mapUtil.isTileInGround(isAttacker, targetTile)) {
                focusTag.arrowDirection.setVisible(false);
                return false;
            }
            
            targetTile = handlerList.mapUtil.transformUpdate(isAttacker, unitBody.unit.getType(), targetTile);
            
            targetMapTile = self.getMapTile(targetTile);
            
            focusTag.arrowDirection.attr({
                visible : true,
                rotation : isAttacker ? 0 : 180,
                x : unitBody.tileSprite.width / 2 - focusTag.x + targetMapTile.x
            });
            
            unitBody.unitSprite.attr({
                x : 0,
                y : 0
            });
            unitBody.tileSprite.attr({
                x : targetMapTile.x,
                y : targetMapTile.y,
                zIndex : targetTile.y
            });
            
            return targetTile;
        },
        
        // mind removeUnits - all affected units are gathered, sharing the same convert group.
        removeUnit : function(unitBody) {
            
            if (buf.focusTagLocked) return;
            
            this.cancelFocus();
            this.getFocusTag().hide();
            
            var _util = util,
                affectedUnits,
                // get the tileRecords before it's removed.
                tileRecords = unitBody.getTileRecords().concat();
            
            // XXXXXX Play the removing animate in target tile.
            coh.FilterUtil.applyFilters("unitRemoved", unitBody);

            self.battleMap.removeChild(unitBody.tileSprite, true);
            self.unbindUnit(unitBody);
            unitBody.getPlayer().killUnit(unitBody.unit);
            
            // return affected unit for further usage, such as queueUnits.
            return {
                unitBody : unitBody,
                tiles : tileRecords
            };
        },
        
        /**
         * Given units would try to array to the front line.
         * Mind that the units might have been removed already, so tileRecords for that unit is required.
         *@return all moved units.
         */
        queueUnits : function(unitBodies, tileRecords) {
            
            var movedUnits = unitBodies,
                affectedUnits,
                _util = util,
                result = [];
            
            for (var i = 0, unitBody; unitBody = movedUnits[i]; ++i) {
                // if it's still in the battle field, charge.
                if (unitBody.getTileRecords()) {
                    if (_util.moveToFrontLine(unitBody)) {
                        result.push(unitBody);
                    };
                }
            }
            
            while (movedUnits.length) {
                affectedUnits = util.getMovingUnits(movedUnits, tileRecords);
                movedUnits = [];
                tileRecords = [];
                for (var i in affectedUnits) {
                    // the unit isn't moved, so it won't have any effect on other units behind it.
                    tileRecords.push(affectedUnits[i].getTileRecords().concat());
                    if (_util.moveToFrontLine(affectedUnits[i])) {
                        movedUnits.push(affectedUnits[i]);
                        result.push(affectedUnits[i]);
                    } else {
                        tileRecords.pop();
                    }
                }
            };
            
            return result;
        },
        
        /**
         * Similar to queueUnits but it affectes all units within a phalanx.
         * Differently, given phalanxes would never have been removed, so no tileRecords required as a param.
         */
        queuePhalanxes : function(phalanxes) {
            var _util = util,
                _coh = coh,
                distance,
                targetTile,
                unitBody,
                priority,
                // If it's having other units or phalanxes in front of the current one, let's make a comparation.
                comparedPriority;
            
            // find the correct positions for the phalanxes, and then withdraw units if necessary.
            for (var i = 0, phalanx; phalanx = phalanxes[i]; ++i) {
                unitBody = phalanx.getLeadUnit();
                distance = _util.getValidDistance(unitBody, function(comparedUnit) {
                    return _util.getPriority(comparedUnit) < _util.getPriority(unitBody);
                });
                
                // The front-line rules about melee phalanxes should be handled outside into the filters,
                // Maybe somewhere else related to a skill set.
                distance = _coh.utils.FilterUtil.applyFilters("phalanxMovingDistance", distance, phalanx);
                // if no charge required for current phalanx, do nothing.
                if (!distance) continue;
                
                // if there exist a unit in target place, let's try withdraw for sevral tiles.
                // specially, if the unit belongs to enimy side, there would be something bad happen to that unlucky guy.
                // XXXXXX It's about the skill "melee", let's leave it later after a normal phalanx.
                
                
                // Function withdraw should receives another 1 params:
                //  shouldKill: if the unit run out of the border;
                // and return false if a withdraw fails when should not kill and a border must be reached.
                // In that case, the phalanx will have to choose it's action when trying to charge to the front line.
                // XXXXXX Here we go, the distance found. What then?
            }
        },
        
        /**
         * All units in the selected column will try to withdraw for <rowCount> tiles back.
         * If the row is having more units than the battle grould allowed, overflowed units would be killed.
         * Mind units that's having more than 1 tile.
         * @return all moved units that's still not removed.
         */
        withdraw : function(unitBodies, rowCount) {
            
            var movedUnits = unitBodies,
                affectedUnits,
                _util = util,
                tileRecords = [],
                result = [];
            
            for (var i = 0, unitBody; unitBody = movedUnits[i]; ++i) {
                // if it's still in the battle field, charge.
                if (unitBody.getTileRecords()) {
                    tileRecords.push(unitBody.getTileRecords().concat());
                    if (_util.withdraw(unitBody, rowCount)) {
                        result.push(unitBody);
                    };
                }
            }
            
            while (movedUnits.length) {
                affectedUnits = util.getMovingUnits(movedUnits, tileRecords);
                movedUnits = [];
                tileRecords = [];
                for (var i in affectedUnits) {
                    tileRecords.push(affectedUnits[i].getTileRecords().concat());
                    movedUnits.push(affectedUnits[i]);
                    
                    // if the unit is removed drew to a withdraw, it won't have an effect on new phalanxes that might generate.
                    if (_util.withdraw(affectedUnits[i], rowCount)) {
                        result.push(affectedUnits[i]);
                    }
                }
            };
            
            return result;
        },
        
        doConverts : function(unitBodies) {
            
            var _buf = buf,
                _coh = coh,
                _mu = handlerList.mapUtil,
                player,
                unitBody,
                tile,
                index,
                converts,
                allConverts = [];
            
            for (var i = 0; unitBody = unitBodies[i]; ++i) {
                // do nothing for types that's not 1.
                if (unitBody.unit.getType() != 1) continue;
                
                // Here we go!
                tile = unitBody.getTileRecords()[0];
                player = unitBody.getPlayer();
                index = _mu.getArrowIndex(
                    player.isAttacker(), 
                    unitBody.unit.getType(), 
                    tile.x, 
                    tile.y
                );
                converts = _coh.Battle.findAllPossibleConverts(_buf.statusMatrix[player.getId()], 
                    index.x, 
                    index.y, 
                    unitBody.unit.getColor()
                );
                
                for (var j in converts) {
                    converts[j].isAttacker = player.isAttacker();
                }
                
                allConverts = allConverts.concat(converts);
            }
                
            // Mind dulplicated converts for multy units.
            // No units could be joint into 2 converts that's having the same type, except for walls.
            for (var i = 0, convert; convert = allConverts[i]; ++i) {
                util.getPhalanx(allConverts[i]);
            }
        },
        
        // XXXXXX for debug usage currently.
        getStatusMatrix : function() {
            return buf.statusMatrix;
        },
        
        getValidTile : function(unitBody) {
            return handlerList.mapUtil.getValidTile(unitBody);
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