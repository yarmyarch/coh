/**
 * calculator used to get basic attributes of a unit.
 */
 
var coh = coh || {};
coh.utils = coh.utils || {};
(function() {
    var instance;
    
    /**
     * Turns required recharging,
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
    var getInstance = function() {
        if (!instance) {
            instance = {
                getAttack : function(unit) {
                    var attack = unit.getAttack(),
                        level = unit.getLevel();
                },
                getSpeed : function(unit) {
                    
                },
                getHp : function(unit) {
                    
                },
                getTurns : function(speed) {
                    return Math.floor(15 + Math.log(2.72, 1 / Math.pow(x, 3)));
                }
            }
        }
        
        // public static attributes here, if exist.
        
        return instance;
    };
    
    coh.utils.BaseCalculator = function() {
        //getTilePosition
        return getInstance();
    }

    coh.utils.BaseCalculator.getInstance = getInstance;
})();
