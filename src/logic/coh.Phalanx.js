var coh = coh || {};

(function() {

coh.Phalanx = function(type, units) {
    
    var self = this;
    
    var buf = {
        // 0 - blank
        type : 0,
        
        // Actived (non-removed) units.
        // For example, a type 2 convert, the actived unit is the elite unit only,
        // All other units are moved to removed unitBodies.
        unitBodies : [],
        
        // removed unit body set.
        r_unitBodies : [],
        
        attack : 0,
        hp : 0,
        duration : 0
    };
    
    var construct = function(type, unitBodies) {
        
        var _buf = buf,
            _coh = coh;
        
        _buf.type = type;
        
        var leadUnit = unitBodies[0];
        
        for (var i = 0, unitBody; unitBody = unitBodies[i]; ++i) {
            // index should be considered as well.
            // move it out.
            _coh.utils.FilterUtil.applyFilters("convertUnit", unitBody, leadUnit, type);
            
            // for a unit, it's the convert type isn't a wall and it's a type 1 unit, it should be converted into the lead unit.
            // converted units should have been removed from the battle scene.
            if (unitBody.unit.getType != _coh.UNIT_TYPES.SOLDIER && type != _coh.CONVERT_TYPES.WALL)
                // if the unit was not converted - meanning removed, let's say it's actived.
                _buf.unitBodies.push(unitBody);
            } else {
                _buf.r_unitBodies.push(convertedUnit);
            }
        }
        
        // walls have different value as normal soldiers.
        _buf.attack = _coh.utils.FilterUtil.applyFilters("unitActivedAttack", leadUnit.getPlayer().getUnitAttack(leadUnit, convertType), leadUnit.unit);
        _buf.hp = _coh.utils.FilterUtil.applyFilters("unitActivedHp", leadUnit.getPlayer().getUnitHp(leadUnit, convertType), leadUnit.unit);
        _buf.duration = _coh.utils.FilterUtil.applyFilters("unitActivedDuration", leadUnit.getPlayer().getChargingDuration(leadUnit, convertType), leadUnit.unit);
    };
    
    self.getType = function() {
        return buf.type;
    };
    
    self.getAttack = function() {
        return buf.attack;
    };
    
    self.getHp = function() {
        return buf.hp;
    };
    
    self.getDuration = function() {
        return buf.duration;
    };
    
    self.getUnitBodies = function() {
        return buf.unitBodies;
    };
    
    self.getConvertedUnitBodies = function() {
        return buf.r_unitBodies;
    };
    
    construct.apply(self, arguments);
    
    return self;
};
    
})();