var coh = coh || {},
    coh.units = coh.units  || {};

(function() {
/**
 * @implement static getType
 */
var self = coh.units.Core = function(level) {
    
    var self = this,
        self._super;
    
    self._super = coh.Unit.apply({}, arguments);
    for (var i in _super) {
        self[i] = _super[i];
    }
    
    return self;
};

coh.units.Core.prototype = new coh.Unit();
coh.units.Core.prototype.constructor = units.Core;

// public functions

/**
 * @implement static getType
 */
self.getType = function(unitName) {
    return 1;
};

})();