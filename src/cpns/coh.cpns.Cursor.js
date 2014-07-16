/**
 * UI Components class, the highlight cursor when focusing on an unit.
 */
var coh = coh || {};
coh.cpns = coh.cpns || {};
coh.cpns.Cursor = cc.Node.extend({
    bgColor : new cc.Color(128,128,128,64),
    background : cc.DrawNode.create(),
    arrawRight : cc.Sprite.create(_coh.res.imgs.cornor),
    arrawLeft : cc.Sprite.create(_coh.res.imgs.cornor),
    arrawDirection : cc.Sprite.create(_coh.res.imgs.arrow),
    ctor : function(newColor) {
        this._super();
        this.arrawRight.attr({
            anchorX : 1,
            anchorY : 1,
            scale : 0.18
        });
        this.arrawLeft.attr({
            anchorX : 0,
            anchorY : 0,
            scale : 0.18,
            rotation : 180
        });
        this.arrawDirection.attr({
            scale : 0.5,
            rotation : 180
        });
        
        this.addChild(this.background);
        this.addChild(this.arrawRight);
        this.addChild(this.arrawLeft);
        this.addChild(this.arrawDirection);
        
        this.setBgColor(newColor);
    },
    
    /**
     * Move the cursor to the target location, with the same width/height.
     */
    focus : function(node) {
        
    },
    
    setBgColor : function(newColor) {
        if (newColor instanceof cc.Color) {
            bgColor = newColor;
        }
    }
});