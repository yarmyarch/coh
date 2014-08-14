/**
 *@implements ConvertUtil
 */
var coh = coh || {};
coh.utils = coh.utils || {};
(function() {
    var instance;
    
    // indexed by avaliable convert types.
    var handlerList = {
        1 : function(unitFrom, unitTo) {
            unitFrom.charge();
            // XXXXXX TO BE ADDED : faction related features.
        }, 
        2 : function(unitFrom, unitTo) {
            if (unitFrom == unitTo) {
                // index == 0, the elite unit itself.
                unitFrom.charge();
            } else {
                unitFrom.convertTo(unitTo);
            }
        }
    }
    
    var getInstance = function() {
        if (!instance) {
            instance = {
                convert : function(unitFrom, unitTo, cType) {
                    handlerList[cType] && handlerList[cType](unitFrom, unitTo, index);
                }
            };
        }
        return instance;
    };
    
    coh.utils.BaseCvtUtil = function() {
        //getTilePosition
        return getInstance();
    }

    coh.utils.BaseCvtUtil.getInstance = getInstance;
})();
