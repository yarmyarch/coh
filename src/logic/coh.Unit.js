var coh = coh || {};

(function() {

/**
 * Super class for all units.
 */
var UnitObject = function(unitName) {
    
    var self = this,
        _coh = coh,
        LC = _coh.units[unitName];
    
    if (!LC) return null;
    
    var buf = {
        id : 0,
        name : false,
        
        level : 0,
        
        // generated from level
        defend : 0,
        attack : 0,
        color : _coh.LocalConfig.NO_COLOR,
        
        // other configurations from LC.
        conf : {}
    };
    
    var construct = function(unitName) {
        
        var _buf = buf;
        
        _buf.name = unitName;
        
        // other initializations required;
        for (var i in LC) {
            _buf.conf[i] = LC[i];
            
            // append getter for all configs.
            self["get" + i[0].toUpperCase() + i.substr(1)] = (function(i) {
                return function() {
                    return buf.conf[i];
                }
            })(i);
        }
        
        this.id = _coh.LocalConfig.PRE_RAND_ID + _coh.Util.getRandId();
    }
    
    self.getName = function() {
        return buf.name;
    };
    
    self.getId = function() {
        return buf.id;
    };
    
    self.getLevel = function() {
        return buf.level;
    };
    
    self.getDefend = function() {
        return buf.defend;
    };
    
    self.getAttack = function() {
        return buf.attack;
    };
    
    self.setColor = function(newColor) {
        return (buf.color = _coh.Battle.getColorFromStatus(newColor) || buf.color);
    };
    
    self.getColor = function() {
        return buf.color;
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
        getInstance : function(unitName) {
            return new UnitObject(unitName);
        }
    }
    
})();

})();