var coh = coh || {};

(function() {

coh.Phalanx = function(type, units) {
    
    var self = this;
    
    var buf = {
        // 0 - blank
        type : 0,
        unitWraps : false,
        
        attack : 0,
        hp : 0,
        duration : 0
    };
    
    var construct = function(type, unitWraps) {
        
        var _buf = buf;
        
        _buf.type = type;
        _buf.unitWraps= unitWraps;
        
        var leadUnit = unitWraps[0];
        
        for (var i = 0, unitWrap; unitWrap = unitWraps[i]; ++i) {
            unitWrap.convert();
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
    
    self.getUnitWraps = function() {
        return buf.unitWraps;
    };
    
    construct.apply(self, arguments);
    
    return self;
};
    
})();