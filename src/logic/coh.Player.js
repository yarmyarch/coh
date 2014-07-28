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
        
        // attacker for default.
        isAttacker : true,
        
        units : {},
        
        /**
         * indexed by priority and unit type.
         */
        unitsUnplaced : {}
    };
    
    var construct = function(faction, level, unitConfig) {
        
        var _buf = buf,
            _coh = coh,
            _u = _buf.unitsUnplaced,
            unit;
        
        for (var unitName in unitConfig) {
            unit = _coh.units[unitName];
            if (!unit) continue;
            
            _u[unit.priority] = _u[unit.priority] || {};
            _u[unit.priority][unit.type] = _u[unit.priority][unit.type] || [];
            for (var unitCount = 0, total = unitConfig[unitName]; unitCount < total; ++unitCount) {
                _u[unit.priority][unit.type].push(unitName);
            }
        }
    };
    
    self.getUnplacedUnit = function(status) {
        var _coh = coh,
            _buf = buf,
            _u = _buf.unitsUnplaced,
            type = _coh.Battle.getTypeFromStatus(status),
            unit =null, 
            unitName;
        
        for (var i in _u) {
            if (_u[i][type]) {
                unitName = _coh.Util.popRandom(_u[i][type]);
                unit = _coh.Unit.getInstance(unitName);
                unit.setColor(_coh.Battle.getColorFromStatus(status));
                break;
            }
        }
        
        if (!unit) return null;
        
        _buf.units[unit.getId()] = unit;
        return unit;
    };
    
    self.killUnit = function(unitId) {
        var _buf = buf,
            unit = _buf.units[unitId];
        
        if (unit) {
            _buf.unitsUnplaced[unit.getPriority()][unit.getType()].push(unit.getName());
            delete(_buf.units[unitId]);
        }
    };
    
    self.getUnit = function(unitId) {
        
    };
    
    self.getDataGroup = function() {
        return buf.dataGroup;
    };
    
    self.getCurrentHP = function() {
        return buf.currentHP;
    };
    
    self.getTotalHP = function() {
        return buf.totalHP;
    };
    
    /**
     * get all units that's on the ground.
     */
    self.getUnits = function() {
        return buf.units;
    };
    
    self.getUnitConfig = function() {
        return unitConfig;
    };
    
    self.isAttacker = function() {
        return buf.isAttacker;
    }
    self.setAsAttacker = function() {
        buf.isAttacker = true;
    }
    self.setAsDefender = function() {
        buf.isAttacker = false;
    }
    
    construct.apply(self, arguments);
    
    return self;
};
    
})();