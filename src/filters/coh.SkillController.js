/**
 * Do events and filters bindings related to skills.
 * This class is designed to add the skill sets to units without injecting to the original code,
 *  and translate global filters into units'.
 */

coh.SkillController = (function() {

    var self;
    
    var _coh = coh,
        _fu = _coh.utils.FilterUtil;
    
    /**
     * no it's not a good idea.
    var utils = {
        // do the global -> unit translation
        filterTranslation : function() {
            var filterList = [],
                i;
            
            // is there any lazy-loadiing way making it instead of a full scan to the attributes?
            //~ for (var i in )
            
            _fu.addFilter("phalanxMovingDistance", function(distance, phalanx) {
                return phalanx.getLeadingUnit().applyFilters("phalanxMovingDistance", distance);
            });
        }
    }*/
    
    // bind skill reactions to each unit created.
    _fu.addFilter("unitGenerated", function(unit) {
        self.setupUnitSkills(unit);
    });
    
    return self = {
        // allow an unit be able to react to skills.
        setupUnitSkills : function(unit) {
            // do unit.addFilters;
        }
    };
})();