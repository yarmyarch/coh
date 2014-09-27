var coh = coh || {};

(function() {
/**
 * Unit factary and all public functions related to units.
 */
coh.UnitFactory = (function() {
    
    var self,
        _coh = coh,
        LC = _coh.LocalConfig;
    
    return self = {
        /**
         * get type by unit name.
         */
        getUnitType : function(unitName) {
            return (coh.unitStatic[unitName] && coh.unitStatic[unitName].type) || 0;
        },
        
        /**
         * factory function that returns the unit object via the given key.
         */
        getInstance : function(unitName) {
            var unit = new _coh.Unit(unitName);
            
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