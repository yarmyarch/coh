/**
 * @require Calculator
 */
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
coh.Player = function(unitConfig) {
    
    var self = this;
    
    var buf = {
        
        id : 0,
        
        /**
         * Should these dynamic data be loaded from saved data?
         *
        faction : false, 
        
        level : 0, 
        
        // generated from level
        currentHP : 0,
        totalHP : 0,
        */
        
        // attacker for default.
        isAttacker : true,
        
        units : {},
        
        /**
         * indexed by priority and unit type.
         */
        unitsUnplaced : {},
        
        savedData : {
            unitLevels : {},
            heros : {
                
            }
        }
    };
    
    handlerList = {
        calculator : null
    };
    
    var construct = function(unitConfig) {
        
        var _buf = buf,
            _coh = coh,
            _u = _buf.unitsUnplaced,
            unit;
        
        // generate random Id for the player.
        _buf.id = _coh.LocalConfig.PRE_RAND_ID + _coh.Util.getRandId();
        
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
    
    self.getId = function() {
        return buf.id;
    },
    
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
                unit.setLevel(_buf.savedData.unitLevels[unitName] || 0);
                // set level history for hero units.
                if (_buf.savedData.heros[unitName]) {
                    unit.setLevels(_buf.savedData.heros[unitName].levels);
                    unit.setOccupation(_buf.savedData.heros[unitName].ocpt);
                }
                
                break;
            }
        }
        
        if (!unit) return null;
        
        _buf.units[unit.getId()] = unit;
        return unit;
    };
    
    self.getNumOfUnplacedUnit = function() {
        var result = 0,
            _buf = buf;
        for (var priority in _buf.unitsUnplaced)  {
            for (var type in _buf.unitsUnplaced[priority]) {
                result += _buf.unitsUnplaced[priority][type].length;
            }
        }
        return result;
    };
    
    self.killUnit = function(unit) {
        var _buf = buf,
            unit = _buf.units[unit.getId()];
        
        if (unit) {
            _buf.unitsUnplaced[unit.getPriority()][unit.getType()].push(unit.getName());
            delete(_buf.units[unit.getId()]);
        }
    };
    
    self.getUnit = function(unitId) {
        return buf.units[unitId];
    };
    
    /*
    self.getCurrentHP = function() {
        return buf.currentHP;
    };
    
    self.getTotalHP = function() {
        return buf.totalHP;
    };
    */
    
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
    };
    self.setAsAttacker = function() {
        buf.isAttacker = true;
    };
    self.setAsDefender = function() {
        buf.isAttacker = false;
    };
    
    self.getUnitAttack = function(unit) {
        return handlerList.calculator.getAttack(unit);
    };
    
    self.getUnitHp = function(unit) {
        return handlerList.calculator.getHp(unit);
    };
    
    self.getUnitSpeed = function(unit) {
        return handlerList.calculator.getSpeed(unit);
    };
    
    self.getTurnsForCharge = function(unit) {
        return handlerList.calculator.getTurn(self.getUnitSpeed(unit));
    };
    
    self.setCalculator = function(newClt) {
        handlerList.calculator = newClt;
    };
    
    /**
     * set dynamic data.
     */
    self.setData = function(newDataObject) {
        buf.savedData = newDataObject;
        // XXXXXX Other actions required for additional calculatings in future.
    };
    
    /**
     * Get all dynamic data of the player in Object, for saving purpose.
     * Maybe it should be parsed into base64 or something like that?
     * Never mind, that's not this Class should be focused on.
     */
    self.getData = function() {
        // XXXXXX JSON.stringify to be used for this case.
        return buf.savedData;
    };
    
    construct.apply(self, arguments);
    
    return self;
};
    
})();