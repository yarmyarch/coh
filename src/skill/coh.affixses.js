var coh = coh || {};

(function() {
var levelCalculators = {
    // defaultly used calculator when no one defined in affix
    levels : function(level) {
        return 1;
    }
}, _lc = levelCalculators;

coh.affixes = {
    ranged : {
        effects : [
            {
                /**
                 * <effect_name> : [<effect param>]
                 * the value would be parsed as params of the effect levels calculator. So it's soppused to be an array.
                 */ 
                ranged : 1
            }
        ],
        // defines how the effect should gains with the level.
        // default config: _lc.levels
        levels : false
    }
};

})();