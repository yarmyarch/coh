var coh = coh || {};
coh.util = (function(){
    var self;
    
    return self = function() {
        isExecutable : function(target) {
            return target instanceof Function && (typeof(target)).toLowerCase() == "function";
        }
    };
})();