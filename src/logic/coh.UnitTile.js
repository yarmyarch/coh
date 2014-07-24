var coh = coh || {};

/**
 * Unit tile that contains data of a unit and the tile sprite for the unit.
 */
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
        
        buf.isChecked = true;
    };
    
    self.unCheck = function() {
        
        buf.isChecked = false;
    };
    
    self.isChecked = function() {
        return buf.isChecked;
    };
    
    construct.apply(self, arguments);
    
    return self;
};