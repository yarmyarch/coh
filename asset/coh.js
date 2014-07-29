
var coh = coh || {};
coh.LocalConfig = {
    COLOR : {
        GREEN : 1,
        RED : 2,
        BLUE : 3
    },
    LOCATION_TYPE : {
        // 0 - reserved
        // [row count<y>, column count<x>]
        1 : [1,1],
        2 : [2,1],
        3 : [1,2],
        4 : [2,2]
    },
    CONVERT_TYPE : {
        // possible location type may create a convert.
        1 : [
            [1], 
            [1], 
            [1]
        ],
        2 : [
            [2], 
            [2], 
            [1], 
            [1]
        ],
        3 : [
            [1, 1, 1]
        ],
        4 : [
            [3, 3], 
            [1, 1]
        ],
        5 : [
            [4, 4], 
            [4, 4], 
            [1, 1], 
            [1, 1]
        ]
    },
    STATUS_BLANK : 0,
    STATUS_OCCUPIED : 1,
    COLOR_COUNT : 3,
    BLANK_DATA_GROUP : [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ],
    // frame rate for general animations.
    FRAME_RATE : 1/60,
    
    ASSAULT_DEATA : 1 / 6 * 100,
    ASSAULT_RATE : 1 / 3,
    EXILE_RATE : 1 / 6,
    
    
    BLINK_RATE : 0.618,
    COLOR_CONFIG : {
        ELF : ["blue", "white", "gold"]
    },
    NO_COLOR : -1,
    
    MAP_BATTLE_LAYER_NAME : "battleField",
    
    SPRITE_SCALE : {
        1 : 1.25,
        2 : 1.2,
        3 : 1.25,
        4 : 1.1
    },
    
    PRE_RAND_ID : "YarRi_",
    
    // priority when drawn in the canvas.
    Z_INDEX : {
        BACKGROUND : 0,
        CONTENT : 10,
    },
    
    ATTACKER_FOCUS_COLOR : new cc.Color(55, 229, 170, 204),
    DEFENDER_FOCUS_COLOR : new cc.Color(200, 50, 120, 204),
    UNIT_DELETE_COLOR : new cc.Color(64, 64, 64, 204)
};var coh = coh || {};

// ui related config exists in resource.js
coh.units = {
    archer : {
        type : 1,
        // lower priority results in a closer position to the front line.
        priority : 10
    },
    knight : {
        type : 2,
        priority : 10
    },
    paladin : {
        type : 4,
        priority : 10
    }
};var coh = coh || {};
coh.res = {
    //image
    //plist
    //fnt
    //tmx
    //bgm
    //effect
    
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    
    map : {
        districts : {
            forest : "res/tmxmap/forest.tmx"
        },
        battle : {
            field_16X16 : "res/tmxmap/battle_16X16.tmx"
        }
    },
    imgs : {
        market : "res/tmxmap/b_market.jpg",
        forest : "res/tmxmap/forest.jpg",
        shadow : "res/imgs/shadow.png",
        arrow : "res/imgs/arrow.png",
        cornor : "res/imgs/corner.png",
        blank : "res/imgs/blank.png",
    },
    sprite : {
        awen : {
            walking : {
                plist : "res/sprite/sprite.plist",
                img : "res/sprite/imgs/sprite.png"
            }
        },
        /**
         * geneted by unit generator.
        archer : {
            idle : {
                plist : "res/sprite/archer_idle.plist",
                img_0 : "res/sprite/imgs/archer_blue.png?v=1",
                img_1 : "res/sprite/imgs/archer_gold.png?v=1",
                img_2 : "res/sprite/imgs/archer_white.png?v=1"
            }
        },
        */
    }
};

(function() {
    /**
     * Generate pure resource object without layer.
     */
    var generateRes = function(obj) {
        var result = [];
        for (var i in obj) {
            if (obj[i] instanceof Object) {
                result = result.concat(generateRes(obj[i]));
            } else {
                result.push(obj[i]);
            }
        }
        return result;
    };
    
    /**
     * Full fill the configs of sprite from coh.units.
     */
    var generateUnits = function(resObj) {
        var _coh = coh;
        for (var i in _coh.units) {
            resObj.sprite[i] = {};
            resObj.sprite[i].idle = {
                plist : "res/sprite/" + i + "_idle.plist",
                img_0 : "res/sprite/imgs/" + i + "_blue.png",
                img_1 : "res/sprite/imgs/" + i + "_gold.png",
                img_2 : "res/sprite/imgs/" + i + "_white.png"
            };
            // XXXXXX TO BE ADDED
            resObj.sprite[i].assult = {
                plist : "res/sprite/" + i + "_idle.plist",
                img_0 : "res/sprite/imgs/" + i + "_blue.png",
                img_1 : "res/sprite/imgs/" + i + "_gold.png",
                img_2 : "res/sprite/imgs/" + i + "_white.png"
            };
        }
        return resObj;
    };
    
    coh.resources = generateRes(generateUnits(coh.res));
})();

/**
XXXXXX
TODO : 
    set sprite: run/walk in Actor;
    Animations on units initialized;
*/var coh = coh || {};
coh.Util = (function(){
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
})();//~ usage:
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
})();/**
 *@implements TileSelector
 */
 
