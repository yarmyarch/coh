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

coh.utils.UIController = (function() {
    
    var self;
    
    var buf;
    
    coh.utils.FilterUtil.addFilter("battleSceneEntered", function(battleScene) {
        
        var lastUnitSrite;
        if ('mouse' in cc.sys.capabilities)
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseMove: function(event){
                var location = event.getLocationInView(),
                    unitSprite = battleScene.getUnitData(!battleScene.isAttackerTurn, location.x, location.y);
                
                unitSprite && (unitSprite = unitSprite.unitSprite);
                
                if (unitSprite) {
                    lastUnitSrite && lastUnitSrite.setOpacity(1000);
                    unitSprite.setOpacity(100);
                    lastUnitSrite = unitSprite;
                    
                    // XXXXXX
                    // Locate To in BattleScene
                }
            }
        }, battleScene);
        
        return battleScene;
    });
    
    return self = {
        
    };
})();