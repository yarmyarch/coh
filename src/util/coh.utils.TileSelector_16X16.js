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
                
                /**
                 * WARNING!!
                 * The function cc.TMXMapLayer.getTileAt returns the left top tile for x0/y0.
                 * For the unit at the left bottom cornor, let's say having the row 6 and column 0, 
                 * The expected coorp should be x : 4, y : 1,
                 * While tile position should be x : 4, y : 14 in order to get the correct tile.
                 *
                 * This is what this function should do.
                 */
                getTilePosition : function(isAttacker, type, row, column) {
                    var x = 4 + column,
                        y = isAttacker ? 9 + row : 6 - row;
                    
                    return {
                        x : x,
                        y : y
                    };
                },
                
                /**
                 * Magic...
                 */
                getTileFromCoord : function(screenWidth, screenHeight, posX, posY) {
                    var rangeX = screenWidth / 16,
                        rangeY = screenHeight / 16;
                    
                    return {
                        x : ~~(posX / rangeX) + 2,
                        y : ~~(posY / rangeY)
                    }
                },
                
                /**
                 * return ligle X range that's allowed having an unit, from left to right.
                 * return [4-12].
                 */
                getXRange : function() {
                    return [4, 5, 6, 7, 8, 9, 10, 11];
                },
                
                /**
                 * return ligle Y range that's allowed having an unit.
                 * it depends on the current turn is the attacker turn or not.
                 * note that as shared rows, the row 7 and 8, would be attached to the attacker/defender dynamicly accroding to the game ruels.
                 * the order of the returnd array is the searching order.
                 */
                getYRange : function(isAttacker) {
                    if (isAttacker)
                        return [7, 8, 9, 10, 11, 12, 13, 14];
                    else return [8, 7, 6, 5, 4, 3, 2, 1];
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