var coh = coh || {};
coh.utils = coh.utils || {};
(function() {
    var instance;
    
    var getInstance = function() {
        if (!instance) {
            instance = {
                
                /**
                 * WARNING!!
                 * The function cc.TMXMapLayer.getTileAt returns the left top tile for x0/y0.
                 * For the unit at the left bottom cornor, let's say having the row 6 and column 0, 
                 * The expected coorp should be x : 4, y : 1,
                 * While tile position should be x : 4, y : 14 in order to get the correct tile.
                 *
                 * This is what this function should do.
                 * SHHHHHHHHHHHHHHHHHHHIT ignore me. Ignore what's in front.
                 */
                getTilePosition : function(isAttacker, type, row, column) {
                    var x = 4 + column,
                        y = !isAttacker ? 9 + row : 6 - row;
                    
                    return {
                        x : x,
                        y : y
                    };
                },
                
                /**
                 * Magic...
                 */
                getTileFromCoord : function(screenWidth, screenHeight, posX, posY) {
                    var rangeX = screenWidth / 16,
                        rangeY = screenHeight / 16;
                    
                    return {
                        x : ~~(posX / rangeX) + 2,
                        y : ~~(posY / rangeY)
                    }
                },
                
                /**
                 * return ligle X range that's allowed having an unit, from left to right.
                 * return [4-12].
                 */
                getXRange : function() {
                    return [4, 5, 6, 7, 8, 9, 10, 11];
                },
                
                /**
                 * return ligle Y range that's allowed having an unit.
                 * it depends on the current turn is the attacker turn or not.
                 * note that as shared rows, the row 7 and 8, would be attached to the attacker/defender dynamicly accroding to the game ruels.
                 * the order of the returnd array is the searching order.
                 */
                getYRange : function(isAttacker) {
                    if (isAttacker)
                        return [7, 8, 9, 10, 11, 12, 13, 14];
                    else return [8, 7, 6, 5, 4, 3, 2, 1];
                },
                
                /**
                 * !!!!!!!!!!!!! NOT USED ALREADY
                 * return available tiles for current turn.
                 * When it's the attacker's turn, those tiles of the defender should be ignored.
                 */
                filterTurnedTiles : function(isAttacker, x, y) {
                    x = Math.min(Math.max(x, 4), 11);
                    y = !isAttacker ? Math.min(Math.max(y, 1), 8) : Math.min(Math.max(y, 7), 14);
                    return {x : x, y : y};
                }
            }
        }
        return instance;
    };
    
    coh.utils.TileSelector_16X16 = function() {
        //getTilePosition
        return getInstance();
    }

    coh.utils.TileSelector_16X16.getInstance = getInstance;
})();
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
                if (!isAttacker) {
                    position.y += 1;
                }
                return position;
            },
            3 : function(isAttacker, position) {
                if (!isAttacker) {
                    //~ position.x -= 1;
                }
                return position;
            },
            4 : function(isAttacker, position) {
                if (!isAttacker) {
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
/**
 * Usage:
    var handler1 = function(oriValue, param1, param2, param3){
            return oriValue * param1 + param2;
        };
    var handler2 = function(oriValue, param1, param2, param3){
            return oriValue * param2 + param3;
        };
    FilterUtil.addFilter("filterName", handler1, 11);
    FilterUtil.addFilter("filterName", handler2);
    
    // 0 - originalValue;
    // 1 - param1;
    // 2 - param2;
    // 3 - param3;
    FilterUtil.applyFilters("filterName", 0, 1,2,3);
    // returned result from handler2 as a new originalValue: 0 * 2 + 3;
    // get result from handler1: 3 * 1 + 2
    // final result returned: 5.
    
    FilterUtil.removeFilter("filterName", handler1, 12);
 */

var coh = coh || {};
coh.utils = coh.utils || {};

coh.utils.FilterUtil = (function() {
    
    var self;
    
    var buf = {
        filters : {}
    };
    
    return self = {
        
        /**
         * @param handler {Function} function(lastReturnedValue, [argument1, [argument2, [...]]])
         * @param priority {int} defaultly set 10. The smaller, the higher priority.
         */
        addFilter : function(filterName, handler, priority) {
            var _buf = buf,
                priority = (undefined === priority) && 10 || priority;
            
            !_buf.filters[filterName] && (_buf.filters[filterName] = {});
            
            if (!_buf.filters[filterName][priority]) {
                _buf.filters[filterName][priority] = [];
            }
            
            (handler instanceof Function) && _buf.filters[filterName][priority].push(handler);
        },
        
        removeFilter : function(filterName, handler, priority) {
            var _buf = buf,
                filters, result = [],
                priority = (undefined === priority) && 10 || priority;
            
            if (!_buf.filters[filterName]) return false;
            
            filters = _buf.filters[filterName][priority];
            for (var i in filters) {
                if (filters[i] != handler) result.push(filters[i]);
            }
            
            _buf.filters[filterName][priority] = result;
            return true;
        },
        
        applyFilters : function(filterName, originalValue) {
            var _buf = buf,
                priorities = _buf.filters[filterName],
                filterList,
                filter,
                value = originalValue,
                arg = [],
                i, j, leni, lenj;
            
            if (!priorities) return value;
            
            for (i in priorities) {
                filterList = priorities[i];
                for (j = 0, lenj = filterList.length; j < lenj; ++j) {
                    // rebuild arguments for next filter. 
                    // first param is currend calculated value, additional arguments can be parsed via the input.
                    arg = [value].concat([].slice.call(arguments, 2));
                    (filterList[j] instanceof Function) && (value = filterList[j].apply({}, arg));
                }
            }
            
            return value;
        },
        
        clearFilters : function(filterName) {
            var _buf = buf;
            
            _buf.filters[filterName] = {};
        }
    }
    
})();/**
 * UI Components class, the highlight cursor when focusing on an unit.
 */
var coh = coh || {};
coh.cpns = coh.cpns || {};
(function() {

// global static properties for the class Cursor.
var g_lc = {
    CORNOR_SCALE : 0.18,
    DIRECT_SCALE : 0.5,
    FOCUS_BLINK : cc.repeatForever(cc.sequence(cc.fadeTo(0.618, 64), cc.fadeTo(0.618, 204)))
};

var g_buf = {
    movebyList : {}
};

var g_util = {
    getMoveBy : function(width, height, xRate, yRate) {
        var id = [].join.call(arguments, "_"),
            moveBy = g_buf.movebyList[id],
            _coh = coh;
        
        if (!moveBy) {
            
            moveBy = cc.repeatForever(cc.sequence(
                cc.moveBy(coh.LocalConfig.BLINK_RATE, cc.p(width * xRate, height * yRate)),
                cc.moveBy(coh.LocalConfig.BLINK_RATE, cc.p(width * xRate * -1, height * yRate * -1))
            ));
            
            g_buf.movebyList[id] = moveBy;
        }
        
        return moveBy;
    }
};

coh.cpns.Cursor = cc.Node.extend({
    bgColor : coh.LocalConfig.ATTACKER_FOCUS_COLOR,
    actColor : coh.LocalConfig.UNIT_DELETE_COLOR,
    focusedNode : null,
    background : null,
    arrowRight : null,
    arrowLeft : null,
    arrowDirection : null,
    ctor : function(newColor) {
        
        var _coh = coh;
        
        this._super();
        
        this.background = cc.Sprite.create(_coh.res.imgs.blank);;
        this.arrowRight = cc.Sprite.create(_coh.res.imgs.cornor);
        this.arrowLeft = cc.Sprite.create(_coh.res.imgs.cornor);
        this.arrowDirection = cc.Sprite.create(_coh.res.imgs.arrow);
        
        this.arrowRight.attr({
            anchorX : 1,
            anchorY : 1,
            scale : g_lc.CORNOR_SCALE
        });
        this.arrowLeft.attr({
            anchorX : 1,
            anchorY : 1,
            scale : g_lc.CORNOR_SCALE,
            rotation : 180
        });
        this.background.attr({
            anchorX : 0,
            anchorY : 0
        });
        this.arrowDirection.attr({
            scale : g_lc.DIRECT_SCALE
        });
        
        this.addChild(this.background, _coh.LocalConfig.Z_INDEX.BACKGROUND);
        this.addChild(this.arrowRight, _coh.LocalConfig.Z_INDEX.CONTENT);
        this.addChild(this.arrowLeft, _coh.LocalConfig.Z_INDEX.CONTENT);
        this.addChild(this.arrowDirection, _coh.LocalConfig.Z_INDEX.CONTENT);
        
        this.setBgColor(newColor);
        
        this.background.runAction(g_lc.FOCUS_BLINK);
    },
    
    /**
     * Move the cursor to the target location, with the same width/height.
     * If you would like this cursor be at the same place as you might have expected,
     * Make sure the node parsed is at the same layer with the cursor.
     */
    locateTo : function(node, isAttacker, color) {
        
        if (this.focusedNode == node) return;
        
        var frameRate = coh.LocalConfig.FRAME_RATE * 5,
            _cohView = coh.View;
        
        this.anchorX = node.anchorX;
        this.anchorY = node.anchorY;
        this.width = node.width;
        this.height = node.height;
        
        this.arrowLeft.x = 0;
        this.arrowLeft.y = 0;
        
        this.arrowDirection.setVisible(true);
        this.arrowDirection.rotation = isAttacker ? 180 : 0;
        this.arrowDirection.x = node.width / 2;
        this.arrowDirection.y = isAttacker ? 50 - node.y : this.parent.height - node.y - 50;
        
        this.background.setColor(color || this.bgColor);
        
        // animation related part.
        if (!this.focusedNode) {
            this.x = node.x;
            this.y = node.y;
            
            this.arrowRight.x = node.width;
            this.arrowRight.y = node.height;
            
            this.background.scaleX = node.width / this.background.width;
            this.background.scaleY = node.height / this.background.height;
        } else {
            this.stopAllActions();
            this.runAction(cc.moveTo(frameRate, node.x, node.y));
            
            _cohView.tryStopAction(this.arrowRight, this.arrowRight.moveAction);
            this.arrowRight.runAction(this.arrowRight.moveAction = cc.moveTo(frameRate, node.width, node.height));
        
            _cohView.tryStopAction(this.background, this.background.scaleAction);
            this.background.runAction(
                this.background.scaleAction = cc.scaleTo(frameRate, node.width / this.background.width, node.height / this.background.height)
            );
        }
        
        this.setVisible(true);
        
        // create simple animations
        this.runFocusAnimat(isAttacker);
        
        this.focusedNode = node;
    },
    
    focusOn : function(node, isAttacker, color) {
        
        this.background.setColor(color || this.actColor);
        
        this.stopFocusAnimat(isAttacker);
        this.arrowDirection.setVisible(false);
        
        this.focusedNode = node;
    },
    
    exile : function(node, isAttacker, color) {
        
        this.background.setColor(color || this.bgColor);
        
        //~ this.arrowDirection.setVisible(false);
        this.arrowDirection.setRotation(isAttacker ? 0 : 180);
        
        this.focusedNode = node;
    },
    
    hide : function() {
        this.setVisible(false);
        this.focusedNode = null;
    },
    
    setBgColor : function(newColor) {
        if (newColor instanceof cc.Color) {
            this.bgColor = newColor;
        }
    },
    
    setActColor : function(newColor) {
        if (newColor instanceof cc.Color) {
            this.actColor = newColor;
        }
    },
    
    getFocusAnimate : function(isAttacker) {
        return {
            ar : g_util.getMoveBy(
                this.arrowRight.width * g_lc.CORNOR_SCALE, 
                this.arrowRight.height * g_lc.CORNOR_SCALE, 
                0.382, 
                0.382
            ),
            al : g_util.getMoveBy(
                this.arrowLeft.width * g_lc.CORNOR_SCALE, 
                this.arrowLeft.height * g_lc.CORNOR_SCALE, 
                -0.382, 
                -0.382
            ),
            ad : g_util.getMoveBy(
                this.arrowDirection.width * g_lc.DIRECT_SCALE, 
                this.arrowDirection.height * g_lc.DIRECT_SCALE, 
                0, 
                0.382 * (isAttacker ? 1 : -1)
            )
        }
    },
    
    runFocusAnimat : function(isAttacker) {
        var animate = this.stopFocusAnimat(isAttacker);
        
        this.arrowRight.runAction(animate.ar);
        this.arrowLeft.runAction(animate.al);
        this.arrowDirection.runAction(animate.ad);
    },
    
    stopFocusAnimat : function(isAttacker) {
        
        var animate = this.getFocusAnimate(isAttacker),
            _cohView = coh.View;
        
        // there would be an error if the action doesn't exist.
        _cohView.tryStopAction(this.arrowRight, animate.ar);
        _cohView.tryStopAction(this.arrowLeft, animate.al);
        _cohView.tryStopAction(this.arrowDirection, animate.ad);
        return animate;
    }
});

})();var coh = coh || {};
/**
 * Logics and utils related to the global view sight.
 */
coh.View = (function() {
    
    var self;
    
    var buf = {
        spriteCache : cc.spriteFrameCache,
        animations : {},
        animFrames : {}
    }
    
    return self = {
        moveMap : function(position, callback) {
            var map = coh.map,
                curPosition = map.getPosition(),
                isEndX = false,
                isEndY = false;
            
            var doCallback = function() {
                isEndX && isEndY && callback && callback();
            };
            
            SlideUtil.run([curPosition.x, position.x, 0.3, 40, function(target, range, isEnd){
                map.setPosition(target, map.getPosition().y);
                isEndX = isEnd;
                doCallback();
            }, 0.5], [curPosition.y, position.y, 0.3, 40, function(target, range, isEnd){
                map.setPosition(map.getPosition().x, target);
                isEndY = isEnd;
                doCallback();
            }, 0.5]);
        },
        
        setSprite: function() {
            
        },
        
        locateNode: function(node) {
            var map = coh.map,
                winSize = cc.director.getWinSize();
            
            map.setPosition(-node.x - node.width/2 + winSize.width / 2, -node.y - node.height/2  + winSize.height / 2);
        },
        
        moveMapToNode: function(node, callback) {
            var map = coh.map,
                winSize = cc.director.getWinSize();
            
            self.moveMap({x : -node.x - node.width/2 + winSize.width / 2, y : -node.y - node.height/2  + winSize.height / 2}, callback);
        },
    
        /**
         *@param [spriteConfig], configurations related to the animation.
         *  each property is having default values.
            {
                rate : frame rate, LC.FRAME_RATE for default.
                cons : sprite constructor. cc.Sprite for default.
                color : color, 0/1/2,
                animMode : animation mode constructor, cc.RepeatForever for default.
            }
         */
        getSprite : function(unitName, animationName, spriteConfig) {
            
            var action,
                sprite,
                _coh = coh,
                _cc = cc,
                _sc = buf.spriteCache,
                srcName;
            
            // rebuild the config
            var sc = {
                rate : spriteConfig.rate || _coh.LocalConfig.FRAME_RATE,
                cons : spriteConfig.cons || _cc.Sprite,
                animMode : spriteConfig.animMode || _cc.RepeatForever,
                color : spriteConfig.color === undefined ? -1 : spriteConfig.color
            }
            
            srcName = "img" + (sc.color === _coh.LocalConfig.NO_COLOR ? "" : "_" + (+sc.color));
            
            action = sc.animMode.create(self.getAnimation(unitName, animationName, srcName, sc.rate));
            
            var sprite = new sc.cons(buf.animFrames[unitName][animationName][srcName][0]);
            sprite.runAction(action);
            
            return sprite;
        },
        
        getAnimation : function(unitName, animationName, textureIndex, rate) {
            
            var _buf = buf,
                _cc = cc;
            
            rate = rate || _coh.LocalConfig.FRAME_RATE;
            
            !_buf.animations[unitName] && (_buf.animations[unitName] = {});
            !_buf.animations[unitName][animationName] && (_buf.animations[unitName][animationName] = {});
            !_buf.animations[unitName][animationName][textureIndex] && (_buf.animations[unitName][animationName][textureIndex] = 
                _cc.Animate.create(
                    cc.Animation.create(
                        self.getFrames(unitName, animationName, textureIndex), 
                        rate
                    )
                )
            );
            
            return _buf.animations[unitName][animationName][textureIndex];
        },
        
        getFrames : function(unitName, animationName, textureIndex) {
            
            var _buf = buf,
                _sc = _buf.spriteCache,
                _coh = coh,
                frames = [];
            
            !_buf.animFrames[unitName] && (_buf.animFrames[unitName] = {});
            !_buf.animFrames[unitName][animationName] && (_buf.animFrames[unitName][animationName] = {});
            
            if (!_buf.animFrames[unitName][animationName][textureIndex]) {
                _sc.removeSpriteFrames();
                _sc.addSpriteFrames(
                    _coh.res.sprite[unitName][animationName].plist, 
                    _coh.res.sprite[unitName][animationName][textureIndex]
                );
                
                for (var i in _sc._spriteFrames) {
                    frames.push(_sc._spriteFrames[i]);
                }
                _sc.removeSpriteFrames();
                
                _buf.animFrames[unitName][animationName][textureIndex] = frames;
            }
            
            return _buf.animFrames[unitName][animationName][textureIndex];
        },
        
        tryStopAction : function(target, action) {
            if (target && action && action.getOriginalTarget()) {
                target.stopAction(action);
            }
        }
    }
    
})();var coh = coh || {};
coh.Actor = cc.Sprite.extend({
    position : "",
    ctor : function(startFrame, rect, startNode) {
        this._super(startFrame, rect);
        // starts from "first"
        if (startNode && startNode.name) {
            this.position = startNode.name;
            coh.View.locateNode(startNode);
        }
        
        var winSize = cc.director.getWinSize();
        
        this.setPosition(winSize.width / 2, winSize.height / 2 + this.height / 4);
    },
    goTo : function(node, callback) {
        // go to target position, and roll the map at the same time.
        var self = this;
        self.position = "";
        coh.View.moveMapToNode(node, function() {
            self.position = node.name;
            callback && callback();
        });
    }
});var coh = coh || {};

(function() {

/**
 * Super class for all units.
 */
var UnitObject = function(unitName) {
    
    var self = this,
        _coh = coh,
        LC = _coh.units[unitName];
    
    if (!LC) return null;
    
    var buf = {
        id : 0,
        name : false,
        
        level : 0,
        
        // generated from level
        defend : 0,
        attack : 0,
        color : _coh.LocalConfig.NO_COLOR,
        
        // other configurations from LC.
        conf : {}
    };
    
    var construct = function(unitName) {
        
        var _buf = buf;
        
        _buf.name = unitName;
        
        // other initializations required;
        for (var i in LC) {
            _buf.conf[i] = LC[i];
            
            // append getter for all configs.
            self["get" + i[0].toUpperCase() + i.substr(1)] = (function(i) {
                return function() {
                    return buf.conf[i];
                }
            })(i);
        }
        
        this.id = _coh.LocalConfig.PRE_RAND_ID + _coh.Util.getRandId();
    }
    
    self.getName = function() {
        return buf.name;
    };
    
    self.getId = function() {
        return buf.id;
    };
    
    self.getLevel = function() {
        return buf.level;
    };
    
    self.getDefend = function() {
        return buf.defend;
    };
    
    self.getAttack = function() {
        return buf.attack;
    };
    
    self.setColor = function(newColor) {
        return buf.color = newColor;
    };
    
    self.getColor = function() {
        return buf.color;
    };
    
    construct.apply(self, arguments);
    
    return self;
};

/**
 * Unit factary and all public functions related to units.
 */
coh.Unit = (function(level) {
    
    var self;

    return self = {
        getType : function(unitName) {
            return (coh.units[unitName] && coh.units[unitName].type) || 0;
        },
        
        /**
         * factory function that returns the unit object via the given key.
         */
        getInstance : function(unitName) {
            return new UnitObject(unitName);
        }
    }
    
})();

})();var coh = coh || {};

(function() {
/**
 * @param unitConfig
    {
        [unitName] : [unitCount],
        // ... others
    }
 * Would be translated into Units list:
    {
        [unitName] : Array(<UnitObject>),
        // ... others
    }
 */
coh.Player = function(faction, level, unitConfig) {
    
    var self = this;
    
    var buf = {
        dataGroup : [],
        
        faction : false, 
        
        level : 0, 
        
        // generated from level
        currentHP : 0,
        totalHP : 0,
        
        // attacker for default.
        isAttacker : true,
        
        units : {},
        
        /**
         * indexed by priority and unit type.
         */
        unitsUnplaced : {}
    };
    
    var construct = function(faction, level, unitConfig) {
        
        var _buf = buf,
            _coh = coh,
            _u = _buf.unitsUnplaced,
            unit;
        
        for (var unitName in unitConfig) {
            unit = _coh.units[unitName];
            if (!unit) continue;
            
            _u[unit.priority] = _u[unit.priority] || {};
            _u[unit.priority][unit.type] = _u[unit.priority][unit.type] || [];
            for (var unitCount = 0, total = unitConfig[unitName]; unitCount < total; ++unitCount) {
                _u[unit.priority][unit.type].push(unitName);
            }
        }
    };
    
    self.getUnplacedUnit = function(status) {
        var _coh = coh,
            _buf = buf,
            _u = _buf.unitsUnplaced,
            type = _coh.Battle.getTypeFromStatus(status),
            unit =null, 
            unitName;
        
        for (var i in _u) {
            if (_u[i][type]) {
                unitName = _coh.Util.popRandom(_u[i][type]);
                unit = _coh.Unit.getInstance(unitName);
                unit.setColor(_coh.Battle.getColorFromStatus(status));
                break;
            }
        }
        
        if (!unit) return null;
        
        _buf.units[unit.getId()] = unit;
        return unit;
    };
    
    self.killUnit = function(unitId) {
        var _buf = buf,
            unit = _buf.units[unitId];
        
        if (unit) {
            _buf.unitsUnplaced[unit.getPriority()][unit.getType()].push(unit.getName());
            delete(_buf.units[unitId]);
        }
    };
    
    self.getUnit = function(unitId) {
        
    };
    
    self.getDataGroup = function() {
        return buf.dataGroup;
    };
    
    self.getCurrentHP = function() {
        return buf.currentHP;
    };
    
    self.getTotalHP = function() {
        return buf.totalHP;
    };
    
    /**
     * get all units that's on the ground.
     */
    self.getUnits = function() {
        return buf.units;
    };
    
    self.getUnitConfig = function() {
        return unitConfig;
    };
    
    self.isAttacker = function() {
        return buf.isAttacker;
    }
    self.setAsAttacker = function() {
        buf.isAttacker = true;
    }
    self.setAsDefender = function() {
        buf.isAttacker = false;
    }
    
    construct.apply(self, arguments);
    
    return self;
};
    
})();var coh = coh || {};
/**
 * Logics related to the battle ground, especially on calculating unit matrixes.
 */
coh.Battle = (function(){
    
    var self;
    
    var LC = coh.LocalConfig;
    
    var buf = {
    };
    
    var handlerList = {
        // indexed by the type configed in local config.
        locationTest : {
            1 : function(dataGroup, colNum) {
                return dataGroup[dataGroup.length - 1][colNum] == LC.STATUS_BLANK;
            },
            2 : function(dataGroup, colNum) {
                return dataGroup[dataGroup.length - 1][colNum] == LC.STATUS_BLANK && dataGroup[dataGroup.length - 2][colNum] == LC.STATUS_BLANK;
            },
            3 : function(dataGroup, colNum) {
                return dataGroup[dataGroup.length - 1][colNum] == LC.STATUS_BLANK && +dataGroup[dataGroup.length - 1][colNum + 1] == LC.STATUS_BLANK;
            },
            4 : function(dataGroup, colNum) {
                return dataGroup[dataGroup.length - 1][colNum] == LC.STATUS_BLANK
                    && dataGroup[dataGroup.length - 1][colNum + 1] == LC.STATUS_BLANK
                    && dataGroup[dataGroup.length - 2][colNum] == LC.STATUS_BLANK
                    && dataGroup[dataGroup.length - 2][colNum + 1] == LC.STATUS_BLANK;
            }
        }
    }
    
    var util = {
        /**
         * @return the first index that's followed by a non blank target, when checked from bottom to top. Starts from 0.
         */
        getBlankIndex : function(dataGroup, colNum) {
            
            // what if there are blanks blocked by some a 2*2 target?
            var blank = LC.STATUS_BLANK;
            for (var i = dataGroup.length - 1; i >= 0; --i) {
                if (+dataGroup[i][colNum] != blank) return i + 1;
            }
            return 0;
        },
        
        /**
         * try to find a convert at the given position in the current data group.
         * we assume the target position is blank in the data group, and we're going to add a single status with the given color(3/4/5).
         * this function will only find the possible convert based on the given convert type config, 
         * while the target position is one at the right bottom corner.
         * @param rowNum starts from 0.
         */
        findConvert : function(dataGroup, colNum, rowNum, color) {
            
            var _lc = LC,
                convert,
                match,
                result = [];
            for (var i in _lc.CONVERT_TYPE) {
                convert = _lc.CONVERT_TYPE[i];
                match = true;
                if (convert.length > rowNum + 1 || convert[0].length > colNum + 1) continue;
                for (var rowInCon = convert.length - 1, queue; queue = convert[rowInCon]; --rowInCon) {
                    for (var colInQueue = queue.length - 1, status; status = queue[colInQueue]; --colInQueue) {
                        // ignore the last element, we assume it would be the one with a given color.
                        if (rowInCon == convert.length - 1 && colInQueue == queue.length - 1) continue;
                        status = status * _lc.COLOR_COUNT + color;
                        match = match && (+status == +dataGroup[rowNum+ 1 - convert.length + rowInCon][colNum + 1 - queue.length + colInQueue]);
                        if (!match) break;
                    }
                    if (!match) break;
                }
                // find a convert that matches the config, restore it and return.
                if (match) {
                    result.push(i);
                }
            }
            return result;
        },
        
        locationTest : function(dataGroup, type, colNum) {
            return handlerList.locationTest[type](dataGroup, colNum);
        },
        
        colorTest : function(dataGroup, type, colNum, color) {
            
            if (type != 1) return true;
            
            // type 1, test all possible converts to the right or left side of the given position.
            if (self.findAllPossibleConverts(dataGroup, colNum, util.getBlankIndex(dataGroup, colNum), color).length) {
                return false;
            }
            
            return true;
        },
        
        /**
         * check and append new row data into the result set if necessary.
         * for the given target array like [0,1,2], newly appended result would be [0,0,0].
         */
        checkResultSet : function(resultSet, targetArray, rowNum) {
            
            // init the result set.
            if (!resultSet[rowNum]) {
                var rowCount = 0;
                while (rowCount <= rowNum) {
                    resultSet.push(eval("[" + targetArray.join(",").replace(/\d+/g, 0) + "]"));
                    ++rowCount;
                }
            }
            return resultSet;
        },
        
        /**
         * deep copy a data group that's a Two-dimensional array.
         */
        copy2Array : function(arr) {
            var arrBuf = arr.concat();
            
            for (var i = 0, row; row = arr[i]; ++i) {
                arrBuf[i] = arrBuf[i].concat();
            }
            return arrBuf;
        }
    }
    
    return self = {
        
        getTypeFromStatus : function(status) {
            return ~~(+status / LC.COLOR_COUNT);
        },
        
        getColorFromStatus : function(status) {
            return +status % LC.COLOR_COUNT;
        },
        
        /**
         * @param attacker [String] attacker faction
         * @param defender [String] defender faction
         */
        generate : function(attacker, defender) {
            
        },
        
        /**
         * @param current
         * @param config {Object}
         *  {
                [location type1] : [count of this type1],
                // ...
            }
         * null = status == 0;
         * color = status % _lc.COLOR_COUNT;
         * type  = (status - colors) / _lc.COLOR_COUNT = ~~(status / _lc.COLOR_COUNT);
         * for status == 12: 
            color == 0;
            type == 4;
         * 0 - blank;
         * 1 - reserved;
         * 2 - reserved;
         * 3 - 0/1;
         * 4 - 1/1;
         * 5 - 2/1;
         * ...
         * @return {
                succeed : [[]], // Two-dimensional array with similay data type given by the current data group.
                faild : [] // faild list, filled with data type.
            }
         */
        recharge : function(current, config) {
            
            var result = [],
                faild = [],
                currentBuf = util.copy2Array(current);
                totalCount = 0,
                items = [],
                _lc = LC,
                _coh = coh,
                _buf = buf,
                _util = util;
            
            for (var i in config) {
                totalCount += config[i];
                for (var j = 0; j < config[i]; ++j) {
                    items.push(i);
                }
            }
            
            var targetType, totalColumns = currentBuf[0].length, column, columnCount, color, colorCount, match = true;
            
            // clear the cache
            _buf.occupiedRowIndex = {};
            
            while (items.length > 0) {
                targetType = _coh.Util.popRandom(items);
                
                if (!_lc.LOCATION_TYPE[targetType]) continue;
                
                columnCount = 0;
                colorCount = 0;
                
                // position check
                do {
                    if (columnCount == 0) {
                        column = ~~(Math.random() * totalColumns);
                    } else {
                        column = (column + 1) % totalColumns;
                    }
                    ++columnCount;
                } while (columnCount <= totalColumns && !(match = _util.locationTest(currentBuf, targetType, column)));
                
                // color check
                if (match) do {
                    if (colorCount == 0) {
                        color = ~~(Math.random() * _lc.COLOR_COUNT);
                    } else {
                        color = (color + 1) % _lc.COLOR_COUNT;
                    }
                    ++colorCount;
                } while (colorCount <= _lc.COLOR_COUNT && !(match = _util.colorTest(currentBuf, targetType, column, color)));
                
                // if faild - for instance, no places for a 2*2 target.
                // otherwise, place the target into buffered data group.
                if (!match) {
                    faild.push(targetType);
                } else {
                    var typeConfig = _lc.LOCATION_TYPE[targetType],
                        blankIndex = 0,
                        rBlankIndex = 0;
                    for (var rowCount = 0; rowCount < typeConfig[0]; ++rowCount) {
                        for (var columnCount = 0; columnCount< typeConfig[1]; ++columnCount) {
                            blankIndex = Math.max(blankIndex, _util.getBlankIndex(currentBuf, column + columnCount));
                            rBlankIndex = Math.max(blankIndex, _util.getBlankIndex(result, column + columnCount));
                        }
                        for (var columnCount = 0; columnCount< typeConfig[1]; ++columnCount) {
                            // init result row with all 0;
                            result = _util.checkResultSet(result, currentBuf[0], rBlankIndex);
                            
                            // inject generated status into the resultset and buffered data
                            result[rBlankIndex][column + columnCount]
                                //~ = targetType * _lc.COLOR_COUNT + color
                                = (rowCount == 0 && columnCount == 0 ? 
                                    (targetType * _lc.COLOR_COUNT + color) : _lc.STATUS_OCCUPIED);
                            currentBuf[blankIndex][column + columnCount] = targetType * _lc.COLOR_COUNT + color;
                        }
                    }
                }
            }
            
            return {
                succeed : result,
                faild : faild,
                dataGroup : currentBuf
            }
        },
    
        generatePlayerMatrix : function(player) {
            
            var unitConfig = {},
                units = player.getUnitConfig(),
                _coh = coh;
            
            var unitType;
            for (var unitName in units) {
                // no interfaces changed.
                unitType = _coh.Unit.getType(unitName);
                unitConfig[unitType] || (unitConfig[unitType] = 0);
                unitConfig[unitType] += units[unitName];
            }
            
            var recharge = this.recharge(_coh.LocalConfig.BLANK_DATA_GROUP, unitConfig);
            
            return recharge;
        },
        
        /**
         * find all possible convert at the given position for the color,
         * thus will test all those nodes with the same color at both left and right side to the target position.
         * we won't test those ones behind (row number + 1) the target position,
         * because that means the node was moved (position changed), while another findAllPossibleConverts required for that node.
         * this function is based on util.findConvert.
         * @return 
         */
        findAllPossibleConverts : function(dataGroup, colNum, rowNum, color) {
            
            var columnPointer = colNum, 
                convertList, 
                result = [],
                _lc = LC,
                _util = util,
                status = 1 * _lc.COLOR_COUNT + color,
                dataBuf = _util.copy2Array(dataGroup);
            
            // assume the target is injected, try to find possible converts related to the change.
            dataBuf[rowNum][colNum] = status;
            
            // check left
            while (columnPointer >= 0 && +dataBuf[rowNum][columnPointer] == +status) {
                convertList = _util.findConvert(dataBuf, columnPointer, rowNum, color);
                
                convertList.length && result.push({
                    column : columnPointer,
                    row : rowNum,
                    converts : convertList
                });
                
                --columnPointer;
            }
            
            // check right
            columnPointer = colNum + 1;
            while (columnPointer < dataBuf[0].length && +dataBuf[rowNum][columnPointer] == +status) {
                convertList = _util.findConvert(dataBuf, columnPointer, rowNum, color);
                convertList.length && result.push({
                    column : columnPointer,
                    row : rowNum,
                    converts : convertList
                });
                ++columnPointer;
            }
            
            return result;
        }
    }
})();

/**
 * Sample data group:
[
    [4,6,3,3,12,12,3,3],
    [3,6,4,5,12,12,3,3],
    [3,5,3,5,5, 3, 4,4],
    [5,4,4,3,3, 0, 3,3],
    [0,0,0,0,0, 0, 0,5],
    [0,0,0,0,0, 0, 0,0]
]
*/var coh = coh || {};

/**
 * Unit tile that contains data of a unit and the tile sprite for the unit.
 */
(function() {

var g_lc = {
    CHECK_COLOR : new cc.Color(255, 128, 128, 255),
    UNCHECK_COLOR : new cc.Color(255, 255, 255, 255),
    FOCUS_BLINK : cc.repeatForever(cc.sequence(cc.fadeTo(0.618, 64), cc.fadeTo(0.618, 204)))
}
    
coh.UnitWrap = function() {
    
    var self = this;
    
    var buf = {
        isChecked : false
    };

    var construct = function(unit, tileSprite, unitSprite) {
        this.unit = unit;
        this.tileSprite = tileSprite;
        this.unitSprite = unitSprite;
    }
    
    self.check = function() {
        this.unitSprite.setColor(g_lc.CHECK_COLOR);
        this.unitSprite.runAction(g_lc.FOCUS_BLINK);
        buf.isChecked = true;
    };
    
    self.unCheck = function() {
        this.unitSprite.setColor(g_lc.UNCHECK_COLOR);
        coh.View.tryStopAction(this.unitSprite, g_lc.FOCUS_BLINK);
        buf.isChecked = false;
    };
    
    self.isChecked = function() {
        return buf.isChecked;
    };
    
    self.exile = function(isAttacker) {
        this.unitSprite.runAction(g_lc.FOCUS_BLINK);
        this.unitSprite.runAction(this.unitSprite.runningAction = cc.moveTo(coh.LocalConfig.EXILE_RATE, this.unitSprite.x, (isAttacker ? -1 : 1) * (this.tileSprite.y + this.unitSprite.height / 2)));
    };
    
    self.unExile = function() {
        var _cohView = coh.View;
        _cohView.tryStopAction(this.unitSprite, g_lc.FOCUS_BLINK);
        _cohView.tryStopAction(this.unitSprite, this.unitSprite.runningAction);
        this.unitSprite.setOpacity(255);
        this.unitSprite.y = 0;
    };
    
    construct.apply(self, arguments);
    
    return self;
};

})();/**
 *@version draft
 */

var coh = coh || {};
coh.MapScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new coh.MapLayer();
        this.addChild(layer);
    }
});
/**
 *@version draft
 */

