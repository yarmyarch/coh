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
     * no it's not a good idea...
     *  whatelse can I do?
     */
    var utils = {
        // do the global -> unit translation for applying filters.
        filterTranslation : function() {
            var filterList = [],
                i, j, filters, 
                _coh = _coh,
                _fu = _fu;
            
            // XXXXXX is there any lazy-loadiing way making it instead of a full scan to the attributes?
            for (i in _coh.effects) {
                filters = _coh.effects.filters;
                for (j in filters) {
                    // $1 can be optional.
                    j = j.replace(/\$1$/, "");
                    // record filter names only, and no dulplicates.
                    filterList[j] = j;
                }
            }
            
            var filterName, unitIndex;
            // do the translation from global to unit for recorded filters.
            for (i in filterList) {
                // remove unit locaters.
                // XXXXXX will it be a problem in future here?
                /*

                an effect may define a filter like this:
                    getAttrAttack$1 : function(){};
                while that means in the globally triggered filter named "getAttrAttack", 
                there might be more than 1 params in the argument list (except for the first value in the arglist) that is an instance of a Unit, 
                just like this:
                    
                    coh.util.FilterUtil.applyFilter("getAttrAttack", value, unit1, unit2);

                while it may be translated into:
                    unit1.applyFilter("getAttrAttack", value, unit2);
                    unit2.applyFilter("getAttrAttack$2", value, unit1);
                when $1 is ignored as the default one.

                $1 here means this effect should react the filter triggered by unit1 only.
                if there is only 1 unit in the filter, $1 can be optional.

                Note that only when /$\d+/ is written at the end of the filtername would be recognized.
                 */
                unitIndex = (unitIndex = i.match(/\$(\d+)$/)) && +unitIndex[1] || 1;
                filterName = i.replace(/\$id+$/, "");
                _fu.addFilter(
                    filterName, 
                    (function(unitIndex, filterName) {
                        return function() {
                            // call faster than apply, in non-strict mode.
                            var args = [].slice.call(arguments),
                                i, len, unitCounter = 0,
                                filterNameInUnit = filterName;
                            
                            for (i = 1, len = args.length; i < len; ++i) {
                                if (args[i] instanceof coh.Unit) {
                                    ++unitCounter;
                                }
                                if (unitCounter == unitIndex) {
                                    unitIndex != 1 && (filterNameInUnit += "$" + unitIndex);
                                    args.splice(i, 1);
                                    return args[i].applyFilter.apply(args[i], [filterNameInUnit].concat(args));
                                }
                            }
                        }
                    })(unitIndex, filterName)
                );
            }
        }
    }
    
    // bind skill reactions to each unit created.
    _fu.addFilter("unitGenerated", function(unit) {
        self.setupUnitSkills(unit);
    });
    
    return self = {
        // allow an unit be able to react to skills,
        // adding filters to the unit for applying in future(parsed from global filters).
        setupUnitSkills : function(unit) {
            // do unit.addFilters with all configured skills to the unit.
            var skills = unit.getSkills(),
                skillLevel,
                skillName, 
                affixes,
                effect,
                effectName,
                i,
                filters,
                filterName,
                filterAction,
                levelFunc,
                _coh = _coh;
            
            for (skillName in skills) {
                affixses = _coh.skills[i];
                // incase it's not found in config.
                if (!affixses) continue;
                skillLevel = skills[i];
                for (i = 0, effectName; effectName = affixses[i]; ++i) {
                    effect = _coh.effects[effectName];
                    // incase it's not found in config.
                    if (!effect) continue;
                    filters = effect.filters;
                    levelFunc = effect.levels;
                    for (filterName in filters) {
                        filterAction = filters[filterName];
                        // ignore $1.
                        filterName = filterName.replace(/\$1$/, "");
                        unit.addFilter(filterName, filterAction);
                    }
                }
            }
        }
    };
})();