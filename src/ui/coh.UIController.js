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
        
        if ('mouse' in cc.sys.capabilities)
    
        //~ onMouseDown: null,
        //~ onMouseUp: null,
        //~ onMouseMove: null,
        //~ onMouseScroll: null
        
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseMove: function(event){
                var location = event.getLocation(),
                    unitSprite = battleScene.getUnitSprite(location.x, location.y);
                
            }
        }, battleScene);
    });
    
})();