var coh = coh || {};
coh.MapLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        
        var _coh = coh;
        
        _coh.map = cc.TMXTiledMap.create(_coh.res.map.districts.forest);
        
        this.addChild(_coh.map, 0, 1);
        
        var MpSize = cc.director.getWinSize(),
            self = this,
            mapPositons = _coh.map.getObjectGroup("positions"),
            keyMap = {},
            gogogo = function(key) {
                var nextNode;
                if ((nextNode = mapPositons.objectNamed(self.sprite.position)) && (nextNode = nextNode[keyMap[key]]) && (nextNode = mapPositons.objectNamed(nextNode))) {
                    //~ self.sprite.goTo(nextNode, function() {
                    self.sprite.goTo(nextNode, function() {
                        if (nextNode.passingBy) {
                            setTimeout(function(){
                                gogogo(key);
                            }, 0);
                        }
                    });
                } else {
                    return;
                }
            },
            investigate = function() {
                _coh.scene["battle"] = _coh.scene["battle"] || (_coh.scene["battle"] = new _coh.BattleScene(_coh.res.map.battle.field_16X16, _coh.res.imgs.market));
                
                _coh.scene["battle"].setTileSelector(
                    _coh.utils.BaseTileTransformer.getInstance(_coh.utils.TileSelector_16X16.getInstance())
                );
                
                cc.director.runScene(
                    cc.TransitionFadeDown.create(1.2, _coh.scene["battle"])
                );
                // Run battle logic here, place the player.
                
                // do placcePlayer when entered, to prevent 0 width for map tiles.
                var attacker, aMatrix, defender, dMatrix;
                var generatePlayer = function(battleScene) {
                    // attacker
                    attacker = new _coh.Player("", 1, { archer : 0});
                    attacker.setAsAttacker();
                    aMatrix = _coh.Battle.generatePlayerMatrix(attacker);
                    // defender
                    defender = new _coh.Player("", 1, { archer : 24, knight: 4, paladin: 3});
                    attacker.setAsDefender();
                    dMatrix = _coh.Battle.generatePlayerMatrix(defender);
                        
                    _coh.utils.FilterUtil.removeFilter("battleSceneEntered", generatePlayer, 12);
                    
                    return battleScene;
                };
                
                var render = function(battleScene) {
                    
                    battleScene.renderPlayer(attacker, aMatrix);
                    battleScene.renderPlayer(defender, dMatrix);
                    
                    _coh.utils.FilterUtil.removeFilter("battleSceneReady", render, 12);
                    
                    coh.utils.FilterUtil.applyFilters("battleUnitsReady", battleScene);
                    
                    return battleScene;
                };
                
                _coh.utils.FilterUtil.addFilter("battleSceneEntered", generatePlayer, 12);
                _coh.utils.FilterUtil.addFilter("battleSceneReady", render, 12);
            };
        
        keyMap[cc.KEY.left] = "left";
        keyMap[cc.KEY.right] = "right";
        keyMap[cc.KEY.up] = "up";
        keyMap[cc.KEY.down] = "down";
        
        if (cc.sys.capabilities.hasOwnProperty('keyboard')) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed:function (key, e) {
                    
                    if(key == cc.KEY.left || key == cc.KEY.right || key == cc.KEY.up || key == cc.KEY.down){
                        gogogo(key);
                    }
                    if(key == cc.KEY.enter){
                        investigate();
                    }
                },
                onKeyReleased:function (key, event) {
                    //~ MW.KEYS[key] = false;
                }
            }, this);
        }
        
        self.sprite = _coh.View.getSprite("awen", "walking", {cons : 
            function(startFrame, rect) {
                return new _coh.Actor(startFrame, rect, mapPositons.objectNamed("first"));
            }
        });
        this.addChild(self.sprite);
        
        return true;
    }
});/**
 * relay on :
    TileSelector: if you would like to place units to the battle ground;
 * inject it from the outer factory.
 *
 *@dispatch filterName: battleSceneEntered
 *@dispatch filterName: unitSpriteCreated
 */
