/**
 *@require {Battle}: Utils for battle scene.
 */
var coh = coh || {};

(function() {

/**
 * Operations related to heros, including decorations to the basic UnitObject generated from Unit.
 */
coh.Hero = (function() {
    
    var self,
        _coh = coh,
        LC = _coh.LocalConfig;

    var util = {
        /**
         * @return object with items in each occupations, plus an index "level",
         * that tells how much levels in total exists in the history.
         */
        getLeveledOccupation : function(levels) {
            var historyLevel = 0,
                maxLevel = LC.UNIT.MAX_LEVEL,
                ocpt = {
                    level : 0
                },
                i, attribute;
            
            if (!levels) return;
            
            for (i in levels) {
                for (attribute in levels[i]) {
                    ocpt[attribute] = ocpt[attribute] || 0;
                    ocpt[attribute] += (levels[i] / maxLevel) * _coh.occupations[i][attribute];
                }
                ocpt.level += levels[i];
            }
            return ocpt;
        }
    };
    
    // react filters here.
    
    // Render growth of the hero. Data from calculators, such as coh.utils.BaseCalculator
    _coh.utils.FilterUtil.addFilter("getAttackModifier", function(levelRate, unit) {
        // The growth could be in the saved data of a player, or in the unit settings.
        // XXXXXX Now let's try to find the player that's having the hero, in order to get required info.
        // eg. getModifier.
        var level = unit.getLevel(),
            modifier = unit.getModifier();
        
        return levelRate * (1 + (modifier - 1) * (1 - level / _coh.LocalConfig.UNIT.MAX_LEVEL));
        
    });
    
    /**
     * extea actions appended for hero units.
     */
    _coh.utils.FilterUtil.addFilter("heroGenerated", function(unit) {
        
        // New buffer for the hero unit.
        var inner_buf = {
            type : 0,
            occupation : null,
            levels : null,
            historyOcpt : null
        };
        
        /**
         * types chould be changed for heros.
         * the attribute "type" would be from inner_buf, that's over covering the on (if exist) from common configs.
         */
        unit.setType = function(newType) {
            inner_buf.type = newType;
        };
        unit.getType = function() {
            return _coh.utils.FilterUtil.applyFilters("unitAttributeType", inner_buf.type, unit);
        };
        
        /**
         * Set level history for the unit, the level history won't include it's current occupation.
         * Attack/Hp/Speeds would be generated from the level history.
         * The object may look like this:
            {
                <occupation name> : <level>,
                // ... other occupations here.
            }
         */
        unit.setLevels = function(levels) {
            inner_buf.levels = levels;
            // it should be regenerated once the history level changed.
            inner_buf.historyOcpt = null;
        };
        unit.getLevels = function(levels) {
            return inner_buf.levels;
        };
        
        unit.setOccupation = function(ocptName) {
            inner_buf.occupation = _coh.occupations[ocptName];
        };
        unit.getOccupation = function(ocptName) {
            return inner_buf.occupation;
        };
        
        /**
         * There must be a more simple solution for heros.
         * Bingo! I found it!
         * getAttack and other functions regenerated here via it's current occupation.
         */
        for (var i in _coh.occupations[_buf.occupation]) {
            unit["get" + _coh.Util.getFUStr(i)] = (function(attribute) {
                return function() {                    
                    // here we go.
                    var _buf = inner_buf,
                        maxLevel = LC.UNIT.MAX_LEVEL,
                        maxAttr = 0;
                    if (!_buf.levels || !_buf.occupation) return 0;
                    
                    _buf.historyOcpt = _buf.historyOcpt || util.getLeveledOccupation(_buf.levels);
                    
                    maxAttr = _buf.historyOcpt[attribute] + (1 - _buf.historyOcpt.level / maxLevel) * _coh.occupations[_buf.occupation][attribute];
                    
                    // No ceil. This step would be handled in calculator.
                    //~ return Math.ceil(maxAttr);
                    return _coh.utils.FilterUtil.applyFilters("unitAttribute" + _coh.Util.getFUStr(attribute), maxAttr, unit);
                };
            })(i);
        }
        
        // Use the newly affected unit instead of the original one.
        // Actually it's not necessary returning this, as in js it's pointers parsed... Never mind, who nows.
        return unit;
    });
    
    return self = {
        
    };
})();

})();