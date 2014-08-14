var coh = coh || {};
coh.Util = (function(){
    var self;
    
    var LC = {
        MAP_EN : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(''),
        MAP_DE : {}
    };
    
    var buf = {
        riList : {0 : 1}
    }
    
    // initialize map for base64.
    for(var i=0; i<64; i++)
        LC.MAP_DE[LC.MAP_EN[i]] = i;
    
    
    return self = {
        isExecutable : function(target) {
            return target instanceof Function && (typeof(target)).toLowerCase() == "function";
        },
        
        getRandom : function(arr) {
            return arr[~~(Math.random() * arr.length)];
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
        },
        
        /**
         * return the a string whose first letter is in uppercase.
         */
        getFUStr : function(str) {
            return str[0].toUpperCase() + str.substr(1);
        },
                
        /**
         * get the function of the target line:
         * y = kx + c,
         * let's say the original line constructed by a and b is 
         * y = -1/k * x + d,
         * while -1/k = (b.y - a.y) / (b.x - a.x).
         *@param a {Point} start position.
         *@param b {Point} ending position.
         */
        getBesierMidPos : function(a, b) {
            var midPos = {x : (b.x + a.x) / 2, y : (b.y + a.y) / 2},
                //~ k = (a.x - b.x) / (b.y - a.y),
                //~ c = midPos.y - k * midPos.x,
                halfDist = Math.sqrt(Math.pow(a.y - b.y, 2) + Math.pow(a.x - b.x, 2)) / 2;
            
            // The line found, let's get a rand position from the line.
            // Don't be too far away from the midPos. 
            // The max distance should be less than half of the distance between a and b.
            
            return target = {x : midPos.x + Math.round(Math.random(halfDist * 2) - halfDist), y : midPos.y};
        },
        
        base64Encode : function(data) {
            var buf = [],
                map = LC.MAP_EN,
                n = data.length,
                val,
                i = 0;

            while(i < n) {
                val = (data[ i ] << 16) |
                    (data[i+1] << 8) |
                    (data[i+2]);
                
                buf.push(map[val>>18],
                    map[val>>12 & 63],
                    map[val>>6 & 63],
                    map[val & 63]);
                i += 3;
            }

            if(n%3 == 1) buf.pop(),buf.pop(),buf.push('=', '=');
            else buf.pop(),buf.push('=');

            return buf.join('');
        },

        base64Decode : function(str) {
            var buf = [],
                arr = str.split(''),
                map = LC.MAP_DE,
                n = arr.length,
                val,
                i=0;

            if(n % 4) return false;

            while(i < n) {
                val = (map[arr[ i ]] << 18) |
                    (map[arr[i+1]] << 12) |
                    (map[arr[i+2]] << 6)  |
                    (map[arr[i+3]]);

                buf.push(val>>16, val>>8 & 0xFF, val & 0xFF);
                i += 4;
            }

            while(arr[--n] == '=')
                buf.pop();

            return buf;
        }
    };
})();