var coh = coh || {};

coh.BattleScene = function() {

    var self;
    
    // private fields
    var buf = {
        tmxList : {},
        bgList : {},
        
        /**
         * Saved units in current battle scene.
         * Index by poition x and position y.
        unitMatrix = {
            [positionX] : {
                [positionY] : [UnitWrap],
                ... // other unit groups with the position x;
            },
            // other row data
        }
         */
        unitMatrix : {},
        
        focusTag : null,
        
        isAttackerTurn : true,
        
        // if the user is focusing on some a unit, the focusnode would be locked.
        // that means it won't react on any other locate events.
        focusTagLocked : false,
        
        
    };

    var handlerList = {
        // private properties
        // should be injected from outside.
        tileSelector : null
    };
    
    // private functions
    var util = {
        /**
         * Rules: if it's out of X border, locate to the nearest column that's having an unit;
         * Otherwise, locate to the poingint column.
         *
         */
        getAvaliableTiles : function(isAttacker, tileX, tileY) {
            var xRange = handlerList.tileSelector.getXRange(),
                yRange = handlerList.tileSelector.getYRange(isAttacker),
            
                overRight = tileX > xRange[xRange.length - 1],
                overLeft = tileX < xRange[0],
            
                overTop = isAttacker ? tileY < yRange[2] : tileY > yRange[2],
                overBottom = isAttacker ? tileY > yRange[yRange.length - 1] : tileY < yRange[yRange.length - 1],
            
                startX = overRight ? xRange[xRange.length - 1] : overLeft ? xRange[0] : tileX,
                endX = overRight ? xRange[0] : overLeft ? xRange[xRange.length - 1] : tileX,
                deataX = overRight ? -1 : overLeft ? 1 : 0,
                
                /**
                 *Position Y would be a problem.... for cases like this, while 0 is the position of the given tile.
                 *
                ******
                *****
               0 **
                 **
                */
                startY = overTop ? yRange[0] : overBottom ? yRange[yRange.length - 1] : tileY,
                endY = overTop ? yRange[yRange.length - 1] : overBottom ? yRange[0] : tileY,
                deataY = overTop ? (isAttacker ? 1 : -1) : overBottom ? (isAttacker ? -1 : 1) : 0,
            
                _buf = buf,
                x = startX, y = startY;
            
            do {
                y = startY;
                do {
                    if (_buf.unitMatrix[x] && _buf.unitMatrix[x][y]) return {x : x, y : y};
                    y += deataY;
                    console.log("dy:" + deataY + " y:" + y + " sy:" + startY + " ey:" + endY);
                } while (y != endY);
                x += deataX;
            } while (x != endX);
            
            // nothing matches found for given tile.
            return null;
        }
    };
    
    var BSClass = cc.Scene.extend({
        battleLayer : null,
        battleField : null,
        battleMap : null,
        attacker : null,
        defender : null,
        ctor : function (mapSrc, imgSrc) {
            this._super();
            this.battleLayer = new cc.Layer();
            
            this.setBattleField(imgSrc);
            this.setBattleMap(mapSrc);
            
            this.addChild(this.battleLayer);
        },
        
        onEnter : function() {
            this._super();
            coh.utils.FilterUtil.applyFilters("battleSceneEntered", this);
        },
        
        onEnterTransitionDidFinish : function() {
            this._super();
            coh.utils.FilterUtil.applyFilters("battleSceneReady", this);
        },
        
        /**
         * set background image.
         */
        setBattleField : function(imgSrc) {
            // 
            if (!imgSrc) return;
            
            var _buf = buf;
            if (!_buf.bgList[imgSrc]) {
                var sprite = cc.Sprite.create(imgSrc),
                    winSize = cc.director.getWinSize();
                
                sprite.attr({
                    anchorX : 0.5,
                    anchorY : 0.5,
                    scale : winSize.height / sprite.height,
                    x : winSize.width / 2,
                    y : winSize.height / 2 
                });
                
                _buf.bgList[imgSrc] = sprite;
            }
            
            if (this.battleField) {
                this.battleLayer.removeChild(this.battleField);
            }
            
            this.battleLayer.addChild(_buf.bgList[imgSrc], coh.LocalConfig.Z_INDEX.BACKGROUND);
            this.battleField = _buf.bgList[imgSrc];
        },
        
        /**
         * set battle ground tmx map.
         */
        setBattleMap : function(mapSrc) {
            // 
            if (!mapSrc) return;
            
            var _buf = buf;
            if (!_buf.tmxList[mapSrc]) {
                var map = cc.TMXTiledMap.create(mapSrc),
                    winSize = cc.director.getWinSize();
                
                map.attr({
                    anchorX : 0.5,
                    anchorY : 0.5,
                    scale : winSize.height / map.height,
                    x : winSize.width / 2,
                    y : winSize.height / 2,
                    
                });
                
                _buf.tmxList[mapSrc] = map;
            }
            
            if (this.battleMap) {
                this.battleLayer.removeChild(this.battleMap);
            }
            
            this.battleLayer.addChild(_buf.tmxList[mapSrc], coh.LocalConfig.Z_INDEX.CONTENT);
            this.battleMap = _buf.tmxList[mapSrc];
        },
        
        setTileSelector : function(selector) {
            handlerList.tileSelector = selector;
        },
        
        getTileInGlobal : function(posX, posY) {
            var scale = this.battleMap.scale;
            
            return handlerList.tileSelector.getTileFromCoord(
                this.battleMap.width * scale, 
                this.battleMap.height * scale,
                posX - this.battleMap.x * scale, 
                posY
            );
        },
        
        getTileInTurn : function(posX, posY) {
            var tile = this.getTileInGlobal(posX, posY);
            
            // searching for the nearest unit from a given tile;
            return util.getAvaliableTiles(this.isAttackerTurn(), tile.x, tile.y);
        },
        
        /**
         * return the last tile that's having a unit occupied.
         */
        getLastTileInColumn : function(isAttacker, tile) {
            
            if (!buf.unitMatrix[tile.x]) return null;
            
            var _buf = buf,
                range = handlerList.tileSelector.getYRange(isAttacker),
                start = range[0],
                deata = this.isAttackerTurn() ? 1 : -1,
                end = range[range.length - 1],
                y = start,
                lastTileY = start;
            
            while (y != end + deata) {
                if (_buf.unitMatrix[tile.x] && _buf.unitMatrix[tile.x][y]) {
                    lastTileY = y;
                }
                y += deata;
            };
            
            return {x : tile.x, y : lastTileY};
        },
        
        getUnit : function(tile) {
            var _buf = buf;
            return tile && _buf.unitMatrix[tile.x] && _buf.unitMatrix[tile.x][tile.y];
        },
        
        /**
         * get unit sprite via given position in the view.
         */
        getUnitInGlobal : function(posX, posY) {
            return this.getUnit(this.getTileInGlobal(posX, posY));
        },
        
        /**
         * get unit sprite via given position in the view.
         * this will only return ligle units for current player turn, attacker or defender.
         */
        getUnitInTurn : function(posX, posY) {
            return this.getUnit(this.getTileInTurn(posX, posY));
        },
        
        getLastUnitInColumn : function(isAttacker, tile) {
            return this.getUnit(this.getLastTileInColumn(isAttacker, tile));
        },
        
        isLastUnitInColumn : function(isAttacker, unitWrap, tile) {
            return unitWrap == this.getLastUnitInColumn(isAttacker, unitWrap, tile);
        },
        
        getFocusTag : function() {
            var _buf = buf,
                _coh = coh;
            // create the node if not exist.
            if (!_buf.focusTag) {
                _buf.focusTag = new _coh.cpns.Cursor();
                self.battleMap.addChild(_buf.focusTag, _coh.LocalConfig.Z_INDEX.BACKGROUND);
            }
            
            return _buf.focusTag;
        },
        
        /**
         * Highlight the hovered unit.
         */
        locateToUnit : function(unitWrap){
            // if tag locked - for example focusing on some a unit - do nothing.
            !buf.focusTagLocked && this.getFocusTag().locateTo(unitWrap.tileSprite, this.isAttackerTurn());
        },
        
        /**
         * Mark a unit to be deleted.
         */
        focusOnUnit : function(unitWrap){
            
            if (!unitWrap) return;
            buf.focusTagLocked = false;
            
            // sprite changes to the tag;
            this.locateToUnit(unitWrap);
            this.getFocusTag().focusOn(unitWrap.tileSprite, this.isAttackerTurn());
            
            // sprite changes to the unit itself
            unitWrap.check();
            
            // buffer changes
            buf.focusTagLocked = true;
        },
        
        exileUnit : function(unitWrap) {
            
            if (!unitWrap) return;
            buf.focusTagLocked = false;
            
            // sprite changes to the tag;
            this.locateToUnit(unitWrap);
            
            this.getFocusTag().exile(unitWrap.tileSprite, this.isAttackerTurn());
            
            unitWrap.exile(this.isAttackerTurn());
            
            // buffer changes
            buf.focusTagLocked = true;
        },
        
        cancelFocus : function() {
            var _buf = buf;
            _buf.focusTagLocked = false;
            
            // XXXXXX interestingly I can't hide it here, or the cursor flies.
            //~ this.getFocusTag().hide();
        },
        
        removeUnit : function(unitWrap, tile) {
            this.cancelFocus();
            this.getFocusTag().hide();
        },
        
        setAttackerTurn : function(isAttacker) {
            
            if (buf.isAttackerTurn == isAttacker) return;
            
            var _coh = coh,
                tag = this.getFocusTag();
            
            buf.isAttackerTurn = isAttacker;
            
            tag.setBgColor(isAttacker ? _coh.LocalConfig.ATTACKER_FOCUS_COLOR : _coh.LocalConfig.DEFENDER_FOCUS_COLOR);
            tag.hide();
            
            isAttacker && _coh.utils.FilterUtil.applyFilters("attackerTurnStarted", this);
            !isAttacker && _coh.utils.FilterUtil.applyFilters("defenderTurnStarted", this);
        },
        
        isAttackerTurn : function() {
            return buf.isAttackerTurn;
        },
        
        renderPlayer : function(player, matrix) {
            
            var _coh = coh,
                _buf = buf;
            player.isAttacker() && this.setAttacker(player) || this.setDefender(player);
            
            // for animate purpose
            _buf.unitDelay = 0;
            for (var i = 0, row; row = matrix.succeed[i]; ++i) {
                for (var j = 0, status; (status = row[j]) != undefined; ++j) {
                    status && _coh.Battle.getTypeFromStatus(status) && this.placeUnit(player, status, i, j);
                    _buf.unitDelay += _coh.LocalConfig.ASSAULT_DEATA;
                }
            }
        },
        
        setAttacker : function(attacker) {
            this.attacker = attacker;
        },
        
        setDefender : function(defender) {
            this.defender = defender;
        },
        
        /**
         * tileSelector required. Should be injected from outside.
         * translate rowNum and colNum into tile and position to be placed.
         */
        placeUnit : function(player, status, rowNum, colNum) {
            
            // find correct unit from the player via given status(type defined);
            var _coh = coh,
                _buf = buf,
                scale = this.battleMap.scale,
                
                // color would be kept in the unit object.
                unit = player.getUnplacedUnit(status),
                unitSprite = _coh.View.getSprite(unit.getName(), "idle", {color : _coh.Battle.getColorFromStatus(status)}),
                tileSprite = cc.DrawNode.create(),
                unitWrap = new _coh.UnitWrap(unit, tileSprite, unitSprite),
                
                // get tile and do the possible translation, for example for a type 2 defender unit.
                tilePosition = handlerList.tileSelector.getTilePosition(player.isAttacker(), _coh.Battle.getTypeFromStatus(status), rowNum, colNum),
                shadow = cc.Sprite.create(_coh.res.imgs.shadow),
                typeConfig = _coh.LocalConfig.LOCATION_TYPE[unit.getType()];
            
            shadow.attr({
                x : 0,
                y : 0,
                anchorX: -0.05,
                anchorY: 0.3,
                scaleX : typeConfig[1] * 0.8,
                scaleY : 0.75,
                opacity:164
            });
            
            unitSprite.attr({
                x : 0,
                y : 0,
                scale : _coh.LocalConfig.SPRITE_SCALE[unit.getType()],
                anchorX: 0,
                anchorY: 0
            });
            
            // show it when set to tile.
            tileSprite.attr({
                visible : false
            });
            
            unitSprite.addChild(shadow, _coh.LocalConfig.Z_INDEX.BACKGROUND);
            tileSprite.addChild(unitSprite, _coh.LocalConfig.Z_INDEX.CONTENT);
            this.battleMap.addChild(tileSprite, tilePosition.y);
            
            setTimeout(function() {
                self.setUnitToTile(player.isAttacker(), unitWrap, tilePosition);
            }, _buf.unitDelay);
            
            // XXXXXX For debug usage.
            _coh.unitList = _coh.unitList || [];
            _coh.unitList.push(unitWrap);
        },
        
        setUnitToTile : function(isAttacker, unitWrap, tile) {
            
            // find correct unit from the player via given status(type defined);
            var _coh = coh,
                _buf = buf,
                // get tile and do the possible translation, for example for a type 2 defender unit.
                mapTile = this.battleMap.getLayer(_coh.LocalConfig.MAP_BATTLE_LAYER_NAME).getTileAt(tile),
                unit = unitWrap.unit,
                unitSprite = unitWrap.unitSprite,
                tileSprite = unitWrap.tileSprite,
                srcName ="img_" + (+unit.getColor() || 0);
            
            // set buffer
            // mind types that's not only having 1 tile.
            var typeConfig = _coh.LocalConfig.LOCATION_TYPE[unit.getType()];
            
            for (var rowCount = 0; rowCount < typeConfig[0]; ++rowCount) {
                for (var columnCount = 0; columnCount < typeConfig[1]; ++columnCount) {
                    _buf.unitMatrix[tile.x + columnCount] = _buf.unitMatrix[tile.x + columnCount] || {};
                    _buf.unitMatrix[tile.x + columnCount][tile.y - rowCount] = unitWrap;
                }
            }
            
            tileSprite.attr({
                width: mapTile.width * typeConfig[1],
                height: mapTile.height * typeConfig[0]
            });
            tileSprite.attr({
                visible : true,
                x : mapTile.x,
                y : isAttacker ? - tileSprite.height : tileSprite.height + this.battleMap.height
            });
            
            console.log(isAttacker);
            
            // Animations appended.
            unitSprite.runAction(cc.repeatForever(_coh.View.getAnimation(unit.getName(), "assult", srcName)));
            tileSprite.runAction(tileSprite.runningAction = cc.sequence(cc.moveTo(coh.LocalConfig.ASSAULT_RATE, mapTile.x, mapTile.y), cc.callFunc(function() {
                unitWrap.unitSprite.runAction(cc.repeatForever(_coh.View.getAnimation(unit.getName(), "idle", srcName)));
            })));
        },
        
        prepareMoving : function(isAttacker, unitWrap, lastTile) {
            var _buf = buf,
                typeConfig = _coh.LocalConfig.LOCATION_TYPE[unitWrap.unit.getType()],
                yRange = handlerList.tileSelector.getYRange(isAttacker),
                targetTile = (
                    _buf.unitMatrix[lastTile.x][lastTile.y] == unitWrap ? 
                        lastTile : {
                            x : lastTile.x, 
                            y : lastTile.y + (isAttacker ? 1 : -1) * typeConfig[0]
                        }
                ),
                targetMapTile,
                focusTag = self.getFocusTag();
            
            if (isAttacker && targetTile.y > yRange[yRange.length - 1] || !isAttacker && targetTile.y < yRange[yRange.length - 1]) {
                focusTag.arrowDirection.setVisible(false);
                return false;
            }
            
            targetMapTile = this.battleMap.getLayer(_coh.LocalConfig.MAP_BATTLE_LAYER_NAME).getTileAt(targetTile);
            
            focusTag.arrowDirection.attr({
                visible : true,
                rotation : isAttacker ? 0 : 180,
                x : unitWrap.tileSprite.width / 2 - focusTag.x + targetMapTile.x
            });
            
            unitWrap.unitSprite.attr({
                x : 0,
                y : 0
            });
            unitWrap.tileSprite.attr({
                x : targetMapTile.x,
                y : targetMapTile.y,
                zIndex : targetTile.y
            });
            
            return true;
        },
        
        removeUnit : function(unitWrap, tile) {
            // XXXXXX
        }
    });
    
    // Sorry but I really did't mean to make it so ugly...
    // Just for private fields.
    var argList = [];
    for (var i = 0, arg; arg = arguments[i]; ++i) {
        argList.push("arguments[" + i + "]");
    }
    argList = argList.join(",");
    
    return self = eval("new BSClass(" + argList + ")");
    
    /**
     * XXXXXX
     * How to locate unit via the position? unitId?
    1. Event triggered;
        click
    2. Handlers in controller captured;
    3. Find Unit instance in model via position;
        instance of Player
    4. Update model if necessary;
        HP decrease 1;
    5. Dispatch filter event, filter triggered;
    6. Handlers in controller captured;
    7. Do update in View;
        BattleScene, update HP info for a sprite.
    */
};/**
 * Do events and filters binding.
 */

