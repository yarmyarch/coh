var coh = coh || {},
    coh.units = coh.units  || {};

(function() {
/**
 * Super class for all classes in coh.units module.
 * required interface list: 
 * @implement static getType
 */
var self = coh.units.Archer = function(level) {
    
    var self = this,
        self._super;
    
    self._super = coh.Unit.apply({}, arguments);
    for (var i in _super) {
        self[i] = _super[i];
    }
    
    return self;
};

coh.units.Archer.prototype = new coh.Unit();
coh.units.Archer.prototype.constructor = units.Archer;

// public functions

/**
 * @implement static getType
 */
self.getType = function(unitName) {
    return 1;
};

})();