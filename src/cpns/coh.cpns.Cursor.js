/**
 * UI Components class, the highlight cursor when focusing on an unit.
 */
var coh = coh || {};
coh.cpns = coh.cpns || {};
coh.cpns.Cursor = cc.Node.extend({
    bgColor : new cc.Color(128,128,128,64),
    background : null,
    arrowRight : null,
    arrowLeft : null,
    arrowDirection : null,
    ctor : function(newColor) {
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
            anchorX : 0,
            anchorY : 0,
            scale : 0.18,
            rotation : 180
        });
        this.arrowDirection.attr({
            scale : 0.5,
            rotation : 180
        });
        
        this.addChild(this.background);
        this.addChild(this.arrowRight);
        this.addChild(this.arrowLeft);
        this.addChild(this.arrowDirection);
        
        // create animation
        
        this.setBgColor(newColor);
    },
    
    /**
     * Move the cursor to the target location, with the same width/height.
     * If you would like this cursor be at the same place as you might have expected,
     * Make sure the node parsed is at the same layer with the cursor.
     */
    focusTo : function(node) {
        
        this.x = node.x;
        this.y = node.y;
        this.anchorX = node.anchorX;
        this.anchorY = node.anchorY;
        this.width = node.width;
        this.height = node.height;
        
        this.arrowRight.x = node.width;
        this.arrowRight.y = node.height;
        this.arrowDirection.y = this.arrowDirection.height - node.y - node.height;
        
        this.background.clear();
        this.background.drawRect(new cc.Point(0,0), new cc.Point(this.width, this.height), new cc.Color(255,255,0,164));
    },
    
    setBgColor : function(newColor) {
        if (newColor instanceof cc.Color) {
            bgColor = newColor;
        }
    }
});