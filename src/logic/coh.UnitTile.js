var coh = coh || {};

/**
 * Unit tile that contains data of a unit and the tile sprite for the unit.
 */
(function() {

var g_lc = {
    CHECK_COLOR : new cc.Color(255, 128, 128, 255),
    UNCHECK_COLOR : new cc.Color(255, 255, 255, 255)
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
        this.unitSprite.runAction(coh.LocalConfig.FOCUS_BLINK);
        buf.isChecked = true;
    };
    
    self.unCheck = function() {
        this.unitSprite.setColor(g_lc.UNCHECK_COLOR);
        // XXXXXX why it won't work here?
        // Looks like it's triggered dulplicated times.
        this.unitSprite.stopAction(coh.LocalConfig.FOCUS_BLINK);
        buf.isChecked = false;
    };
    
    self.isChecked = function() {
        return buf.isChecked;
    };
    
    construct.apply(self, arguments);
    
    return self;
};

})();