var coh = coh || {};
(function() {
    var instance;
    
    var getInstance = function() {
        if (!instance) {
            instance = {
                getTilePosition : function(isAttacker, row, column) {
                    return {
                        y : 8 - row - 2,
                        x : 6 + column
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