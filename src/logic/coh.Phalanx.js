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
        
        var _buf = buf;
        
        _buf.type = type;
        _buf.unitBodys= unitBodys;
        
        var leadUnit = unitBodys[0];
        
        for (var i = 0, unitBody; unitBody = unitBodys[i]; ++i) {
            // index should be considered as well.
            unitBody.convertTo(type, i);
        }
        
        _buf.attack = leadUnit.getPlayer().getUnitAttack(leadUnit);
        _buf.hp = leadUnit.getPlayer().getUnitHp(leadUnit);
        _buf.duration = leadUnit.getPlayer().getUnitDuration(leadUnit);
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