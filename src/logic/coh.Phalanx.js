var coh = coh || {};

(function() {

coh.Phalanx = function(type, units) {
    
    var self = this;
    
    var buf = {
        // 0 - blank
        type : 0,
        attack : 0,
        hp : 0
    };
    
    var construct = function(type, unitWraps) {
        
        var _buf = buf;
        
        _buf.type = type;
        _buf.unitWraps= unitWraps;
        
        var leadUnit = unitWraps[0];
        
        for (var i = 0, unitWrap; unitWrap = unitWraps[i]; ++i) {
            unitWrap.convert();
        }
        
        // How should the attack be calculated via the level?
        _buf.attack = leadUnit.getPlayer().getUnitAttack(leadUnit);
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
    
    self.getUnitWraps = function() {
        return buf.unitWraps;
    };
    
    construct.apply(self, arguments);
    
    return self;
};
    
})();