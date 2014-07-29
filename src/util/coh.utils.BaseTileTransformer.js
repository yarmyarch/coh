/**
 *@implements TileSelector
 * relay on instance of TileSelector,
 * Decorator of tileSelectors.
 *
 * It's departed from tileSelector because it's related to the unit types.
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
    
    var getInstance = function(tileSelector) {
        if (!instance) {
            if (!tileSelector) return null;
            instance = {};
            
            for (var i in tileSelector) {
                instance[i] = tileSelector[i];
            }
            instance.getTilePosition = function(isAttacker, type, row, column) {
                var position = tileSelector.getTilePosition(isAttacker, type, row, column);
                handlerList.baseTransformer[type] && (position = handlerList.baseTransformer[type](isAttacker, position));
                
                return position;
            }
        }
        return instance;
    };
    
    coh.utils.BaseTileTransformer = function(tileSelector) {
        //getTilePosition
        return getInstance(tileSelector);
    }

    coh.utils.BaseTileTransformer.getInstance = getInstance;
})();
