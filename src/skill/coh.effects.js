var coh = coh || {};

(function() {
var levelCalculators = {
    // defaultly used calculator when no one defined in effect
    
    /**
     * @param level level of a unit.
     * Most effects would be more effective when the level of the unit gains.
     */
    levels : function(level) {
        return 1;
    }
}, _lc = levelCalculators;

coh.effects = {
    // ranged effect will be actived when calculating priorities of a unit when generating a phalanx.
    ranged : {
        // interested filters
        filters : ["getUnitPriorityInScene"],
        // the effect won't gains with the level
        levels : false
    }
};

})();