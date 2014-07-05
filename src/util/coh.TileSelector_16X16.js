var coh = coh || {};
(function() {
    var instance;
    
    var getInstance = function() {
        if (!instance) {
            instance = {
                getTilePosition : function(isAttacker, row, column) {
                    return {
                        x : 4 + column,
                        y : isAttacker ? 8 + row : 5 - row
                    };
                }
            }
        }
        return instance;
    };
    
    coh.TileSelector_16X16 = function() {
        //getTilePosition
        return getInstance();
    }

    coh.TileSelector_16X16.getInstance = getInstance;
})();