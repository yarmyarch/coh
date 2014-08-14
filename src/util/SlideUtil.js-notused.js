//~ usage:
//~ var Fuck = function(){

//~ SlideUtil.run([document.getElementById("Fucker").clientWidth, 10, 0.3, 100, function(target, range, isEnd){
  //~ document.getElementById("Fucker").style.width = target + "px";
//~ }]);

//~ }
var SlideUtil = (function() {
    
    var self,
        arg = arguments;
    
    var buf = {
        interval : false,
        slides : false,
        
        //when self.run() gets a group of new agruments. false after controller.slides.
        newInstance : false,
        
        //assigned with arguments when it's a "newInstance" when validated.
        oriSlides : false
    };
    
    var LC = {
        FLOAT_RANGE : 0.00002,
        PARAM : {
            START : 0,
            END : 1,
            SPEED : 2,
            INTERVAL : 3,
            CALLBACK : 4
        }
    };
    
    var util = {
        /**
         *get the greatest common divisor with Euclidean Algorithm
         */
        getDivisor : function(a, b) {
            
            if (a < b) {
                var c;
                c = a;
                a = b;
                b = c;
            }
            
            while (b != 0) {
                c = a % b;
                a = b;
                b = c;
            }
            
            return a;
        }
    };
    
    var controller = {
        
        /**
         *function that judges the legitimacy of a group of param,
         *also do some basic data transformations.
         *@return array transformed data if legal, false while data not useable.
         */
        judge : function(arg) {
            
            var _lc = LC;
            
            arg[_lc.PARAM.START] = +arg[_lc.PARAM.START];
            arg[_lc.PARAM.END] = +arg[_lc.PARAM.END];
            arg[_lc.PARAM.SPEED] = +arg[_lc.PARAM.SPEED];
            arg[_lc.PARAM.INTERVAL] = Math.abs(+arg[_lc.PARAM.INTERVAL]);
            arg[5] && (arg[5] = +arg[5]);
            
            //set 17(ms) as the floor range.
            arg[_lc.PARAM.INTERVAL] = Math.ceil(arg[_lc.PARAM.INTERVAL] / 17) * 17;
            
            //any param is not a number
            if (isNaN(Math.max(arg[_lc.PARAM.START], arg[_lc.PARAM.END], arg[_lc.PARAM.SPEED], arg[_lc.PARAM.INTERVAL]))) return false;
            
            //~ //the case that when "start" is bigger than "end" while "speed" is bigger than 0 will be treated as illgal, and vice versa.
            //~ //at the same time, speed should not be 0.
            //~ if (arg[_lc.PARAM.SPEED] == 0 || (arg[_lc.PARAM.SPEED] > 0 && arg[_lc.PARAM.START] > arg[_lc.PARAM.END]) || (arg[_lc.PARAM.SPEED] < 0 && arg[_lc.PARAM.START] < arg[_lc.PARAM.END])) return false;
            
            //success
            return arg;
        },
        
        /**
         *@param arrays
         *  arguments[0][0] : start value;
         *  arguments[0][1] : end value;
         *  arguments[0][2] : speed, for example 0.3 for 30% per interval;
         *  arguments[0][3] : interval range, 100(ms) is suit for most cases, 10(ms) is the floor range;
         *  arguments[0][4] : callback function, will be evalued at the end of every interval, reviece param as below:
         *  [arguments[0][5]] : float range, if it's a float slide, the range that defines end tag:
         *@paramForCallback target value;
         *@paramForCallback range value;
         *@paramForCallback isEnd is this interval the last one;
         */
        slide : function() {
            var endTags = [],
                timer = 0,
                _buf = buf,
                _lc = LC,
                slides = buf.slides = [];
            
            var temp;
            //format input data.
            for (var i = 0, len = arguments.length; i < len; ++i) {
                
                temp = controller.judge(arguments[i]);
                
                //skip if illgal
                if (!temp) continue;
                
                slides.push(temp);
                timer = timer || temp[_lc.PARAM.INTERVAL];
                
                //get the greatest common divisor of all intervals.
                timer = util.getDivisor(timer, temp[_lc.PARAM.INTERVAL]);
            }
            
            //update buf
            _buf.newInstance && (_buf.oriSlides = slides);
            
            clearInterval(_buf.interval);
            //let's go!
            slides.length && (_buf.interval = setInterval(function(){
                
                var ranges = [],
                    end = true,
                    isInteger = false;
                for (var i = 0, len = slides.length; i < len; ++i) {
                    
                    if (timer % slides[i][_lc.PARAM.INTERVAL] != 0 || endTags[i]) {
                        end = end && !!endTags[i];
                        continue;
                    }
                    
                    ranges[i] = slides[i][_lc.PARAM.END] - slides[i][_lc.PARAM.START];
                    
                    //end flag judgement
                    if (ranges[i] == 0 ||  Math.abs(ranges[i]) <= slides[i][5] || Math.abs(ranges[i]) <= LC.FLOAT_RANGE) {
                        endTags[i] = 1;
                        end = end && !!endTags[i];
                    
                        //the last callback
                        (slides[i][_lc.PARAM.CALLBACK] instanceof Function) && slides[i][_lc.PARAM.CALLBACK](slides[i][_lc.PARAM.END], ranges[i], !!endTags[i]);
                    
                        continue;
                    } else {
                        endTags[i] = 0;
                        end = end && !!endTags[i];
                    }
                    
                    //range = (end - start) * speed;
                    //start = start + range;
                    isInteger = slides[i][_lc.PARAM.START] === ~~slides[i][_lc.PARAM.START] && slides[i][_lc.PARAM.END] === ~~slides[i][_lc.PARAM.END];
                    slides[i][_lc.PARAM.START] = slides[i][_lc.PARAM.START] + ranges[i] * slides[i][_lc.PARAM.SPEED];
                    isInteger && (slides[i][_lc.PARAM.START] = ranges[i] > 0 ? Math.ceil(slides[i][_lc.PARAM.START]) : Math.floor(slides[i][_lc.PARAM.START]));
                    
                    //callback
                    /**
                     *@param target value
                     *@param range value
                     *@param end tag
                     */
                    (slides[i][_lc.PARAM.CALLBACK] instanceof Function) && slides[i][_lc.PARAM.CALLBACK](slides[i][_lc.PARAM.START], ranges[i], !!endTags[i]);
                }
                
                timer += timer;
                end && clearInterval(_buf.interval);
            }, timer));
            
            _buf.newInstance = false;
        }
    };
    
    /**
     * constructor, not needed for derect call.
     */
    self = function() {
        
        var _buf = buf;
        _buf.newInstance = 1;
        _buf.slides = arg;
    };
    
    self.pause = function() {
        
        clearInterval(buf.interval);
    };
    
    /**
     * continue when paused(no arguments needed) or start a new group of intances.
     *@param see #controller.slide for the detail.
     */
    self.run = function() {
        
        var _buf = buf;
        !!arguments.length && (_buf.newInstance = 1);
        //~ _buf.slides && _buf.slides.length && controller.slide(_buf.slides) || controller.slide.apply({}, arguments);
        if (arguments && arguments.length) {
            controller.slide.apply({}, arguments);
        } else controller.slide(_buf.slides);
    };
    
    self.restore = function() {
        
        var _buf = buf,
            _lc = LC;
        
        for (var i in _buf.oriSlides) {
            _buf.slides[_lc.PARM.END] = _buf.oriSlides[_lc.PARM.START];
        }
        controller.slide(_buf.slides);
    };
    
    /**
     * used to clear current (slided) info, allow the slide rolling again with self.run.
     */
    self.clear = function() {
        
        var _buf = buf,
            _lc = LC;
        
        for (var i in _buf.oriSlides) {
            _buf.slides[_lc.PARM.START] = _buf.oriSlides[_lc.PARM.START];
        }
    };
    
    return self;
})();