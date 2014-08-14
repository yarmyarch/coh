var coh = coh || {};

(function() {

coh.Phalanx = function(type, units) {
    
    var self = this;
    
    var buf = {
        // 0 - blank
        type : 0,
        unitBodys : false,
        
        attack : 0,
        hp : 0,
        duration : 0
    };
    
    var construct = function(type, unitBodys) {
        
        var _buf = buf,
            _coh = coh;
        
        _buf.type = type;
        _buf.unitBodys= unitBodys;
        
        var leadUnit = unitBodys[0];
        
        for (var i = 0, unitBody; unitBody = unitBodys[i]; ++i) {
            // index should be considered as well.
            // move it out.
            _coh.utils.FilterUtil.applyFilters("convertUnit", unitBody, leadUnit, type);
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
        return buf.unitBodys;
    };
    
    construct.apply(self, arguments);
    
    return self;
};
    
})();