var coh = coh || {};
/**
 * Super class for all units.
 * @impliments FilterUtil, can add and apply filters.
 * Details for type/status/mode/color:
 * @see config.js, UNIT_TYPES for all types.

    color : color of the unit, defined in faction configurations. 3 colors in current version, it would be generated radomly while creating a unit.
    type : read only, the basic field of the unit. Type of a unit is defined in unit configurations.
        whenever a type should be returned, it should only be those ones defined in config.UNIT_TYPES.
    mode : what the unit is doing at the moment. Defaultly set 0 (idle).
    status : keycode used calculating. 
        status = (mode * typeCount + type) * colorCount + color.
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
coh.Unit = function(unitName, savedData) {
    
    var self = this,
        _coh = coh,
        // occupation config
        O_LC = _coh.occupations[unitName],
        // unit config
        U_LC = _coh.unitStatic[unitName];
    
    var buf = {
        id : 0,
        name : false,
        // level 1 for default.
        level : _coh.LocalConfig.UNIT.MIN_LEVEL,
        color : _coh.LocalConfig.INVALID,
        // check coh.LocalConfig.UNIT_MODES for full mode list.
        // idle for default.
        mode : _coh.LocalConfig.UNIT_MODES.IDLE,
        isHero : false,
        
        // other configurations from LC.
        conf : {},
        
        // initilized in constructor.
        savedData : {}
    };
    
    var construct = function(unitName, savedData) {
        
        var _buf = buf,
            _lc = {},
            _coh = coh,
            i;
        
        // register itself as a filter adapter.
        _coh.utils.FilterUtil.activate(self);
        
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
            for (i in _coh.unitStatic["hero"]) {
                _lc[i] = _coh.unitStatic["hero"][i];
            }
            // if a hero is having other configs, let's load it here.
            for (i in U_LC) {
                _lc[i] = U_LC[i];
            }
            // set occupation-related functions
            self.setAsHero();
        }
        
        // other initializations required;
        // static configs, readonly.
        var index;
        for (i in _lc) {
            _buf.conf[i] = _lc[i];
            
            index = _coh.Util.getFUStr(i);
            // append getter for all configs.
            self["get" + index] = (function(i) {
                return function() {
                    return _coh.utils.FilterUtil.applyFilters("getUnit" + index, buf.conf[i], self);
                }
            })(i);
        }
        // dynamic data, read/write.
        var basicData = self.isHero() && _coh.unitData.hero || _coh.unitData.unit;
        // configs for specific heros.
        for (i in _coh.unitData[unitName]) {
            basicData[i] = _coh.unitData[unitName][i];
        }
        for (i in basicData) {
            // verifications could be appended outside.
            
            // it should be a global filter as at this time, the unit isn't returned yet. 
            _buf.savedData[i] = _coh.utils.FilterUtil.applyFilters("loadSavedData" +  i, savedData && savedData[i] || basicData[i], i, self);
            
            index = _coh.Util.getFUStr(i);
            self["get" + index] = (function(i) {
                return function() {
                    return _coh.utils.FilterUtil.applyFilters("getUnit" + index, _buf.savedData[i], self);
                }
            })(i);
            self["set" + index] = (function(i) {
                return function(value) {
                    _buf.savedData[i] = _coh.utils.FilterUtil.applyFilters("setUnit" + index, value, self);
                }
            })(i);
        }
        
        buf.id = _coh.LocalConfig.PRE_RAND_ID + _coh.Util.getRandId();
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
        
        return (self.getType() + _buf.mode * _coh.LocalConfig.UNIT_TYPES_COUNT) * _coh.LocalConfig.COLOR_COUNT + _buf.color;
    };
    self.getMode = function() {
        return buf.mode;
    };
    self.setMode = function(modeId) {
        if (coh.LocalConfig.UNIT_MODES[modeId]) buf.mode = modeId;
    };
    
    self.getSavedData = function() {
        return buf.savedData;
    };
    
    self.isHero = function() {
        return buf.isHero;
    };
    
    // let's move extra functions out of the class defination, make it possible be expanded.
    self.setAsHero = function() {
        buf.isHero = true;
    };
    
    self.clone = function() {
        var clone = _coh.UnitFactory.getInstance(self.getName(), self.getSavedData());
        clone.setColor(self.getColor());
        clone.setMode(self.getMode());
        
        return clone;
    };
    
    construct.apply(self, arguments);
    
    return self;
};