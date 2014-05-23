var coh = coh || {};

(function() {
/**
 * Super class for all classes in coh.units module.
 * required interface list: 
 * @interface static getType
 */
coh.Unit = function(level) {
    
    var self = this,
        self._super;
    
    //~ self._super = coh.superClass.apply({}, arguments);
    //~ for (var i in _super) {
        //~ self[i] = _super[i];
    //~ }
    
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

//~ coh.subUnitClass.prototype = new coh.Unit();
//~ coh.subUnitClass.prototype.constructor = coh.Unit;

// public functions

/**
 * @interface static getType
 */
coh.Unit.getType = function(unitName) {
    if (coh.units[unitName] && coh.util.isExecutable(coh.units[unitName].getType)) return coh.units[unitName].getType();
    // 0 - reserved.
    else return 0;
};

})();