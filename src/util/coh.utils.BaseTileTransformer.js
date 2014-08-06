/**
 *@implements MapUtil
 * relay on instance of MapUtil,
 * Decorator of mapUtils.
 *
 * It's departed from mapUtil because it's related to the unit types.
 */

var coh = coh || {};
coh.utils = coh.utils || {};
(function() {
    var instance;
    
    var handlerList = {
        baseTransformer : {
            2 : function(isAttacker, position) {
                if (isAttacker) {
                    position.y += 1;
                }
                return position;
            },
            3 : function(isAttacker, position) {
                if (isAttacker) {
                    //~ position.x -= 1;
                }
                return position;
            },
            4 : function(isAttacker, position) {
                if (isAttacker) {
                    position.y += 1;
                }
                return position;
            }
        }
    };
    
    var getInstance = function(mapUtil) {
        if (!instance) {
            if (!mapUtil) return null;
            instance = {};
            
            for (var i in mapUtil) {
                instance[i] = mapUtil[i];
            };
            
            /**
             * functions modifying results from the tile selectors;
             */
            instance.getTilePosition = function(isAttacker, type, row, column) {
                var position = mapUtil.getTilePosition(isAttacker, type, row, column);
                handlerList.baseTransformer[type] && (position = handlerList.baseTransformer[type](isAttacker, position));
                
                return position;
            };
            
            /**
             * Extra interfaces used when new units out of the initialling process added.
             * It's just totally opposite to the original process, in cases for now.
             */
            instance.transformUpdate = function(isAttacker, type, position) {
                handlerList.baseTransformer[type] && (position = handlerList.baseTransformer[type](!isAttacker, position));
                return position;
            };
            
            /**
             * Get the left bottom tile fo the unitwarp.
             * in a 16X16 map, this tile is just the one it should be placed into the scene.
             */
            instance.getValidTile = function(unitWrap) {
                var tiles = unitWrap.getTileRecords();
                if (!tiles) return null;
                
                var  minX = Number.POSITIVE_INFINITY,
                    maxY = Number.NEGATIVE_INFINITY;
                
                for (var i = 0; tiles[i]; ++i) {
                    minX = Math.min(tiles[i].x, minX);
                    maxY = Math.max(tiles[i].y, maxY);
                }
                
                return {x : minX, y : maxY};
            }
        }
        return instance;
    };
    
    coh.utils.BaseTileTransformer = function(mapUtil) {
        //getTilePosition
        return getInstance(mapUtil);
    }

    coh.utils.BaseTileTransformer.getInstance = getInstance;
})();
