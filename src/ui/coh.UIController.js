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

(function() {
    
    coh.utils.FilterUtil.addFilter("battleSceneEntered", function(battleScene) {
        
        var lastUnitSrite;
        if ('mouse' in cc.sys.capabilities)
    
        //~ onMouseDown: null,
        //~ onMouseUp: null,
        //~ onMouseMove: null,
        //~ onMouseScroll: null
        
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseMove: function(event){
                var location = event.getLocationInView(),
                    //~ unitSprite = battleScene.getUnitSprite(location.x, location.y);
                    unitSprite = battleScene.getUnitSprite(location.x, location.y).sprite;
                
                if (unitSprite) {
                    lastUnitSrite && lastUnitSrite.setOpacity(1000);
                    unitSprite.setOpacity(100);
                    lastUnitSrite = unitSprite;
                }
            }
        }, battleScene);
    });
    
})();