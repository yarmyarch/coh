var coh = coh || {},
    coh.units = coh.units  || {};

(function() {
var self = coh.units.Archer = function(level) {
    
    var self = this,
        self._super;
    
    self._super = coh.Core.apply({}, arguments);
    for (var i in _super) {
        self[i] = _super[i];
    }
    
    return self;
};

coh.units.Archer.prototype = new coh.Core();
coh.units.Archer.prototype.constructor = units.Archer;

// public functions

})();