var coh = coh || {};

(function() {

/**
 * Super class for all units.
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
        color : _coh.LocalConfig.NO_COLOR,
        isHero : false,
        
        // other configurations from LC.
        conf : {}
    };
    
    var construct = function(unitName) {
        
        var _buf = buf,
            _lc,
            i;
        
        _buf.name = unitName;
        
        for (i in U_LC) {
            _lc[i] = U_LC[i];
        }
        for (i in O_LC) {
            _lc[i] = O_LC[i];
        }
        
        // other initializations required;
        for (i in _lc) {
            _buf.conf[i] = _lc[i];
            
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
        var _buf = buf;
        if (_buf.color == coh.LocalConfig.NO_COLOR) {
            return 0;
        }
        return coh.Battle.getStatus(self.getType(), _buf.color);
    };
    
    self.isHero = function() {
        return buf.isHero;
    };
    
    self.setAsHero = function() {
        var _buf = buf;
        
        // We won't set it again.
        if (_buf.isHero) return;
        _buf.isHero = true;
        
        coh.util.FilterUtil.applyFilters("heroGenerated", unit);
    };
    
    construct.apply(self, arguments);
    
    return self;
};

/**
 * Unit factary and all public functions related to units.
 */
coh.Unit = (function() {
    
    var self,
        _coh = coh;

    // react filters here.
    
    /**
     * extea actions appended for hero units.
     */
    _coh.FilterUtil.addFilter("heroGenerated", function(unit) {
        
        // New buffer for the unit object.
        var buf = {
            occupation : null,
            levels : null
        };
        
        /**
         * Set level history for the unit, the level history won't include it's current occupation.
         * Attack/Hp/Speeds would be generated from the level history.
         * The object may look like this:
            {
                <occupation name> : <level>,
                // ... other occupations here.
            }
         */
        unit.setLevels = function(levels) {
            buf.levels = levels;
        };
        
        unit.setOccupation = function(ocptName) {
            buf.occupation = _coh.occupations[ocptName];
        };
        
        /**
         * XXXXXX Mind for generated heros. If it's not configured in units/occupations, functions related should all be regenerated. Is that right?
         */
        unit.getAttack = function() {
            // here we go.
        }
    });
    
    return self = {
        getType : function(unitName) {
            return (coh.units[unitName] && coh.units[unitName].type) || 0;
        },
        
        /**
         * factory function that returns the unit object via the given key.
         */
        getInstance : function(unitName) {
            var unit = new UnitObject(unitName);
            
            coh.util.FilterUtil.applyFilters("unitGenerated", unit);
            
            return unit;
        }
    }
    
})();

})();