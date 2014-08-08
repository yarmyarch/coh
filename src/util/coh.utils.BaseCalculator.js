/**
 * calculator used to get basic attributes of a unit.
 */
 
var coh = coh || {};
coh.utils = coh.utils || {};
(function() {
    var instance;
    
    var getInstance = function() {
        if (!instance) {
            instance = {
                getAttack : function(attack, level) {
                    
                },
                getSpeed : function(speed, level) {
                    
                },
                getHp : function(hp, level) {
                    
                },
                
                /**
                 * Turns required recharging,
                 * t = Math.floor(15 + Math.log(2.72, 1 / Math.pow(x, 3))):
                 *
                 * 0 : infinity
                 * 1 : 15
                 * 2 : 12
                 * 3 : 11
                 * 4 - 5 : 10
                 * 6 - 7 : 9
                 * 8 - 10 : 8
                 * 11 - 14 : 7
                 * 15 - 20 : 6
                 * 21 - 28 : 5
                 * 29 - 39 : 4
                 * 40 - 53 : 3
                 * 55 - 76 : 2
                 * 77 - 106 : 1
                 * 107 + : 0
                 */
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
