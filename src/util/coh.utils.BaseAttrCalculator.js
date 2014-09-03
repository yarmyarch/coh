/**
 * Calculator used to get basic attributes of a unit.
 */
 
var coh = coh || {};
coh.utils = coh.utils || {};
(function() {
    var instance;
    
    var LC = {
        ADDITIONS : {
            // type 2: elite units defined in coh.LocalConfig.UNIT_TYPES.
            2 : {
                attack : 2.5,
                hp : 2,
                speed : 0.5
            },
            // type 3: tanks defined in coh.LocalConfig.UNIT_TYPES.
            3 : {
                attack : 1.5,
                hp : 3.5,
                speed : 0.5
            },
            // type 4: champions defined in coh.LocalConfig.UNIT_TYPES.
            4 : {
                attack : 9,
                hp : 5,
                speed : 1/3
            }
        }
    };
    
    var buf = {
        instances : {}
    };
    
    var getInstance = function(maxLevel) {
        
        var _coh = coh;
        if (!maxLevel) maxLevel = _coh.LocalConfig.UNIT.MAX_LEVEL;
        
        // Would the "floor" be a problem as it's float calculating? Think not. Mind it here if it does.
        if (!buf.instances[maxLevel]) {
            buf.instances[maxLevel] = {
                /**
                 * level 1 - 0.22 of max;
                 * level max - 1 of max;
                 */
                getAttack : function(unit) {
                    var attack = unit.getAttack(),
                        level = unit.getLevel(),
                        rate = Math.floor(0.5 * Math.pow(4 / maxLevel * level, 0.5) * 100) / 100;
                    
                    // rate is always 1 when level equals max level.
                    // make it modifible from outside for expanditions.
                    rate = coh.FilterUtil.applyFilters("getAttackModifier", rate, unit);
                    
                    // modifiers from types.
                    attack = attack * (LC.ADDITIONS[unit.getType()] && LC.ADDITIONS[unit.getType()].attack || 1);
                    return Math.floor(rate * attack);
                },
                
                /**
                 * level 1 - 0.22 of max;
                 * level max - 1 of max;
                 */
                getHp : function(unit) {
                    var hp = unit.getHp(),
                        level = unit.getLevel(),
                        rate = Math.floor(0.5 * Math.pow(4 / maxLevel * level, 0.5) * 100) / 100;
                    
                    rate = coh.FilterUtil.applyFilters("getHpModifier", rate, unit);
                    
                    hp = hp * (LC.ADDITIONS[unit.getType()] && LC.ADDITIONS[unit.getType()].hp || 1);
                    return Math.floor(rate * hp);
                },
                
                /**
                 * level 1 - 0.54 of max;
                 * level max - 1 of max.
                 */
                getSpeed : function(unit) {
                    var speed = unit.getSpeed(),
                        level = unit.getLevel()
                        rate = Math.floor(Math.pow(1 / maxLevel * level, 0.2) * 100) / 100;
                    
                    rate = coh.FilterUtil.applyFilters("getSpeedModifier", rate, unit);
                    
                    speed = speed * (LC.ADDITIONS[unit.getType()] && LC.ADDITIONS[unit.getType()].speed || 1);
                    return Math.floor(rate * speed);
                },
                
                /**
                 * Duration required recharging,
                    t = Math.floor(15 + Math.log(2.72, 1 / Math.pow(x, 3))):
                        0 : infinity
                        1 : 15
                        2 : 12
                        3 : 11
                        4 - 5 : 10
                        6 - 7 : 9
                        8 - 10 : 8
                        11 - 14 : 7
                        15 - 20 : 6
                        21 - 28 : 5
                        29 - 39 : 4
                        40 - 53 : 3
                        55 - 76 : 2
                        77 - 106 : 1
                        107 + : 0
                 */
                getDuration : function(speed) {
                    return Math.floor(15 + Math.log(2.72, 1 / Math.pow(x, 3)));
                }
            }
        }
        
        // public static attributes here, if exist.
        
        return buf.instances[maxLevel];
    };
    
    coh.utils.BaseAttrCalculator = function(maxLevel) {
        //getTilePosition
        return getInstance(maxLevel);
    }

    coh.utils.BaseAttrCalculator.getInstance = getInstance;
})();
