var coh = coh || {},
    coh.unitStatic = coh.unitStatic  || {};

(function() {
var self = coh.unitStatic.Archer = function(level) {
    
    var self = this,
        self._super;
    
    self._super = coh.Core.apply({}, arguments);
    for (var i in _super) {
        self[i] = _super[i];
    }
    
    return self;
};

coh.unitStatic.Archer.prototype = new coh.Core();
coh.unitStatic.Archer.prototype.constructor = units.Archer;

// public functions

})();