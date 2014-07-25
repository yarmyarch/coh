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
    
    var self;
    
    var buf = {
        battle = {            
            // mark the last handled unitTile and tile, for click and slide events.
            lastUnitTile : null, 
            lastTile : null,
            
            // if a unit is checked twice, it would be removed from the scene.
            checkedUnit : null,
            exiledUnit : null
        }
        
        // exile/locate/default or other possible kinds of mouse actions in battleScene.
        // locate for the default.
        mouseAction : "locate"
    };
    
    var handlerList = {
        doFocus : function(event) {
            
            var location = event.getLocationInView(),
                unitTile = battleScene.getUnitTileInTurn(location.x, location.y);
            
            if (unitTile) {
                battleScene.locateToUnit(unitTile);
            }
        },
        doCheckOrExile : function(event) {
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
                        coh.utils.FilterUtil.applyFilters("battleUnitSlided", unitTile, tile, battleScene);
                    } else {
                        coh.utils.FilterUtil.applyFilters("battleUnitClicked", unitTile, tile, battleScene);
                    }
                    return;
                }
                
                // slide from top to bottom of the battle field, or the last unit in the group clicked.
                if (lastTile && tile.x == lastTile.x && (battleScene.isAttackerTurn() ? tile.y > lastTile.y : tile.y < lastTile.y)) {
                    coh.utils.FilterUtil.applyFilters("battleUnitSlided", unitTile, tile, battleScene);
                    return;
                }
                
                coh.utils.FilterUtil.applyFilters("battleActionsCanceled", unitTile, tile, battleScene);
            }
        },
        doExileMove : function(event) {
            
        },
        doUnExile : function(event) {
            
            buf.battle.exiledUnit = null;
            buf.mouseAction = "locate";
        },
        recordTile : function(event) {
            
        }
    };
    
    // Magic.
    var actionsConfig = {
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
    
    coh.utils.FilterUtil.addFilter("battleSceneEntered", function(battleScene) {
        if ('mouse' in cc.sys.capabilities)
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseMove : function(event){
                (actionsConfig[buf.mouseAction].onMouseMove || actionsConfig.onDefault.onMouseMove)(event);
            },
            
            onMouseDown : function(event) {
                (actionsConfig[buf.mouseAction].onMouseDown || actionsConfig.onDefault.onMouseDown)(event);
            },
            
            onMouseUp : function(event) {
                (actionsConfig[buf.mouseAction].onMouseUp || actionsConfig.onDefault.onMouseUp)(event);
            }
            
        }, battleScene);
        
        return battleScene;
    });
    
    coh.utils.FilterUtil.addFilter("battleUnitClicked", function(unitTile, tile, battleScene) {
        
        var _buf = buf;
        
        if (unitTile.isChecked()) {
            battleScene.removeUnit(unitTile, tile);
        } else {
            // focusOnUnit including unitTile.check();
            battleScene.focusOnUnit(unitTile);
            _buf.battle.checkedUnit = unitTile;
        }
    });
    
    coh.utils.FilterUtil.addFilter("battleUnitSlided", function(unitTile, tile, battleScene) {
        var exiledUnit = battleScene.getLastUnitInColumn(battleScene.isAttackerTurn(), unitTile, tile);
        
        battleScene.exile(exiledUnit);
        
        buf.battle.exiledUnit = exiledUnit;
        
        buf.mouseAction = "exile";
    });
    
    coh.utils.FilterUtil.addFilter("battleActionsCanceled", function(unitTile, tile, battleScene) {
        var _buf = buf;
        
        // cancel focus in other cases.
        battleScene.cancelFocus();
        
        // cancel checked units incase of checked.
        _buf.battle.checkedUnit && _buf.battle.checkedUnit.unCheck();
        _buf.battle.checkedUnit  = null;
        
        _buf.battle.exiledUnit && _buf.battle.exiledUnit.unExile(); 
        _buf.battle.exiledUnit = null;
    });
    
    coh.utils.FilterUtil.addFilter("defenderTurnStarted", function(battleScene) {
    });
    
    coh.utils.FilterUtil.addFilter("attackerTurnStarted", function(battleScene) {
    });
    
    return self = {
        
    };
})();