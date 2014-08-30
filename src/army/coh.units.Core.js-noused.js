var coh = coh || {},
    coh.unitStatic = coh.unitStatic  || {};

(function() {
/**
 * @implement static getType
 */
var self = coh.unitStatic.Core = function(level) {
    
    var self = this,
        self._super;
    
    self._super = coh.Unit.apply({}, arguments);
    for (var i in _super) {
        self[i] = _super[i];
    }
    
    return self;
};

coh.unitStatic.Core.prototype = new coh.Unit();
coh.unitStatic.Core.prototype.constructor = units.Core;

// public functions

/**
 * @implement static getType
 */
self.getType = function(unitName) {
    return 1;
};

})();