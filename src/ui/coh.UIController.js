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
        // mark the last handled unitTile and tile, for click and slide events.
        lastUnitTile : null, 
        lastTile : null,
        
        // if a unit is checked twice, it would be removed from the scene.
        checkedUnit : null
    };
    
    coh.utils.FilterUtil.addFilter("battleSceneEntered", function(battleScene) {
        if ('mouse' in cc.sys.capabilities)
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseMove: function(event){
                var location = event.getLocationInView(),
                    unitTile = battleScene.getUnitTileInTurn(location.x, location.y);
                
                if (unitTile) {
                    battleScene.locateToUnit(unitTile);
                }
            },
            
            onMouseDown : function(event) {
                var location = event.getLocationInView(),
                    tile = battleScene.getTileFromCoord(location.x, location.y),
                    unitTile = battleScene.getUnitTileInTurn(location.x, location.y);
                if (unitTile) {
                    buf.lastUnitTile = unitTile;
                    buf.lastTile = tile;
                }
            },
            
            onMouseUp : function(event) {
                var location = event.getLocationInView(),
                    tile = battleScene.getTileFromCoord(location.x, location.y),
                    unitTile = battleScene.getUnitTileInTurn(location.x, location.y),
                    clickedUnit = battleScene.getUnitTileInGlobal(location.x, location.y),
                    lastUnitTile = buf.lastUnitTile,
                    lastTile = buf.lastTile;
                
                if (unitTile) {
                    // the same unit clicked: clickedUnit should be the same as the lastUnitTile.
                    if (lastUnitTile && unitTile == lastUnitTile && clickedUnit == unitTile) {
                        coh.utils.FilterUtil.applyFilters("battleUnitClicked", unitTile, tile, battleScene);
                        return;
                    }
                    
                    if (lastTile && tile.x == lastTile.x && (battleScene.isAttackerTurn() ? tile.y > lastTile.y : tile.y < lastTile.y)) {
                        coh.utils.FilterUtil.applyFilters("battleUnitSlided", unitTile, tile, battleScene);
                        return;
                    }
                    
                    // cancel focus in other cases.
                    battleScene.cancelFocus();
                }
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
            battleScene.focusOnUnit(unitTile.tileSprite);
            _buf.checkedUnit && _buf.checkedUnit.unCheck();
            _buf.checkedUnit = unitTile;
        }
        console.log(tile);
    });
    
    coh.utils.FilterUtil.addFilter("battleUnitSlided", function(unitTile, tile, battleScene) {
        console.log(tile);
    });
    
    coh.utils.FilterUtil.addFilter("defenderTurnStarted", function(battleScene) {
    });
    
    coh.utils.FilterUtil.addFilter("attackerTurnStarted", function(battleScene) {
    });
    
    return self = {
        
    };
})();