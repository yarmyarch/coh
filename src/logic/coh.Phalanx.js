var coh = coh || {};

(function() {

    /**
     * while creating a phalanx, the unit might be :
        Removed from the battle scene if it's a unit that should be converted to the lead unit;
        Set to charging status if it's a lead unit;
        Transformed into a wall;
     * Together with few data changes:
     * Action set to coh.LocalConfig.ACTIONS.CHARGE;
     * Position reset should be handled by battleScene, after the phalax finishes converting or transforming,
     * Mean while the matrix of battleScene should be updated automatically.
     */
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
            if (unitBody.unit.getType() != _coh.UNIT_TYPES.SOLDIER)
                // if the unit was not converted - meanning removed, let's say it's actived.
                _buf.unitBodies.push(unitBody);
                if (type == _coh.CONVERT_TYPES.WALL) {
                    unitBody.unit.setMode(_coh.UNIT_MODES.WALL);
                } else {
                    unitBody.unit.setMode(_coh.UNIT_MODES.CHARGE);
                }
            } else {
                _buf.r_unitBodies.push(unitBody);
            }
        }
        
        // walls have different value as normal soldiers.
        _buf.attack = leadUnit.unit.applyFilters("unitActivedAttack", leadUnit.getPlayer().getUnitAttack(leadUnit, convertType));
        _buf.hp = leadUnit.unit.applyFilters("unitActivedHp", leadUnit.getPlayer().getUnitHp(leadUnit, convertType));
        _buf.duration = leadUnit.unit.applyFilters("unitActivedDuration", leadUnit.getPlayer().getChargingDuration(leadUnit, convertType));
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
    
    self.getLeadingUnit = function() {
        return buf.unitBodies[0];
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