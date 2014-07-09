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
                        y = isAttacker ? 8 + row : 5 - row;
                    
                    return {
                        x : x,
                        y : y
                    };
                },
                getTilePositionFromCoord : function(screenWidth, screenHeight, posX, posY) {
                    var rangeX = screenWidth / 16,
                        rangeY = screenHeight / 16;
                    
                    return {
                        x : ~~(posX / rangeX),
                        y : 14 - ~~(posY / rangeY)
                    }
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