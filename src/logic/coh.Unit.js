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
        level : 0,
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
    
    self.getLevel = function() {
        return buf.level;
    };
    
    self.setLevel = function(newLevel) {
        buf.level = newLevel;
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

    var util = {
        /**
         * @return object with items in each occupations, plus an index "level",
         * that tells how much levels in total exists in the history.
         */
        getLeveledOccupation : function(levels) {
            var historyLevel = 0,
                maxLevel = _coh.LocalConfig.UNIT.MAX_LEVEL,
                ocpt = {
                    level : 0
                },
                i, attribute;
            
            if (!levels) return;
            
            for (i in levels) {
                for (attribute in levels[i]) {
                    ocpt[attribute] = ocpt[attribute] || 0;
                    ocpt[attribute] += (levels[i] / maxLevel) * _coh.occupations[i][attribute];
                }
                ocpt.level += levels[i];
            }
            return ocpt;
        }
    };
    
    // react filters here.
    
    /**
     * extea actions appended for hero units.
     */
    _coh.FilterUtil.addFilter("heroGenerated", function(unit) {
        
        // New buffer for the unit object.
        var inner_buf = {
            occupation : null,
            levels : null,
            historyOcpt : null
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
            inner_buf.levels = levels;
            // it should be regenerated once the history level changed.
            inner_buf.historyOcpt = null;
        };
        
        unit.setOccupation = function(ocptName) {
            inner_buf.occupation = _coh.occupations[ocptName];
        };
        
        /**
         * There must be a more simple solution for heros.
         * Bingo! I found it!
         * getAttack and other functions regenerated here via it's current occupation.
         */
        for (var i in _coh.occupations[_buf.occupation]) {
            unit["get" + i[0].toUpperCase() + i.substr(1)] = (function(attribute) {
                return function() {                    
                    // here we go.
                    var _buf = inner_buf,
                        maxLevel = _coh.LocalConfig.UNIT.MAX_LEVEL,
                        maxAttr = 0;
                    if (!_buf.levels || !_buf.occupation) return 0;
                    
                    _buf.historyOcpt = _buf.historyOcpt || util.getLeveledOccupation(_buf.levels);
                    
                    maxAttr = _buf.historyOcpt[attribute] + (1 - _buf.historyOcpt.level / maxLevel) * _coh.occupations[_buf.occupation][attribute];
                    return Math.ceil(maxAttr);
                };
            })(i);
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