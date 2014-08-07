/**
 * Do events and filters binding.
 */

/*

if ('mouse' in cc.sys.capabilities)
    
    //~ onMouseDown: null,
    //~ onMouseUp: null,
    //~ onMouseMove: null,
    //~ onMouseScroll: null
    
    //
    cc.eventManager.addListener({
        event: cc.EventListener.MOUSE,
        onMouseMove: function(event){
            if(event.getButton() != undefined) ;
        }
    }, this);

if (cc.sys.capabilities.hasOwnProperty('touches')){
    cc.eventManager.addListener({
        
        //~ swallowTouches: false,
        //~ onTouchBegan: null,
        //~ onTouchMoved: null,
        //~ onTouchEnded: null,
        //~ onTouchCancelled: null,
        
        //
        
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchesMoved:function (touches, event) {
            
        }
    }, this);
}
*/

coh.UIController = (function() {
    
    var self,
        _coh = coh;
    
    var buf = {
        battle : {            
            // mark the last handled unitWrap and tile, for click and slide events.
            lastUnitWrap : null, 
            lastTile : null,
            
            // if a unit is checked twice, it would be removed from the scene.
            checkedUnit : null,
            exiledUnit : null,
            
            exiledTileFrom : null,
            exiledTileTo : null
        },
        
        // exile/locate/default or other possible kinds of mouse actions in battleScene.
        // locate for the default.
        mouseAction : "locate"
    };
    
    var handlerList = {
        doFocus : function(event, battleScene) {
            
            var location = event.getLocationInView(),
                unitGlobal = battleScene.getUnitInGlobal(location.x, location.y),
                tile = battleScene.getTileInTurn(
                    unitGlobal ? unitGlobal.getPlayer().isAttacker() : battleScene.isAttackerTurn(), 
                    location.x, 
                    location.y
                ),
                unitWrap = battleScene.getUnit(tile);
            
            if (unitWrap) {
                battleScene.locateToUnit(unitWrap);
                _coh.utils.FilterUtil.applyFilters("battleUnitsLocated", unitWrap, tile, battleScene);
            }
        },
        
        doCheckOrExile : function(event, battleScene) {
            var location = event.getLocationInView(),
                tile = battleScene.getTileInGlobal(location.x, location.y),
                // only units in its side could be clicked or exiled.
                unitWrap = battleScene.getUnitInTurn(battleScene.isAttackerTurn(), location.x, location.y),
                clickedUnit = battleScene.getUnitInGlobal(location.x, location.y),
                lastUnitWrap = buf.battle.lastUnitWrap,
                lastTile = buf.battle.lastTile;
            
            // the same unit clicked: clickedUnit should be the same as the lastUnitWrap.
            if (lastUnitWrap && unitWrap == lastUnitWrap && clickedUnit == unitWrap) {
                _coh.utils.FilterUtil.applyFilters("battleUnitClicked", unitWrap, tile, battleScene);
                return;
            }
            
            // slide from top to bottom of the battle field, or the last unit in the group clicked.
            if (lastTile && tile.x == lastTile.x && (battleScene.isAttackerTurn() ? tile.y > lastTile.y : tile.y < lastTile.y)) {
                _coh.utils.FilterUtil.applyFilters("battleUnitExiled", clickedUnit && tile || lastTile, battleScene);
                return;
            }
            
            _coh.utils.FilterUtil.applyFilters("battleActionsCanceled", unitWrap, tile, battleScene);
        },
        
        doExileMove : function(event, battleScene) {
            var location = event.getLocationInView(),
                globalTile = battleScene.getTileInGlobal(location.x, location.y),
                columnTile = battleScene.getLastTileInColumn(battleScene.isAttackerTurn(), globalTile),
                _buf = buf,
                lastTile = _buf.battle.exiledTileTo || _buf.battle.lastTile,
                targetTile;
            
            if (!columnTile || !_buf.battle.exiledUnit || lastTile.x == columnTile.x) {
                return;
            }
            
            targetTile = battleScene.prepareMoving(_buf.battle.exiledUnit, columnTile, _buf.battle.exiledTileTo || _buf.battle.exiledTileFrom);
            targetTile && (_buf.battle.exiledTileTo = targetTile);
        },
        
        doUnExile : function(event, battleScene) {
            
            var _buf = buf,
                location = event.getLocationInView(),
                globalTile = battleScene.getTileInGlobal(location.x, location.y),
                exiledUnit = _buf.battle.exiledUnit;
            
            exiledUnit && exiledUnit.unExile(); 
            
            // There should be a target tile found, 
            // further more, the target tile should be within the battle field,
            // to make sure the user could cancel the exile with a slide out of the ground.
            
            // Check the range of 
            if (
                _buf.battle.exiledTileTo 
                && _buf.battle.exiledTileTo.x != _buf.battle.exiledTileFrom.x 
                && battleScene.isTileInGround(battleScene.isAttackerTurn(), globalTile)) {
                
                battleScene.setUnitToTile(exiledUnit, _buf.battle.exiledTileTo, function() {
                    // If type 1 - normal solders, then there might be converts generated.
                    // Let's find and make it directly.
                    if (exiledUnit.unit.getType() == 1)
                    battleScene.tryConvert(exiledUnit);
                });
            } else {
                battleScene.setUnitToTile(exiledUnit, _buf.battle.exiledTileFrom);
            }
            
            _buf.battle.exiledUnit = null;
            _buf.mouseAction = "locate";
        },
        
        recordTile : function(event, battleScene) {            
            var location = event.getLocationInView(),
                tile = battleScene.getTileInGlobal(location.x, location.y),
                unitWrap = battleScene.getUnitInTurn(battleScene.isAttackerTurn(), location.x, location.y);

            buf.battle.lastUnitWrap = unitWrap;
            buf.battle.lastTile = tile;
        }
    };
    
    // Magic.
    var actionsConfig = {
        battle : {
            exile : {
                onMouseMove : handlerList.doExileMove,
                onMouseUp : handlerList.doUnExile,
                onMouseDown : function(event, battleScene) {
                    handlerList.recordTile(event, battleScene);
                    handlerList.doExileMove(event, battleScene);
                }
            },
            locate : {
                onMouseMove : handlerList.doFocus,
                onMouseUp : handlerList.doCheckOrExile
            },
            onDefault : {
                onMouseDown : handlerList.recordTile
            }
        }
    };
    
    var util = {
        clearStatus : function(battleScene) {
            
            var _buf = buf;
            
            // cancel focus in other cases.
            battleScene.cancelFocus();
            
            // cancel checked units incase of checked.
            _buf.battle.checkedUnit && _buf.battle.checkedUnit.unCheck();
            _buf.battle.checkedUnit  = null;
            
            _buf.battle.exiledUnit && _buf.battle.exiledUnit.unExile(); 
            _buf.battle.exiledUnit = null;
        }
    };
    
    _coh.utils.FilterUtil.addFilter("battleUnitsReady", function(battleScene) {
        if ('mouse' in cc.sys.capabilities)
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseMove : function(event){
                (actionsConfig.battle[buf.mouseAction].onMouseMove || actionsConfig.battle.onDefault.onMouseMove)(event, battleScene);
            },
            
            onMouseDown : function(event) {
                (actionsConfig.battle[buf.mouseAction].onMouseDown || actionsConfig.battle.onDefault.onMouseDown)(event, battleScene);
            },
            
            onMouseUp : function(event) {
                (actionsConfig.battle[buf.mouseAction].onMouseUp || actionsConfig.battle.onDefault.onMouseUp)(event, battleScene);
            }
            
        }, battleScene);
    });
    
    _coh.utils.FilterUtil.addFilter("battleUnitClicked", function(unitWrap, tile, battleScene) {
        
        var _buf = buf;
        
        if (_buf.battle.checkedUnit == unitWrap) {
            util.clearStatus(battleScene);
            battleScene.removeUnit(unitWrap, tile);
        } else {
            util.clearStatus(battleScene);
            battleScene.focusOnUnit(unitWrap);
            
            _buf.battle.checkedUnit = unitWrap;
        }
    });
    
    _coh.utils.FilterUtil.addFilter("battleUnitExiled", function(tile, battleScene) {
        var isAttacker = battleScene.isAttackerTurn(),
            exiledTileFrom = battleScene.getLastTileInColumn(isAttacker, tile),
            exiledUnit = battleScene.getUnit(exiledTileFrom),
            _buf = buf,
            unitTiles = exiledUnit && exiledUnit.getTileRecords();
        
        util.clearStatus(battleScene);
        
        // the original tile should be modified for type that's not 1, to prevent the wrong position restored while canceling.
        // when set to map, the target tile should be the left bottom tile of the unit.
        for (var i in unitTiles) {
            if (exiledTileFrom.x >= unitTiles[i].x) exiledTileFrom.x = unitTiles[i].x;
            if (exiledTileFrom.y <= unitTiles[i].y) exiledTileFrom.y = unitTiles[i].y;
        }
        
        // unExile would be executed in the doUnExile process.
        if (battleScene.exileUnit(exiledUnit)) {            
            _buf.battle.exiledUnit = exiledUnit;
            _buf.battle.exiledTileFrom = exiledTileFrom;
            _buf.battle.exiledTileTo = null;
            
            _buf.mouseAction = "exile";
        }
    });
    
    _coh.utils.FilterUtil.addFilter("battleActionsCanceled", function(unitWrap, tile, battleScene) {
        util.clearStatus(battleScene);
    });
    
    _coh.utils.FilterUtil.addFilter("defenderTurnStarted", function(battleScene) {
    });
    
    _coh.utils.FilterUtil.addFilter("attackerTurnStarted", function(battleScene) {
    });
    
    return self = {
        
    };
})();