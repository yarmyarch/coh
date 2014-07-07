var coh = coh || {};
coh.util = (function(){
    var self;
    
    var buf = {
        riList : {0 : 1}
    }
    
    return self = {
        isExecutable : function(target) {
            return target instanceof Function && (typeof(target)).toLowerCase() == "function";
        },
        
        popRandom : function(arr) {
            var randomIndex = ~~(Math.random() * arr.length);
                inst = arr[randomIndex];
            
            arr[randomIndex] = arr[arr.length - 1];
            arr.length -= 1;
            return inst;
        },
        
        getRandId : function() {
            var ri = 0,
                _buf = buf;
            while (_buf.riList[ri]) {
                ri = (+(Math.random() + "").substring(2,10)).toString(36);
            }
            buf[ri] = 1;
            return ri;
        }
    };
})();