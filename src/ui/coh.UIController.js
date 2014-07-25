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
            // mark the last handled unitTile and tile, for click and slide events.
            lastUnitTile : null, 
            lastTile : null,
            
            // if a unit is checked twice, it would be removed from the scene.
            checkedUnit : null,
            exiledUnit : null
        },
        
        // exile/locate/default or other possible kinds of mouse actions in battleScene.
        // locate for the default.
        mouseAction : "locate"
    };
    
    var handlerList = {
        doFocus : function(event, battleScene) {
            
            var location = event.getLocationInView(),
                unitTile = battleScene.getUnitTileInTurn(location.x, location.y);
            
            if (unitTile) {
                battleScene.locateToUnit(unitTile);
            }
        },
        doCheckOrExile : function(event, battleScene) {
            var location = event.getLocationInView(),
                tile = battleScene.getTileFromCoord(location.x, location.y),
                unitTile = battleScene.getUnitTileInTurn(location.x, location.y),
                clickedUnit = battleScene.getUnitTileInGlobal(location.x, location.y),
                lastUnitTile = buf.battle.lastUnitTile,
                lastTile = buf.battle.lastTile;
            
            if (unitTile) {
                
                // the same unit clicked: clickedUnit should be the same as the lastUnitTile.
                if (lastUnitTile && unitTile == lastUnitTile && clickedUnit == unitTile) {
                    // if the last unit in the column is checked, then we treat it a slide.
                    if (battleScene.isLastUnitInColumn(battleScene.isAttackerTurn(), unitTile, tile)) {
                        _coh.utils.FilterUtil.applyFilters("battleUnitSlided", unitTile, tile, battleScene);
                    } else {
                        _coh.utils.FilterUtil.applyFilters("battleUnitClicked", unitTile, tile, battleScene);
                    }
                    return;
                }
                
                // slide from top to bottom of the battle field, or the last unit in the group clicked.
                if (lastTile && tile.x == lastTile.x && (battleScene.isAttackerTurn() ? tile.y > lastTile.y : tile.y < lastTile.y)) {
                    _coh.utils.FilterUtil.applyFilters("battleUnitSlided", unitTile, tile, battleScene);
                    return;
                }
                
                _coh.utils.FilterUtil.applyFilters("battleActionsCanceled", unitTile, tile, battleScene);
            }
        },
        doExileMove : function(event, battleScene) {
            
        },
        doUnExile : function(event, battleScene) {
            
            var _buf = buf;
            
            battleScene.cancelFocus();
            _buf.battle.exiledUnit.unExile(); 
            _buf.battle.exiledUnit = null;
            _buf.mouseAction = "locate";
        },
        recordTile : function(event, battleScene) {            
            var location = event.getLocationInView(),
                tile = battleScene.getTileFromCoord(location.x, location.y),
                unitTile = battleScene.getUnitTileInTurn(location.x, location.y);
            if (unitTile) {
                buf.battle.lastUnitTile = unitTile;
                buf.battle.lastTile = tile;
            }
        }
    };
    
    // Magic.
    var actionsConfig = {
        battle : {
            exile : {
                onMouseMove : handlerList.doExileMove,
                onMouseUp : handlerList.doUnExile
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
    
    _coh.utils.FilterUtil.addFilter("battleSceneEntered", function(battleScene) {
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
        
        return battleScene;
    });
    
    _coh.utils.FilterUtil.addFilter("battleUnitClicked", function(unitTile, tile, battleScene) {
        
        var _buf = buf;
        
        if (unitTile.isChecked()) {
            battleScene.removeUnit(unitTile, tile);
        } else {
            util.clearStatus(battleScene);
            battleScene.focusOnUnit(unitTile);
            
            _buf.battle.checkedUnit = unitTile;
        }
    });
    
    _coh.utils.FilterUtil.addFilter("battleUnitSlided", function(unitTile, tile, battleScene) {
        var exiledUnit = battleScene.getLastUnitInColumn(battleScene.isAttackerTurn(), unitTile, tile),
            _buf = buf;
        
        util.clearStatus(battleScene);
        
        // unExile would be executed in the doUnExile process.
        battleScene.exileUnit(exiledUnit);
        
        _buf.battle.exiledUnit = unitTile;
        
        _buf.mouseAction = "exile";
    });
    
    _coh.utils.FilterUtil.addFilter("battleActionsCanceled", function(unitTile, tile, battleScene) {
        util.clearStatus(battleScene);
    });
    
    _coh.utils.FilterUtil.addFilter("defenderTurnStarted", function(battleScene) {
    });
    
    _coh.utils.FilterUtil.addFilter("attackerTurnStarted", function(battleScene) {
    });
    
    return self = {
        
    };
})();