/**
 *@require {Battle}: Utils for battle scene.
 */
var coh = coh || {};

(function() {
/**
 * Super class for all units.
 * Details for type/status/action/color:
 * @see config.js, UNIT_TYPES for all types.

    color : color of the unit, defined in faction configurations. 3 colors in current version, it would be generated radomly while creating a unit.
    type : read only, the basic field of the unit. Type of a unit is defined in unit configurations.
        whenever a type should be returned, it should only be those ones defined in config.UNIT_TYPES.
    action : what the unit is doing at the moment. Defaultly set 0 (idle).
    status : keycode used calculating. 
        status = (action * typeCount + type) * colorCount + color.
    for status == 12: 
        color == 0;
        type == 4;
    0 - blank;
    1 - reserved;
    2 - reserved;
    3 - 0/1;
    4 - 1/1;
    5 - 2/1;
    ...
 *
 */
var UnitObject = function(unitName) {
    
    var self = this,
        _coh = coh,
        // occupation config
        O_LC = _coh.occupations[unitName],
        // unit config
        U_LC = _coh.units[unitName];
    
    var buf = {
        id : 0,
        name : false,
        // level 1 for default.
        level : _coh.LocalConfig.UNIT.MIN_LEVEL,
        color : _coh.LocalConfig.INVALID,
        // check coh.LocalConfig.UNIT_ACTIONS for full action list.
        action : _coh.LocalConfig.UNIT_ACTIONS.IDLE
        isHero : false,
        
        // other configurations from LC.
        conf : {},
        
        // idle for default.
    };
    
    var construct = function(unitName) {
        
        var _buf = buf,
            _lc = {},
            i;
        
        _buf.name = unitName;
        
        // if a unit isn't having the name configed in occupations, let's treat it as a hero unit.
        if (U_LC.occupation == unitName) {
            for (i in U_LC) {
                _lc[i] = U_LC[i];
            }
            for (i in O_LC) {
                _lc[i] = O_LC[i];
            }
        } else {
            // load common configs for heros first;
            for (i in _coh.units["hero"]) {
                _lc[i] = _coh.units["hero"][i];
            }
            // if a hero is having other configs, let's load it here.
            for (i in U_LC) {
                _lc[i] = U_LC[i];
            }
            // set occupation-related functions
            self.setAsHero();
        }
        
        // other initializations required;
        for (i in _lc) {
            _buf.conf[i] = _lc[i];
            
            // append getter for all configs.
            self["get" + _coh.Util.getFUStr(i)] = (function(i) {
                return function() {
                    return _coh.utils.FilterUtil.applyFilters("unitAttribute" + _coh.Util.getFUStr(i), buf.conf[i], self);
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
    
    self.setColor = function(newColor) {
        return buf.color = newColor;
    };
    
    self.getColor = function() {
        return buf.color;
    };
    
    /**
     * could only be actived once the color is set.
     */
    self.getStatus = function() {
        var _buf = buf,
            _coh = coh;
        if (_buf.color == _coh.LocalConfig.INVALID) {
            return 0;
        }
        
        return (self.getType() + _buf.action * _coh.LocalConfig.UNIT_TYPES_COUNT) * _coh.LocalConfig.COLOR_COUNT + _buf.color;
    };
    self.getAction = function() {
        return buf.action;
    };
    self.setAction = function(actionId) {
        if (coh.LocalConfig.UNIT_ACTIONS[actionId]) buf.action = actionId;
    };
    
    self.getLevel = function() {
        return buf.level;
    };
    
    self.setLevel = function(newLevel) {
        var _coh = coh;
        buf.level = newLevel && Math.min(Math.max(newLevel, _coh.LocalConfig.UNIT.MIN_LEVEL), _coh.LocalConfig.UNIT.MAX_LEVEL) || _coh.LocalConfig.UNIT.MIN_LEVEL;
    };
    
    self.isHero = function() {
        return buf.isHero;
    };
    
    // let's move extra functions out of the class defination, make it possible be expanded.
    self.setAsHero = function() {
        buf.isHero = true;
    };
    
    construct.apply(self, arguments);
    
    return self;
};

/**
 * Unit factary and all public functions related to units.
 */
coh.Unit = (function() {
    
    var self,
        _coh = coh,
        LC = _coh.LocalConfig;
    
    return self = {
        /**
         * get type by unit name.
         */
        getUnitType : function(unitName) {
            return (coh.units[unitName] && coh.units[unitName].type) || 0;
        },
        
        /**
         * factory function that returns the unit object via the given key.
         */
        getInstance : function(unitName) {
            var unit = new UnitObject(unitName);
            
            unit = coh.utils.FilterUtil.applyFilters("unitGenerated", unit);
            if (unit.isHero()) {
                unit = coh.utils.FilterUtil.applyFilters("heroGenerated", unit);
            }
            
            return unit;
        },
        
        getTypeFromStatus : function(status) {
            return ~~(+status / LC.COLOR_COUNT) % LC.UNIT_TYPES_COUNT;
        },
        
        getActionFromStatus : function(status) {
            return ~~(~~(+status / LC.COLOR_COUNT) / LC.UNIT_TYPES_COUNT);
        },
        
        getColorFromStatus : function(status) {
            return +status % LC.COLOR_COUNT;
        }
    }
    
})();

})();