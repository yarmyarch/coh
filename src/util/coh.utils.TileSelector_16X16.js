/**
 *@implements TileSelector
 */
 
var coh = coh || {};
coh.utils = coh.utils || {};
(function() {
    var instance;
    
    var getInstance = function() {
        if (!instance) {
            instance = {
                getTilePosition : function(isAttacker, type, row, column) {
                    var x = 4 + column,
                        y = !isAttacker ? 9 + row : 6 - row;
                    
                    return {
                        x : x,
                        y : y
                    };
                },
                
                /**
                 * Magic...
                 */
                getTilePositionFromCoord : function(screenWidth, screenHeight, posX, posY) {
                    var rangeX = screenWidth / 16,
                        rangeY = screenHeight / 16;
                    
                    return {
                        x : ~~(posX / rangeX) + 2,
                        y : ~~(posY / rangeY)
                    }
                },
                
                /**
                 * return available tiles for current turn.
                 * When it's the attacker's turn, those tiles of the defender should be ignored.
                 */
                filterTurnedTiles : function(isAttacker, x, y) {
                    x = Math.min(Math.max(x, 4), 12);
                    y = !isAttacker ? Math.min(Math.max(y, 1), 7) : Math.min(Math.max(y, 6), 14);
                    return {x : x, y : y};
                }
            }
        }
        return instance;
    };
    
    coh.utils.TileSelector_16X16 = function() {
        //getTilePosition
        return getInstance();
    }

    coh.utils.TileSelector_16X16.getInstance = getInstance;
})();
