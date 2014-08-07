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
    
    var construct = function(type, units) {
        buf.type = type;
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
    
    construct.apply(self, arguments);
    
    return self;
};
    
})();