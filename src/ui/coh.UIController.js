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
    
    var buf;
    
    coh.utils.FilterUtil.addFilter("battleSceneEntered", function(battleScene) {
        
        var lastUnitData, lastTile;
        if ('mouse' in cc.sys.capabilities)
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseMove: function(event){
                var location = event.getLocationInView(),
                    unitData = battleScene.getUnitDataInTurn(location.x, location.y);
                
                if (unitData) {
                    battleScene.locateToUnit(unitData.tileSprite);
                }
            },
            
            onMouseDown : function(event) {
                var location = event.getLocationInView(),
                    tile = battleScene.getTileFromCoord(location.x, location.y),
                    unitData = battleScene.getUnitDataInTurn(location.x, location.y);
                if (unitData) {
                    lastUnitData = unitData;
                    lastTile = tile;
                }
            },
            
            onMouseUp : function(event) {
                var location = event.getLocationInView(),
                    tile = battleScene.getTileFromCoord(location.x, location.y),
                    unitData = battleScene.getUnitDataInTurn(location.x, location.y),
                    clickedUnit = battleScene.getUnitDataInGlobal(location.x, location.y);
                if (unitData) {
                    // the same unit clicked: clickedUnit should be the same as the lastUnitData.
                    if (lastUnitData && unitData == lastUnitData && clickedUnit == unitData) {
                        coh.utils.FilterUtil.applyFilters("battleUnitClicked", unitData, tile);
                        return;
                    }
                    
                    if (lastTile && tile.x == lastTile.x && (battleScene.isAttackerTurn() ? tile.y > lastTile.y : tile.y < lastTile.y)) {
                        coh.utils.FilterUtil.applyFilters("battleUnitSlided", unitData, tile);
                        return;
                    }
                }
            }
            
        }, battleScene);
        
        return battleScene;
    });
    
    coh.utils.FilterUtil.addFilter("battleUnitClicked", function(unitData, tile) {
        console.log(tile);
    });
    
    coh.utils.FilterUtil.addFilter("battleUnitSlided", function(unitData, tile) {
        console.log(tile);
    });
    
    coh.utils.FilterUtil.addFilter("defenderTurnStarted", function(battleScene) {
        var tag = battleScene.getFocusTag();
        
        tag.setBgColor(coh.LocalConfig.DEFENDER_FOCUS_COLOR);
        tag.hide();
    });
    
    coh.utils.FilterUtil.addFilter("attackerTurnStarted", function(battleScene) {
        var tag = battleScene.getFocusTag();
        
        tag.setBgColor(coh.LocalConfig.ATTACKER_FOCUS_COLOR);
        tag.hide();
    });
    
    return self = {
        
    };
})();