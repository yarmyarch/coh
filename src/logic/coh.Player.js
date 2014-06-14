var coh = coh || {};

(function() {
/**
 * @param unitConfig
    {
        [unitName] : [unitCount],
        // ... others
    }
 * Would be translated into Units list:
    {
        [unitName] : Array(<UnitObject>),
        // ... others
    }
 */
coh.Player = function(faction, level, unitConfig) {
    
    var self = this;
    
    var buf = {
        dataGroup : [],
        
        faction : false, 
        
        level : 0, 
        
        // generated from level
        currentHP : 0,
        totalHP : 0,
        
        units : {}
    };
    
    var construct = function(faction, level, unitConfig) {
        
        var _buf = buf,
            _coh = coh;
        for (var unitName in unitConfig) {
            !_buf.units[unitName] && (_buf.units[unitName] = []);
            for (var unitCount = 0, total = unitConfig[unitName]; unitCount < total; ++unitCount) {
                _buf.units[unitName].push(_coh.Unit.getInstance(unitName));
            }
        }
    };
    
    self.getDataGroup = function() {
        return buf.dataGroup;
    },
    
    self.getCurrentHP = function() {
        return buf.currentHP;
    };
    
    self.getTotalHP = function() {
        return buf.totalHP;
    };
    
    self.getUnits = function() {
        return buf.units;
    };
    
    self.getUnitConfig = function() {
        return unitConfig;
    };
    
    construct.apply(self, arguments);
    
    return self;
};
    
})();