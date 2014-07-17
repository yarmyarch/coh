/**
 * UI Components class, the highlight cursor when focusing on an unit.
 */
var coh = coh || {};
coh.cpns = coh.cpns || {};
(function() {

// global static properties for the class Cursor.
var g_lc = {
    ATTACKER_FOCUS_COLOR : new cc.Color(55, 229, 170, 204),
    DEFENDER_FOCUS_COLOR : new cc.Color(200, 50, 120, 204),
    
    FOCUS_BLINK : cc.RepeatForever.create(cc.FadeTo.create(0.5, 153))
}

coh.cpns.Cursor = cc.Node.extend({
    bgColor : new cc.Color(128,128,128,64),
    background : null,
    arrowRight : null,
    arrowLeft : null,
    arrowDirection : null,
    ctor : function(newColor) {
        
        var _coh = coh;
        
        this._super();
        
        this.background = cc.DrawNode.create();        
        this.arrowRight = cc.Sprite.create(_coh.res.imgs.cornor);
        this.arrowLeft = cc.Sprite.create(_coh.res.imgs.cornor);
        this.arrowDirection = cc.Sprite.create(_coh.res.imgs.arrow);
        
        this.arrowRight.attr({
            anchorX : 1,
            anchorY : 1,
            scale : 0.18
        });
        this.arrowLeft.attr({
            anchorX : 1,
            anchorY : 1,
            scale : 0.18,
            rotation : 180
        });
        this.arrowDirection.attr({
            anchorY : 1,
            scale : 0.5,
            rotation : 180
        });
        
        this.addChild(this.background, _coh.LocalConfig.Z_INDEX.BACKGROUND);
        this.addChild(this.arrowRight, _coh.LocalConfig.Z_INDEX.CONTENT);
        this.addChild(this.arrowLeft, _coh.LocalConfig.Z_INDEX.CONTENT);
        this.addChild(this.arrowDirection, _coh.LocalConfig.Z_INDEX.CONTENT);
        
        this.setBgColor(newColor);
    },
    
    /**
     * Move the cursor to the target location, with the same width/height.
     * If you would like this cursor be at the same place as you might have expected,
     * Make sure the node parsed is at the same layer with the cursor.
     */
    locateTo : function(node, isAttacker) {
        
        this.x = node.x;
        this.y = node.y;
        this.anchorX = node.anchorX;
        this.anchorY = node.anchorY;
        this.width = node.width;
        this.height = node.height;
        
        this.arrowRight.x = node.width;
        this.arrowRight.y = node.height;
        
        this.arrowDirection.x = node.width / 2;
        this.arrowDirection.y = - node.y;
        
        this.background.clear();
        this.background.drawRect(new cc.Point(0,0), new cc.Point(this.width, this.height), isAttacker ? g_lc.ATTACKER_FOCUS_COLOR : g_lc.DEFENDER_FOCUS_COLOR);
        
        // create animation
        this.background.runAction(g_lc.FOCUS_BLINK);
    },
    
    focusOn : function(node) {
        // XXXXXX
    },
    
    setBgColor : function(newColor) {
        if (newColor instanceof cc.Color) {
            bgColor = newColor;
        }
    }
});

})();