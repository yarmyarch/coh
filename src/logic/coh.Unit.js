var coh = coh || {};

(function() {
/**
 * public functions for all actions related to units.
 * @interface static getType
 */
coh.Unit = function(level) {
    
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
    
    self.getType = function() {
        return _buf.type;
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
    
    return self;
};

// public functions

/**
 * @interface static getType
 */
/*
coh.Unit.getType = function(unitName) {
    if (coh.units[unitName] && coh.util.isExecutable(coh.units[unitName].getType)) return coh.units[unitName].getType();
    // 0 - reserved.
    else return 0;
};
*/
coh.Unit.getType = function(unitName) {
    return (coh.units[unitName] && coh.units[unitName].type) || 0;
}

})();