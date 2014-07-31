/**
 * UI Components class, the highlight cursor when focusing on an unit.
 */
var coh = coh || {};
coh.cpns = coh.cpns || {};
(function() {

// global static properties for the class Cursor.
var g_lc = {
    CORNOR_SCALE : 0.18,
    DIRECT_SCALE : 0.5,
    FOCUS_BLINK : cc.repeatForever(cc.sequence(cc.fadeTo(0.618, 64), cc.fadeTo(0.618, 204)))
};

var g_buf = {
    movebyList : {}
};

var g_util = {
    getMoveBy : function(width, height, xRate, yRate) {
        var id = [].join.call(arguments, "_"),
            moveBy = g_buf.movebyList[id],
            _coh = coh;
        
        if (!moveBy) {
            
            moveBy = cc.repeatForever(cc.sequence(
                cc.moveBy(coh.LocalConfig.BLINK_RATE, cc.p(width * xRate, height * yRate)),
                cc.moveBy(coh.LocalConfig.BLINK_RATE, cc.p(width * xRate * -1, height * yRate * -1))
            ));
            
            g_buf.movebyList[id] = moveBy;
        }
        
        return moveBy;
    }
};

coh.cpns.Cursor = cc.Node.extend({
    bgColor : coh.LocalConfig.ATTACKER_FOCUS_COLOR,
    actColor : coh.LocalConfig.UNIT_DELETE_COLOR,
    focusedNode : null,
    background : null,
    arrowRight : null,
    arrowLeft : null,
    arrowDirection : null,
    ctor : function(newColor) {
        
        var _coh = coh;
        
        this._super();
        
        this.background = cc.Sprite.create(_coh.res.imgs.blank);;
        this.arrowRight = cc.Sprite.create(_coh.res.imgs.cornor);
        this.arrowLeft = cc.Sprite.create(_coh.res.imgs.cornor);
        this.arrowDirection = cc.Sprite.create(_coh.res.imgs.arrow);
        
        this.arrowRight.attr({
            anchorX : 1,
            anchorY : 1,
            scale : g_lc.CORNOR_SCALE
        });
        this.arrowLeft.attr({
            anchorX : 1,
            anchorY : 1,
            scale : g_lc.CORNOR_SCALE,
            rotation : 180
        });
        this.background.attr({
            anchorX : 0,
            anchorY : 0
        });
        this.arrowDirection.attr({
            scale : g_lc.DIRECT_SCALE
        });
        
        this.addChild(this.background, _coh.LocalConfig.Z_INDEX.BACKGROUND);
        this.addChild(this.arrowRight, _coh.LocalConfig.Z_INDEX.CONTENT);
        this.addChild(this.arrowLeft, _coh.LocalConfig.Z_INDEX.CONTENT);
        this.addChild(this.arrowDirection, _coh.LocalConfig.Z_INDEX.CONTENT);
        
        this.setBgColor(newColor);
        
        this.background.runAction(g_lc.FOCUS_BLINK);
    },
    
    /**
     * Move the cursor to the target location, with the same width/height.
     * If you would like this cursor be at the same place as you might have expected,
     * Make sure the node parsed is at the same layer with the cursor.
     */
    locateTo : function(isAttacker, node, color) {
        
        if (this.focusedNode == node) return;
        
        var frameRate = coh.LocalConfig.FRAME_RATE * 5,
            _cohView = coh.View,
            _cc = cc;
        
        this.anchorX = node.anchorX;
        this.anchorY = node.anchorY;
        this.width = node.width;
        this.height = node.height;
        
        this.arrowLeft.x = 0;
        this.arrowLeft.y = 0;
        
        this.arrowDirection.setVisible(true);
        this.arrowDirection.rotation = isAttacker ? 180 : 0;
        this.arrowDirection.x = node.width / 2;
        this.arrowDirection.y = isAttacker ? 50 - node.y : this.parent.height - node.y - 50;
        
        this.setBgColor(color || this.bgColor);
        
        // animation related part.
        if (!this.focusedNode) {
            this.x = node.x;
            this.y = node.y;
            
            this.arrowRight.x = node.width;
            this.arrowRight.y = node.height;
            
            this.background.scaleX = node.width / this.background.width;
            this.background.scaleY = node.height / this.background.height;
        } else {
            this.stopAllActions();
            this.runAction(_cc.moveTo(frameRate, node.x, node.y));
            
            _cohView.tryStopAction(this.arrowRight, this.arrowRight.moveAction);
            this.arrowRight.runAction(this.arrowRight.moveAction = _cc.moveTo(frameRate, node.width, node.height));
        
            _cohView.tryStopAction(this.background, this.background.scaleAction);
            this.background.runAction(
                this.background.scaleAction = _cc.scaleTo(frameRate, node.width / this.background.width, node.height / this.background.height)
            );
        }
        
        this.setVisible(true);
        
        // create simple animations
        this.runFocusAnimat(isAttacker);
        
        this.focusedNode = node;
    },
    
    focusOn : function(isAttacker, node, color) {
        
        this.setActColor(color || this.actColor);
        
        this.stopFocusAnimat(isAttacker);
        this.arrowDirection.setVisible(false);
        
        this.focusedNode = node;
    },
    
    exile : function(node, isAttacker, color) {
        
        color && this.setBgColor(color);
        
        this.arrowDirection.setRotation(isAttacker ? 0 : 180);
        
        this.focusedNode = node;
    },
    
    hide : function() {
        this.setVisible(false);
        this.focusedNode = null;
    },
    
    updateColor : function(newColor) {
        var _coh = coh;
        
        _coh.View.tryStopAction(this.arrowDirection, this.arrowDirection.tint);
        this.background.runAction(
            this.arrowDirection.tint = cc.tintTo(
                _coh.LocalConfig.FRAME_RATE * 5, 
                newColor.r, 
                newColor.g, 
                newColor.b
            )
        );
    },
    
    setBgColor : function(newColor) {
        if (newColor instanceof cc.Color) {
            this.bgColor = newColor;
            this.updateColor(newColor);
        }
    },
    
    setActColor : function(newColor) {
        if (newColor instanceof cc.Color) {
            this.actColor = newColor;
            this.updateColor(newColor);
        }
    },
    
    getFocusAnimate : function(isAttacker) {
        return {
            ar : g_util.getMoveBy(
                this.arrowRight.width * g_lc.CORNOR_SCALE, 
                this.arrowRight.height * g_lc.CORNOR_SCALE, 
                0.382, 
                0.382
            ),
            al : g_util.getMoveBy(
                this.arrowLeft.width * g_lc.CORNOR_SCALE, 
                this.arrowLeft.height * g_lc.CORNOR_SCALE, 
                -0.382, 
                -0.382
            ),
            ad : g_util.getMoveBy(
                this.arrowDirection.width * g_lc.DIRECT_SCALE, 
                this.arrowDirection.height * g_lc.DIRECT_SCALE, 
                0, 
                0.382 * (isAttacker ? 1 : -1)
            )
        }
    },
    
    runFocusAnimat : function(isAttacker) {
        var animate = this.stopFocusAnimat(isAttacker);
        
        this.arrowRight.runAction(animate.ar);
        this.arrowLeft.runAction(animate.al);
        this.arrowDirection.runAction(animate.ad);
    },
    
    stopFocusAnimat : function(isAttacker) {
        
        var animate = this.getFocusAnimate(isAttacker),
            _cohView = coh.View;
        
        // there would be an error if the action doesn't exist.
        _cohView.tryStopAction(this.arrowRight, animate.ar);
        _cohView.tryStopAction(this.arrowLeft, animate.al);
        _cohView.tryStopAction(this.arrowDirection, animate.ad);
        return animate;
    }
});

})();