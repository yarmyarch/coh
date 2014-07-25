var coh = coh || {};

/**
 * Unit tile that contains data of a unit and the tile sprite for the unit.
 */
(function() {

var g_lc = {
    CHECK_COLOR : new cc.Color(255, 128, 128, 255),
    UNCHECK_COLOR : new cc.Color(255, 255, 255, 255),
    FOCUS_BLINK : cc.repeatForever(cc.sequence(cc.fadeTo(0.618, 64), cc.fadeTo(0.618, 204)))
}
    
coh.UnitTile = function() {
    
    var self = this;
    
    var buf = {
        isChecked : false
    };

    var construct = function(unit, tileSprite, unitSprite) {
        this.unit = unit;
        this.tileSprite = tileSprite;
        this.unitSprite = unitSprite;
    }
    
    self.check = function() {
        this.unitSprite.setColor(g_lc.CHECK_COLOR);
        this.unitSprite.runAction(g_lc.FOCUS_BLINK);
        buf.isChecked = true;
    };
    
    self.unCheck = function() {
        this.unitSprite.setColor(g_lc.UNCHECK_COLOR);
        // XXXXXX why it won't work here?
        // Looks like it's triggered dulplicated times.
        this.unitSprite.stopAction(g_lc.FOCUS_BLINK);
        buf.isChecked = false;
    };
    
    self.isChecked = function() {
        return buf.isChecked;
    };
    
    self.exile = function(isAttacker) {
        this.unitSprite.runAction(g_lc.FOCUS_BLINK);
        this.unitSprite.y = (isAttacker ? -1 : 1) * this.unitSprite.height;
    };
    
    self.unExile = function() {
        this.unitSprite.stopAction(g_lc.FOCUS_BLINK);
        this.unitSprite.y = 0;
    };
    
    construct.apply(self, arguments);
    
    return self;
};

})();