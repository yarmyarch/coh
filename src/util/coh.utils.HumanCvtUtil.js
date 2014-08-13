/**
 *@implements ConvertUtil
 */
var coh = coh || {};
coh.utils = coh.utils || {};
(function() {
    var instance;
    
    var getInstance = function() {
        if (!instance) {
            instance = {
                
            };
        }
        return instance;
    };
    
    coh.utils.HumanCvtUtil = function() {
        //getTilePosition
        return getInstance();
    }

    coh.utils.HumanCvtUtil.getInstance = getInstance;
})();
