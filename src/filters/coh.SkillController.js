/**
 * Do events and filters bindings related to skills.
 * This class is designed to add the skill sets to units without injecting to the original code.
 */

coh.SkillController = (function() {

    var self;
    
    var _coh = coh;
    
    // bind skill reactions to each unit created.
    _coh.FilterUtil.addFilter("unitGenerated", function(unit) {
        self.setupUnitSkills(unit);
    });
    
    return self = {
        // allow an unit be able to react to skills.
        setupUnitSkills : function(unit) {
            
        }
    };
})();