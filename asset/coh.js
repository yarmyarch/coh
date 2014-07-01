
var coh = coh || {};
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
            field_16X16 : "res/tmxmap/battle_16X16.tmx?v=1"
        }
    },
    imgs : {
        market : "res/tmxmap/b_market.jpg",
        forest : "res/tmxmap/forest.jpg"
    },
    sprite : {
        awen : {
            walking : {
                plist : "res/sprite/sprite.plist",
                img : "res/sprite/sprite.png"
            }
        },
        archer : {
            idle : {
                plist : "res/sprite/archer_idle.plist",
                img_0 : "res/sprite/archer_blue.png",
                img_1 : "res/sprite/archer_gold.png",
                img_2 : "res/sprite/archer_white.png"
            }
        }
    }
};

(function() {
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
    }
    coh.resources = generateRes(coh.res);
})();

/**
XXXXXX
TODO : 
    set sprite: run/walk in Actor;
    translate dataGroup into map positions in BattleScene;

    in battle, the map with a background should be split out from the battle layer.
  
ERROR using spriteFrameCache in coh.View.js, line 75.

*/var coh = coh || {};
coh.LocalConfig = {
    COLOR : {
        GREEN : 1,
        RED : 2,
        BLUE : 3
    },
    LOCATION_TYPE : {
        // 0 - reserved
        // [row count, column count]
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
    BLANK : 0,
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
    COLOR_CONFIG : {
        elf : ["blue", "white", "gold"]
    },
    
    MAP_BATTLE_LAYER_NAME : "battleField"
};//~ usage:
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
})();var coh = coh || {};
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
            
            srcName = "img" + (sc.color === -1 ? "" : "_" + (+sc.color));
            
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
        name : false, 
        type : 0, 
        
        level : 0,
        
        // generated from level
        defend : 0,
        attack : 0,
    };
    
    var construct = function(unitName) {
        buf.name = unitName;
        // other initializations required;
        buf.type = LC.type;
    }
    
    self.getType = function() {
        return buf.type;
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
        
        units : {}
    };
    
    var construct = function(faction, level, unitConfig) {
        
        var _buf = buf,
            _coh = coh;
        for (var unitName in unitConfig) {
            !_buf.units[unitName] && (_buf.units[unitName] = []);
            for (var unitCount = 0, total = unitConfig[unitName]; unitCount < total; ++unitCount) {
                _buf.units[unitName].push(_coh.Unit.getInstance(unitName));
            }
        }
    };
    
    self.getDataGroup = function() {
        return buf.dataGroup;
    },
    
    self.getCurrentHP = function() {
        return buf.currentHP;
    };
    
    self.getTotalHP = function() {
        return buf.totalHP;
    };
    
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
coh.Battle = (function(){
    
    var self;
    
    var LC = coh.LocalConfig;
    
    var buf = {
        occupiedRowIndex : {}
    };
    
    var handlerList = {
        // indexed by the type configed in local config.
        locationTest : {
            1 : function(dataGroup, colNum) {
                return +dataGroup[dataGroup.length - 1][colNum] == LC.BLANK;
            },
            2 : function(dataGroup, colNum) {
                return +dataGroup[dataGroup.length - 1][colNum] == LC.BLANK && dataGroup[dataGroup.length - 2][colNum] == LC.BLANK;
            },
            3 : function(dataGroup, colNum) {
                return +dataGroup[dataGroup.length - 1][colNum] == LC.BLANK && +dataGroup[dataGroup.length - 1][colNum + 1] == LC.BLANK;
            },
            4 : function(dataGroup, colNum) {
                return +dataGroup[dataGroup.length - 1][colNum] == LC.BLANK
                    && +dataGroup[dataGroup.length - 1][colNum + 1] == LC.BLANK
                    && +dataGroup[dataGroup.length - 2][colNum] == LC.BLANK
                    && +dataGroup[dataGroup.length - 2][colNum + 1] == LC.BLANK;
            }
        }
    }
    
    var util = {
        /**
         * @return the first index that's followed by a non blank target, when checked from bottom to top. Starts from 0.
         */
        getBlankIndex : function(dataGroup, colNum) {
            
            // what if there are blanks blocked by some a 2*2 target?
            var blank = LC.BLANK;
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
         * for the given target array like [0,1,2], newly appended result would be ["0","0","0"].
         */
        checkResultSet : function(resultSet, targetArray, colNum) {
            var _buf = buf;
            
            // init the result set.
            if (!resultSet[_buf.occupiedRowIndex[colNum]]) {
                var rowCount = 0;
                while (rowCount <= _buf.occupiedRowIndex[colNum]) {
                    resultSet.push(targetArray.join(" ").replace(/\d+/g, 0).split(" "));
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
                _buf = buf,
                _util = util;
            
            for (var i in config) {
                totalCount += config[i];
                for (var j = 0; j < config[i]; ++j) {
                    items.push(i);
                }
            }
            
            var targetIndex, targetType, totalColumns = currentBuf[0].length, column, columnCount, color, colorCount, match = true;
            
            // clear the cache
            _buf.occupiedRowIndex = {};
            
            while (items.length > 0) {
                targetIndex = ~~(Math.random() * items.length);
                targetType = items[targetIndex];
                
                if (!_lc.LOCATION_TYPE[targetType]) continue;
                
                items[targetIndex] = items[items.length - 1];
                items.length = items.length - 1;
                
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
                        blankIndex = 0;
                    for (var rowCount = 0; rowCount < typeConfig[0]; ++rowCount) {
                        for (var columnCount = 0; columnCount< typeConfig[1]; ++columnCount) {
                            blankIndex = Math.max(blankIndex, _util.getBlankIndex(currentBuf, column + columnCount));
                        }
                        for (var columnCount = 0; columnCount< typeConfig[1]; ++columnCount) {
                            if (!_buf.occupiedRowIndex[column + columnCount]) _buf.occupiedRowIndex[column + columnCount] = 0;
                            
                            // init result row with all 0;
                            result = _util.checkResultSet(result, currentBuf[0], column + columnCount);
                            
                            // inject generated status into the resultset and buffered data/
                            result[_buf.occupiedRowIndex[column + columnCount]][column + columnCount]
                                = currentBuf[blankIndex][column + columnCount]
                                = targetType * _lc.COLOR_COUNT + color;
                            
                            // record avaliable row index, for next possible 
                            ++_buf.occupiedRowIndex[column + columnCount];
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

// ui related config exists in resource.js
coh.units = {
    archer : {
        type : 1
    }
};/**
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
                var unitCount = 0;
                // XXXXXX Just a demo here.
                _coh.scene["battle"].setTileSelector({
                    getTilePosition : function() {
                        return {
                            x : ~~(unitCount / 16),
                            y : unitCount++ % 16
                        };
                    }
                });
                
                cc.director.runScene(
                    cc.TransitionFadeDown.create(1.2, _coh.scene["battle"])
                );
                // Run battle logic here, place the player.
                setTimeout(function(){
                    _coh.scene["battle"].generate();
                }, 0);
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
 * relay on tileSelector, if you would like to place units to the battle ground.
 * inject it from the outer factory.
 */
var coh = coh || {};
    
(function() {

// local buffer for class BattleScene only.
var buf = {
    tmxList : {},
    bgList : {}
};

var handlerList = {
    // private properties
    // should be injected from outside.
    tileSelector : null
};

coh.BattleScene = cc.Scene.extend({
    battleLayer : null,
    battleField : null,
    battleMap : null,
    ctor:function (mapSrc, imgSrc) {
        this._super();
        this.battleLayer = new cc.Layer();
        
        this.setBattleField(imgSrc);
        this.setBattleMap(mapSrc);
        
        this.addChild(this.battleLayer);
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
        
        this.battleLayer.addChild(_buf.bgList[imgSrc], 0);
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
                y : winSize.height / 2 
            });
            
            _buf.tmxList[mapSrc] = map;
        }
        
        if (this.battleMap) {
            this.battleLayer.removeChild(this.battleMap);
        }
        
        this.battleLayer.addChild(_buf.tmxList[mapSrc], 1);
        this.battleMap = _buf.tmxList[mapSrc];
    },
    
    setTileSelector : function(selector) {
        handlerList.tileSelector = selector;
    },
    
    generate : function(isDefender) {
        var player = new coh.Player("", 1, { archer : 24 });
        
        // attacker for default.
        isDefender = isDefender ? "setAsDefender" : "setAsAttacker";
        player[isDefender]();
        
        this.placePlayer(player);
    },
    
    placePlayer : function(player) {
        
        var unitConfig = {},
            units = player.getUnits(),
            _coh = coh;
        
        var unitType;
        for (var unitName in units) {
            // no interfaces changed.
            unitType = _coh.Unit.getType(unitName);
            unitConfig[unitType] || (unitConfig[unitType] = 0);
            unitConfig[unitType] += units[unitName].length;
        }
        
        var recharge = _coh.Battle.recharge(_coh.LocalConfig.BLANK_DATA_GROUP, unitConfig);
        
        for (var i = 0, row; row = recharge.succeed[i]; ++i) {
            for (var j = 0, status; status = row[j]; ++j) {
                this.placeUnit(player, status, i, j);
            }
        }
    },
    
    /**
     * tileSelector required. Should be injected from outside.
     */
    placeUnit : function(player, status, rowNum, colNum) {
        
        // find correct unit from the player via given status(type defined);
        var _coh = coh,
            unit = _coh.View.getSprite("archer", "idle", {color : status % _coh.LocalConfig.COLOR_COUNT}),
            tilePosition = handlerList.tileSelector.getTilePosition(player.isAttacker(), rowNum, colNum),
            tile = this.battleMap.getLayer(_coh.LocalConfig.MAP_BATTLE_LAYER_NAME).getTileAt(tilePosition);
        
        unit.attr({
            x : tile.x,
            y : tile.y,
            width : tile.width,
            height : tile.height,
        });
        
        this.battleLayer.addChild(unit, 0, 1);
        
        _coh.unitList = _coh.unitList || [];
        _coh.unitList.push(unit);
    }
});

})();