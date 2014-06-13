var coh = coh || {};

(function() {

/**
 * Super class for all units.
 */
var UnitInstance = function(unitName) {
    
    var self = this,
        self._super;
    
    var buf = {
        name : false, 
        type : 0, 
        
        level : 0,
        
        // generated from level
        defend : 0,
        attack : 0,
    };
    
    var construct = function(unitName) {
        buf.name = unitName;
        // other initializations required;
    }
    
    self.getType = function() {
        return buf.type;
    };
    
    self.getLevel = function() {
        return buf.level;
    };
    
    self.getDefend : function() {
        return buf.defend;
    };
    
    self.getAttack : function() {
        return buf.attack;
    };
    
    construct.apply(self, arguments);
    
    return self;
};

/**
 * Unit factary and all public functions related to units.
 */
coh.Unit = (function(level) {
    
    var self;

    return self = {
        getType : function(unitName) {
            return (coh.units[unitName] && coh.units[unitName].type) || 0;
        },
        
        /**
         * factory function that returns the unit object via the given key.
         */
        getUnit : function(unitName) {
            return new UnitInstance(unitName);
        }
    }
    
})();

})();