/*

if ('mouse' in cc.sys.capabilities)
    
    //~ onMouseDown: null,
    //~ onMouseUp: null,
    //~ onMouseMove: null,
    //~ onMouseScroll: null
    
    //
    cc.eventManager.addListener({
        event: cc.EventListener.MOUSE,
        onMouseMove: function(event){
            if(event.getButton() != undefined) ;
        }
    }, this);

if (cc.sys.capabilities.hasOwnProperty('touches')){
    cc.eventManager.addListener({
        
        //~ swallowTouches: false,
        //~ onTouchBegan: null,
        //~ onTouchMoved: null,
        //~ onTouchEnded: null,
        //~ onTouchCancelled: null,
        
        //
        
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchesMoved:function (touches, event) {
            
        }
    }, this);
}
*/

coh.UIController = (function() {
    
    var self,
        _coh = coh;
    
    var buf = {
        battle : {            
            // mark the last handled unitWrap and tile, for click and slide events.
            lastUnitWrap : null, 
            lastTile : null,
            
            // if a unit is checked twice, it would be removed from the scene.
            checkedUnit : null,
            exiledUnit : null,
            
            exiledTileFrom : null,
            exiledTileTo : null
        },
        
        // exile/locate/default or other possible kinds of mouse actions in battleScene.
        // locate for the default.
        mouseAction : "locate"
    };
    
    var handlerList = {
        doFocus : function(event, battleScene) {
            
            var location = event.getLocationInView(),
                unitWrap = battleScene.getUnitInTurn(location.x, location.y);
            
            if (unitWrap) {
                battleScene.locateToUnit(unitWrap);
            }
        },
        doCheckOrExile : function(event, battleScene) {
            var location = event.getLocationInView(),
                tile = battleScene.getTileInGlobal(location.x, location.y),
                unitWrap = battleScene.getUnitInTurn(location.x, location.y),
                clickedUnit = battleScene.getUnitInGlobal(location.x, location.y),
                lastUnitWrap = buf.battle.lastUnitWrap,
                lastTile = buf.battle.lastTile;
            
            // the same unit clicked: clickedUnit should be the same as the lastUnitWrap.
            if (lastUnitWrap && unitWrap == lastUnitWrap && clickedUnit == unitWrap) {
                _coh.utils.FilterUtil.applyFilters("battleUnitClicked", unitWrap, tile, battleScene);
                return;
            }
            
            // slide from top to bottom of the battle field, or the last unit in the group clicked.
            if (lastTile && tile.x == lastTile.x && (battleScene.isAttackerTurn() ? tile.y > lastTile.y : tile.y < lastTile.y)) {
                _coh.utils.FilterUtil.applyFilters("battleUnitExiled", clickedUnit || lastUnitWrap , clickedUnit && tile || lastTile, battleScene);
                return;
            }
            
            _coh.utils.FilterUtil.applyFilters("battleActionsCanceled", unitWrap, tile, battleScene);
        },
        doExileMove : function(event, battleScene) {
            var location = event.getLocationInView(),
                globalTile = battleScene.getTileInGlobal(location.x, location.y),
                columnTile = battleScene.getLastTileInColumn(battleScene.isAttackerTurn(), globalTile),
                lastTile = buf.battle.lastTile;
            
            if (!columnTile || lastTile.x == columnTile.x) return;
            
            var isSucceed = battleScene.prepareMoving(battleScene.isAttackerTurn(), buf.battle.exiledUnit, columnTile);
            
            if (isSucceed) {
                buf.battle.exiledTileTo = columnTile;
            } else {
                buf.battle.exiledTileTo = null;
            }
            
            buf.battle.lastTile = columnTile;
        },
        doUnExile : function(event, battleScene) {
            
            var _buf = buf;
            
            battleScene.cancelFocus();
            _buf.battle.exiledUnit && _buf.battle.exiledUnit.unExile(); 
            
            if (_buf.battle.exiledTileTo && _buf.battle.exiledTileTo.x != _buf.battle.exiledTileFrom.x) {
                
            //~ battleScene.moveUnit(unitWrap, from, _buf.battle.exiledTile);
            } else {
                battleScene.setUnitToTile(battleScene.isAttackerTurn(), _buf.battle.exiledUnit, _buf.battle.exiledTileFrom);
            }
            
            _buf.battle.exiledUnit = null;
            _buf.mouseAction = "locate";
            
            // XXXXXX if it's not the same column slided, here we go to ghe move function in battleScene.
        },
        recordTile : function(event, battleScene) {            
            var location = event.getLocationInView(),
                tile = battleScene.getTileInGlobal(location.x, location.y),
                unitWrap = battleScene.getUnitInTurn(location.x, location.y);
            if (unitWrap) {
                buf.battle.lastUnitWrap = unitWrap;
                buf.battle.lastTile = tile;
            }
        }
    };
    
    // Magic.
    var actionsConfig = {
        battle : {
            exile : {
                onMouseMove : handlerList.doExileMove,
                onMouseUp : handlerList.doUnExile
            },
            locate : {
                onMouseMove : handlerList.doFocus,
                onMouseUp : handlerList.doCheckOrExile
            },
            onDefault : {
                onMouseDown : handlerList.recordTile
            }
        }
    };
    
    var util = {
        clearStatus : function(battleScene) {
            
            var _buf = buf;
            
            // cancel focus in other cases.
            battleScene.cancelFocus();
            
            // cancel checked units incase of checked.
            _buf.battle.checkedUnit && _buf.battle.checkedUnit.unCheck();
            _buf.battle.checkedUnit  = null;
            
            _buf.battle.exiledUnit && _buf.battle.exiledUnit.unExile(); 
            _buf.battle.exiledUnit = null;
        }
    };
    
    _coh.utils.FilterUtil.addFilter("battleUnitsReady", function(battleScene) {
        if ('mouse' in cc.sys.capabilities)
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseMove : function(event){
                (actionsConfig.battle[buf.mouseAction].onMouseMove || actionsConfig.battle.onDefault.onMouseMove)(event, battleScene);
            },
            
            onMouseDown : function(event) {
                (actionsConfig.battle[buf.mouseAction].onMouseDown || actionsConfig.battle.onDefault.onMouseDown)(event, battleScene);
            },
            
            onMouseUp : function(event) {
                (actionsConfig.battle[buf.mouseAction].onMouseUp || actionsConfig.battle.onDefault.onMouseUp)(event, battleScene);
            }
            
        }, battleScene);
        
        return battleScene;
    });
    
    _coh.utils.FilterUtil.addFilter("battleUnitClicked", function(unitWrap, tile, battleScene) {
        
        var _buf = buf;
        
        if (unitWrap.isChecked()) {
            battleScene.removeUnit(unitWrap, tile);
        } else {
            util.clearStatus(battleScene);
            battleScene.focusOnUnit(unitWrap);
            
            _buf.battle.checkedUnit = unitWrap;
        }
    });
    
    _coh.utils.FilterUtil.addFilter("battleUnitExiled", function(unitWrap, tile, battleScene) {
        var isAttacker = battleScene.isAttackerTurn(),
            exiledTileFrom = battleScene.getLastTileInColumn(isAttacker, tile),
            exiledUnit = battleScene.getUnit(exiledTileFrom),
            typeConfig = coh.LocalConfig.LOCATION_TYPE[unitWrap.unit.getType()],
            _buf = buf;
        
        util.clearStatus(battleScene);
        
        // unExile would be executed in the doUnExile process.
        battleScene.exileUnit(exiledUnit);
        
        _buf.battle.exiledUnit = exiledUnit;
        _buf.battle.exiledTileFrom = exiledTileFrom;
        
        _buf.mouseAction = "exile";
    });
    
    _coh.utils.FilterUtil.addFilter("battleActionsCanceled", function(unitWrap, tile, battleScene) {
        util.clearStatus(battleScene);
    });
    
    _coh.utils.FilterUtil.addFilter("defenderTurnStarted", function(battleScene) {
    });
    
    _coh.utils.FilterUtil.addFilter("attackerTurnStarted", function(battleScene) {
    });
    
    return self = {
        
    };
})();