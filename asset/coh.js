
var coh = coh || {};
coh.LocalConfig = {
    /**
     * @see coh.Unit.js for more details of status & type & color.
     */
    LOCATION_TYPE : {
        // 0 - reserved
        // [row count<y>, column count<x>]
        1 : [1,1],
        2 : [2,1],
        3 : [1,2],
        4 : [2,2]
    },
    UNIT_TYPES: {
        // blank, unused datagroup data or other unexpected units shares this type.
        // walls : type equals to static, and it charging.
        STATIC : 0,
        SOLDIER : 1,
        ELITE : 2,
        TANK : 3,
        CHAMPION : 4
    },
    // should be recalculated via UNIT_TYPES.
    UNIT_TYPES_COUNT : 0,
    // for units whose type code is within <x> * UNIT_TYPES_COUNT ~ <x + 1> * UNIT_TYPES_COUNT, having the action below which value is <x>.
    // Ex. charging elite unit is having the type of 1 * UNIT_TYPES_COUNT + 2.
    UNIT_MODES : {
        // default action is idle.
        IDLE : 0,
        CHARGE : 1,
        WALL : 2
    },
    CONVERT_TYPES : {
        SOLDIER : 1,
        ELITE : 2,
        WALL : 3,
        TANK : 4,
        CHAMPION : 5
    },
    CONVERT_MATRIX : {
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
    STATUS_CONVERTED : 2,
    COLOR_COUNT : 3,
    // frame rate for general animations.
    FRAME_RATE : 1/60,
    
    ASSAULT_DEATA : 1 / 6 * 100,
    ASSAULT_RATE : 1 / 3,
    EXILE_RATE : 1 / 6,
    
    
    BLINK_RATE : 0.618,
    INVALID : -1,
    
    MAP_BATTLE_LAYER_NAME : "battleField",
    
    SPRITE_SCALE : {
        1 : 1.25,
        2 : 1.2,
        3 : 1.25,
        4 : 1.1
    },
    
    PRE_RAND_ID : "yri_",
    
    // priority when drawn in the canvas.
    Z_INDEX : {
        BACKGROUND : 0,
        CONTENT : 10,
    },
    
    ATTACKER_FOCUS_COLOR : new cc.Color(55, 229, 170, 204),
    DEFENDER_FOCUS_COLOR : new cc.Color(200, 50, 120, 204),
    UNIT_DELETE_COLOR : new cc.Color(64, 64, 64, 204),
    
    UNIT : {
        MAX_LEVEL : 20,
        MIN_LEVEL : 1
    },
    
    // calculated from unit configs.
    PRIORITY_CHUNK : 0,
    PRIORITIES : {
        // 0 ~ 1 chunk : normal priority for units;
        // 1 ~ 9 chunk - 1 : reserved priorities for other possible skills, for example "ranged";
        // priority = (10 + unit_mode) * priority_chunk + unit_priority
        PHALANX : 10,
    }
};

// append configs that's need be calculated.
(function() {
// set UNIT_TYPES_COUNT
for (var i in coh.LocalConfig.UNIT_TYPES) {
    ++coh.LocalConfig.UNIT_TYPES_COUNT;
}

})();
var coh = coh || {};

// ui related configs exist in resource.js,
// occupation related configs exist in coh.occupations.js.
coh.unitStatic = {
    archer : {
        // used to tag if the unit would be a normal unit that's holding a occupation.
        occupation : "archer",
        faction : "human",
        type : 1,
        // lower priority results in a closer position to the front line.
        priority : 8
    },
    knight : {
        occupation : "knight",
        faction : "human",
        type : 2,
        priority : 16
    },
    paladin : {
        occupation : "paladin",
        faction : "human",
        type : 4,
        priority : 24
    },
    // general readonly data for heros.
    hero : {
        // types should be set dynamically when generating.
        priority : 32
    }
};

// append configs that's need be calculated.
(function() {
// set PRIORITY_CHUNK for global config.
var maxPriority = 0;
for (var i in coh.unitStatic) {
    maxPriority = Math.max(maxPriority, +coh.unitStatic[i].priority);
}
coh.LocalConfig.PRIORITY_CHUNK = maxPriority;

})();
var coh = coh || {};

/**
 * Data required saving a unit.
 * 
 * The data below will override those configured in coh.unitStatic when there might be any conflicts.
 * Also, a getter/setter would be generated while creating a unit with these configs.
 */
coh.unitData = {
    unit : {
        level : 1,
        number : 1
    },
    // general readonly data for heros.
    hero : {
        type : 1,
        // levelhistory.
        levels : null,
        // jobname
        occupation : "",
        // modifier
        talent : 1
    },
    
    // specific configs for sevral heros. 
    leon : {
        talent : 2
    }
};var coh = coh || {};

coh.occupations = {
    archer : {
        attack : 12,
        hp : 4,
        speed : 75,        
        /**
         * <skill name> : {<affixName> : <affixLevel>}
         */
        skills : {
            ranged : 1
        }
    },
    knight : {
        attack : 15,
        hp : 6,
        speed : 60,
        skills : {
            melee : 1
        }
    },
    paladin : {
        attack : 14,
        hp : 5,
        speed : 66,
        skills : {
            melee : 1
        }
    },
    worrior : {
        attack : 16,
        hp : 5,
        speed : 48,
        skills : {
            melee : 1
        }
    },
    elf_archer : {
        attack : 9,
        hp : 2,
        speed : 105,
        skills : {
            ranged : 1
        }
    }
};var coh = coh || {};

coh.factions = {
    human : {
        wall : {
            hp : 8
        },
        colors : ["blue", "white", "gold"]
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
        convertor : "res/imgs/convertor.png"
    },
    sprite : {
        awen : {
            walking : {
                plist : "res/sprite/sprite.plist",
                img : "res/sprite/imgs/sprite.png"
            }
        },
        /**
         * XXXXXX TO BE OPTIMIZED
        convertor : {
            convert : {
                plist : "",
                img : ""
            }
        },
        */
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
     * Full fill the configs of sprite from coh.unitStatic.
     */
    var generateUnits = function(resObj) {
        var _coh = coh,
            colors;
        
        // if a unit is configured in both units and occupations, then it's a normal unit that's having a sprite.
        for (var i in _coh.unitStatic) {
            if (!_coh.unitStatic[i].occupation) continue;
            colors = _coh.factions[_coh.unitStatic[i].faction].colors;
            resObj.sprite[i] = {};
            resObj.sprite[i].idle = {
                plist : "res/sprite/" + i + "_idle.plist",
                img_0 : "res/sprite/imgs/" + i + "_" + colors[0] + ".png",
                img_1 : "res/sprite/imgs/" + i + "_" + colors[1] + ".png",
                img_2 : "res/sprite/imgs/" + i + "_" + colors[2] + ".png"
            };
            // XXXXXX TO BE ADDED
            resObj.sprite[i].assult = {
                plist : "res/sprite/" + i + "_idle.plist",
                img_0 : "res/sprite/imgs/" + i + "_" + colors[0] + ".png",
                img_1 : "res/sprite/imgs/" + i + "_" + colors[1] + ".png",
                img_2 : "res/sprite/imgs/" + i + "_" + colors[2] + ".png"
            };
            resObj.sprite[i].charge = {
                plist : "res/sprite/" + i + "_idle.plist",
                img_0 : "res/sprite/imgs/" + i + "_" + colors[0] + "_charge.png",
                img_1 : "res/sprite/imgs/" + i + "_" + colors[1] + "_charge.png",
                img_2 : "res/sprite/imgs/" + i + "_" + colors[2] + "_charge.png"
            };
        }
        return resObj;
    };
    
    coh.resources = generateRes(generateUnits(coh.res));
})();var coh = coh || {};
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
})();/**
 *@implements MapUtil
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
                 */
                getTilePosition : function(isAttacker, type, row, column) {
                    var x = 4 + column,
                        y = isAttacker ? 9 + row : 6 - row;
                    
                    return {
                        x : x,
                        y : y
                    };
                },
                
                /**
                 * opposite to the function getTilePosition.
                 * return row and columns with tile.
                 */
                getArrowIndex : function(isAttacker, type, tileX, tileY) {
                    
                    return {
                        row : isAttacker ? tileY - 9 : 6 - tileY,
                        column : tileX - 4
                    }
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
                
                isTileInGround : function(isAttacker, tile) {
                    var xRange = instance.getXRange(),
                        yRange = instance.getYRange(isAttacker);
                    
                    return tile.x >= xRange[0] 
                        && tile.x <= xRange[xRange.length - 1]
                        && tile.y >= Math.min.apply({}, yRange)
                        && tile.y <= Math.max.apply({}, yRange);
                },
                
                /**
                 * Get the default blank data group for this map.
                 * this will be uesd for a single player rendering, the attaker of defender.
                 */
                getDefaultDataGroup : function(isAttacker) {
                    return [
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0]
                    ];
                }
            }
        }
        
        // public static attributes
        instance.PUBLIC_ROW_COUNT = 2;
        
        return instance;
    };
    
    coh.utils.MapUtil_16X16 = function() {
        //getTilePosition
        return getInstance();
    }

    coh.utils.MapUtil_16X16.getInstance = getInstance;
})();
/**
 *@implements MapUtil
 * relay on instance of MapUtil,
 * Decorator of mapUtils.
 *
 * It's departed from mapUtil because it's related to the unit types.
 */

var coh = coh || {};
coh.utils = coh.utils || {};
(function() {
    var instance;
    
    var handlerList = {
        baseTransformer : {
            2 : function(isAttacker, position) {
                if (isAttacker) {
                    position.y += 1;
                }
                return position;
            },
            3 : function(isAttacker, position) {
                if (isAttacker) {
                    //~ position.x -= 1;
                }
                return position;
            },
            4 : function(isAttacker, position) {
                if (isAttacker) {
                    position.y += 1;
                }
                return position;
            }
        }
    };
    
    var getInstance = function(mapUtil) {
        if (!instance) {
            if (!mapUtil) return null;
            instance = {};
            
            for (var i in mapUtil) {
                instance[i] = mapUtil[i];
            };
            
            /**
             * functions modifying results from the tile selectors;
             */
            instance.getTilePosition = function(isAttacker, type, row, column) {
                var position = mapUtil.getTilePosition(isAttacker, type, row, column);
                handlerList.baseTransformer[type] && (position = handlerList.baseTransformer[type](isAttacker, position));
                
                return position;
            };
            
            /**
             * Extra interfaces used when new units out of the initialling process added.
             * It's just totally opposite to the original process, in cases for now.
             */
            instance.transformUpdate = function(isAttacker, type, position) {
                handlerList.baseTransformer[type] && (position = handlerList.baseTransformer[type](!isAttacker, position));
                return position;
            };
            
            /**
             * Get the left bottom tile fo the unitwarp.
             * in a 16X16 map, this tile is just the one it should be placed into the scene.
             */
            instance.getValidTile = function(unitBody) {
                var tiles = unitBody.getTileRecords();
                if (!tiles) return null;
                
                var  minX = Number.POSITIVE_INFINITY,
                    maxY = Number.NEGATIVE_INFINITY;
                
                for (var i = 0; tiles[i]; ++i) {
                    minX = Math.min(tiles[i].x, minX);
                    maxY = Math.max(tiles[i].y, maxY);
                }
                
                return {x : minX, y : maxY};
            }
        }
        return instance;
    };
    
    coh.utils.BaseTileTransformer = function(mapUtil) {
        //getTilePosition
        return getInstance(mapUtil);
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
    
    var g_utils = {
        sort : function(a, b) {
            return a - b;
        }
    };
    
    self = {
        
        /**
         * Activate an object as an adapter that can add and apply filters.
         * Filters added to the given object would be reacted by itself only.
         * @return {bool} false if there exist some a function having the same name with those to be added.
         */
        activate : function(obj) {
            
            // the buffer used by this object only.
            var buf = {
                filters : {},
                priorities : {}
            };
            
            var expandations = {
                
                /**
                 * @param handler {Function} function(lastReturnedValue, [argument1, [argument2, [...]]])
                 * @param priority {int} defaultly set 10. The smaller, the higher priority. Should be bigger than 0.
                 */
                addFilter : function(filterName, handler, priority) {
                    var _buf = buf,
                        priority = (undefined === priority) && 10 || priority;
                    
                    if (!(handler instanceof Function)) {
                        return false;
                    }
                    
                    !_buf.filters[filterName] && (_buf.filters[filterName] = {}, _buf.priorities[filterName] = []);
                    
                    if (!_buf.filters[filterName][priority]) {
                        _buf.priorities[filterName].push(priority);
                        _buf.priorities[filterName].sort(g_utils.sort);
                        _buf.filters[filterName][priority] = [];
                    }
                    
                    _buf.filters[filterName][priority].push(handler);
                    
                    return true;
                },
                
                removeFilter : function(filterName, handler, priority) {
                    var _buf = buf,
                        filters, result = [],
                        priority = (undefined === priority) && 10 || priority;
                    
                    if (!_buf.filters[filterName]) return false;
                    
                    filters = _buf.filters[filterName][priority];
                    for (var i = 0, filter; filter = filters[i]; ++i) {
                        if (filter != handler) result.push(filter);
                    }
                    // all filters removed, remove the priority from buffer.
                    if (!_buf.filters[filterName][priority].length) {
                        delete _buf.filters[filterName][priority];
                        for (i = 0, len = _buf.priorities[filterName].length; i < len; ++i) {
                            if (_buf.priorities[filterName][i] == priority) {
                                _buf.priorities[filterName][i] = Number.POSITIVE_INFINITY;
                                _buf.priorities[filterName].sort(g_utils.sort);
                            }
                        }
                    }
                    
                    _buf.filters[filterName][priority] = result;
                    return true;
                },
                
                applyFilters : function(filterName, originalValue) {
                    var _buf = buf,
                        priorities = _buf.priorities[filterName],
                        filterList,
                        filter,
                        value = originalValue,
                        arg = [],
                        i, j, leni, lenj;
                    
                    if (!priorities || !priorities.length) return value;
                    
                    for (i = 0, len = priorities.length; i < len; ++i) {
                        filterList = _buf.filters[filterName][priorities[i]];
                        for (j = 0, lenj = filterList.length; j < lenj; ++j) {
                            // rebuild arguments for next filter. 
                            // first param is currend calculated value, additional arguments can be parsed via the input.
                            arg = [value].concat([].slice.call(arguments, 2));
                            (filterList[j] instanceof Function) && (value = filterList[j].apply(obj, arg));
                            // use the last returned value as the new param.
                            value = value === undefined ? arg[0] : value;
                        }
                    }
                    
                    return value;
                },
                
                clearFilters : function(filterName) {
                    var _buf = buf;
                    
                    _buf.filters[filterName] = {};
                    
                    return true;
                }
            };
            
            var i;
            // in case of occupations.
            for (i in expandations) {
                if (obj[i]) return false;
            }
            for (i in expandations) {
                obj[i] = expandations[i];
            }
            return true;
        }
    }
    
    // register the object itself as an adapter.
    self.activate(self);
    
    return self;
    
})();/**
 * Calculator used to get basic attributes of a unit.
 */
 
var coh = coh || {};
coh.utils = coh.utils || {};
(function() {
    var instance;
    
    var LC = {
        ADDITIONS : {
            // type 2: elite units defined in coh.LocalConfig.UNIT_TYPES.
            2 : {
                attack : 2.5,
                hp : 2,
                speed : 0.5
            },
            // type 3: tanks defined in coh.LocalConfig.UNIT_TYPES.
            3 : {
                attack : 1.5,
                hp : 3.5,
                speed : 0.5
            },
            // type 4: champions defined in coh.LocalConfig.UNIT_TYPES.
            4 : {
                attack : 9,
                hp : 5,
                speed : 1/3
            }
        }
    };
    
    var buf = {
        instances : {}
    };
    
    var getInstance = function(maxLevel) {
        
        var _coh = coh;
        if (!maxLevel) maxLevel = _coh.LocalConfig.UNIT.MAX_LEVEL;
        
        // Would the "floor" be a problem as it's float calculating? Think not. Mind it here if it does.
        if (!buf.instances[maxLevel]) {
            buf.instances[maxLevel] = {
                /**
                 * level 1 - 0.22 of max;
                 * level max - 1 of max;
                 */
                getAttack : function(unit) {
                    var attack = unit.getAttack(),
                        level = unit.getLevel(),
                        rate = 0.5 * Math.pow(4 / maxLevel * level, 0.5);
                    
                    // rate is always 1 when level equals max level.
                    // make it modifible from outside for expanditions.
                    rate = _coh.utils.FilterUtil.applyFilters("getAttackModifier", rate, unit);
                    
                    // modifiers from types.
                    attack = attack * (LC.ADDITIONS[unit.getType()] && LC.ADDITIONS[unit.getType()].attack || 1);
                    return Math.floor(rate * attack);
                },
                
                /**
                 * level 1 - 0.22 of max;
                 * level max - 1 of max;
                 */
                getHp : function(unit) {
                    var hp = unit.getHp(),
                        level = unit.getLevel(),
                        rate = 0.5 * Math.pow(4 / maxLevel * level, 0.5);
                    
                    rate = _coh.utils.FilterUtil.applyFilters("getHpModifier", rate, unit);
                    
                    hp = hp * (LC.ADDITIONS[unit.getType()] && LC.ADDITIONS[unit.getType()].hp || 1);
                    return Math.floor(rate * hp);
                },
                
                /**
                 * level 1 - 0.54 of max;
                 * level max - 1 of max.
                 */
                getSpeed : function(unit) {
                    var speed = unit.getSpeed(),
                        level = unit.getLevel()
                        rate = Math.pow(1 / maxLevel * level, 0.2);
                    
                    rate = _coh.utils.FilterUtil.applyFilters("getSpeedModifier", unit);
                    
                    speed = speed * (LC.ADDITIONS[unit.getType()] && LC.ADDITIONS[unit.getType()].speed || 1);
                    return Math.floor(rate * speed);
                },
                
                /**
                 * Duration required recharging,
                    t = Math.floor(15 + Math.log(2.72, 1 / Math.pow(x, 3))):
                        0 : infinity
                        1 : 15
                        2 : 12
                        3 : 11
                        4 - 5 : 10
                        6 - 7 : 9
                        8 - 10 : 8
                        11 - 14 : 7
                        15 - 20 : 6
                        21 - 28 : 5
                        29 - 39 : 4
                        40 - 53 : 3
                        55 - 76 : 2
                        77 - 106 : 1
                        107 + : 0
                 */
                getDuration : function(speed) {
                    return Math.floor(15 + Math.log(2.72, 1 / Math.pow(x, 3)));
                }
            }
        }
        
        // public static attributes here, if exist.
        
        return buf.instances[maxLevel];
    };
    
    coh.utils.BaseAttrCalculator = function(maxLevel) {
        //getTilePosition
        return getInstance(maxLevel);
    }

    coh.utils.BaseAttrCalculator.getInstance = getInstance;
})();
/**
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
    locateTo : function(isAttacker, node, color) {
        
        if (this.focusedNode == node) return;
        
        var frameRate = coh.LocalConfig.FRAME_RATE * 5,
            _cohView = coh.View,
            _cc = cc;
        
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
        
        this.setBgColor(color || this.bgColor);
        
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
            this.runAction(_cc.moveTo(frameRate, node.x, node.y));
            
            _cohView.tryStopAction(this.arrowRight, this.arrowRight.moveAction);
            this.arrowRight.runAction(this.arrowRight.moveAction = _cc.moveTo(frameRate, node.width, node.height));
        
            _cohView.tryStopAction(this.background, this.background.scaleAction);
            this.background.runAction(
                this.background.scaleAction = _cc.scaleTo(frameRate, node.width / this.background.width, node.height / this.background.height)
            );
        }
        
        this.setVisible(true);
        
        // create simple animations
        this.runFocusAnimat(isAttacker);
        
        this.focusedNode = node;
    },
    
    focusOn : function(isAttacker, node, color) {
        
        this.setActColor(color || this.actColor);
        
        this.stopFocusAnimat(isAttacker);
        this.arrowDirection.setVisible(false);
        
        this.focusedNode = node;
    },
    
    exile : function(node, isAttacker, color) {
        
        color && this.setBgColor(color);
        
        this.arrowDirection.setRotation(isAttacker ? 0 : 180);
        
        this.focusedNode = node;
    },
    
    hide : function() {
        this.setVisible(false);
        this.focusedNode = null;
    },
    
    updateColor : function(newColor) {
        var _coh = coh;
        
        _coh.View.tryStopAction(this.arrowDirection, this.arrowDirection.tint);
        this.background.runAction(
            this.arrowDirection.tint = cc.tintTo(
                _coh.LocalConfig.FRAME_RATE * 5, 
                newColor.r, 
                newColor.g, 
                newColor.b
            )
        );
    },
    
    setBgColor : function(newColor) {
        if (newColor instanceof cc.Color) {
            this.bgColor = newColor;
            this.updateColor(newColor);
        }
    },
    
    setActColor : function(newColor) {
        if (newColor instanceof cc.Color) {
            this.actColor = newColor;
            this.updateColor(newColor);
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
                animMode : animation mode constructor, cc.repeatForever for default.
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
                animMode : spriteConfig.animMode || _cc.repeatForever,
                color : spriteConfig.color === undefined ? -1 : spriteConfig.color
            }
            
            srcName = "img" + (sc.color === _coh.LocalConfig.INVALID ? "" : "_" + (+sc.color));
            
            action = sc.animMode(self.getAnimation(unitName, animationName, srcName, sc.rate));
            
            var sprite = new sc.cons(buf.animFrames[unitName][animationName][srcName][0]);
            sprite.runAction(action);
            
            return sprite;
        },
        
        /**
         * uses coh.res.sprite.<unitName>.<animationName>.<textureIndex>.
         */
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
/**
 * Super class for all units.
 * @impliments FilterUtil, can add and apply filters.
 * Details for type/status/mode/color:
 * @see config.js, UNIT_TYPES for all types.

    color : color of the unit, defined in faction configurations. 3 colors in current version, it would be generated radomly while creating a unit.
    type : read only, the basic field of the unit. Type of a unit is defined in unit configurations.
        whenever a type should be returned, it should only be those ones defined in config.UNIT_TYPES.
    mode : what the unit is doing at the moment. Defaultly set 0 (idle).
    status : keycode used calculating. 
        status = (mode * typeCount + type) * colorCount + color.
    for status == 12: 
        color == 0;
        type == 4;
    0 - blank;
    1 - reserved;
    2 - reserved;
    3 - 0/1;
    4 - 1/1;
    5 - 2/1;
    ...
 *
 */
coh.Unit = function(unitName, savedData) {
    
    var self = this,
        _coh = coh,
        // occupation config
        O_LC = _coh.occupations[unitName],
        // unit config
        U_LC = _coh.unitStatic[unitName];
    
    var buf = {
        id : 0,
        name : false,
        // level 1 for default.
        level : _coh.LocalConfig.UNIT.MIN_LEVEL,
        color : _coh.LocalConfig.INVALID,
        // check coh.LocalConfig.UNIT_MODES for full mode list.
        // idle for default.
        mode : _coh.LocalConfig.UNIT_MODES.IDLE,
        isHero : false,
        
        // other configurations from LC.
        conf : {},
        
        // initilized in constructor.
        savedData : {}
    };
    
    var construct = function(unitName, savedData) {
        
        var _buf = buf,
            _lc = {},
            _coh = coh,
            i;
        
        // register itself as a filter adapter.
        _coh.utils.FilterUtil.activate(self);
        
        _buf.name = unitName;
        
        // if a unit isn't having the name configed in occupations, let's treat it as a hero unit.
        if (U_LC.occupation == unitName) {
            for (i in U_LC) {
                _lc[i] = U_LC[i];
            }
            for (i in O_LC) {
                _lc[i] = O_LC[i];
            }
        } else {
            // load common configs for heros first;
            for (i in _coh.unitStatic["hero"]) {
                _lc[i] = _coh.unitStatic["hero"][i];
            }
            // if a hero is having other configs, let's load it here.
            for (i in U_LC) {
                _lc[i] = U_LC[i];
            }
            // set occupation-related functions
            self.setAsHero();
        }
        
        // other initializations required;
        // static configs, readonly.
        var index;
        for (i in _lc) {
            _buf.conf[i] = _lc[i];
            
            index = _coh.Util.getFUStr(i);
            // append getter for all configs.
            self["get" + index] = (function(i) {
                return function() {
                    return _coh.utils.FilterUtil.applyFilters("getUnit" + index, buf.conf[i], self);
                }
            })(i);
        }
        // dynamic data, read/write.
        var basicData = self.isHero() && _coh.unitData.hero || _coh.unitData.unit;
        // configs for specific heros.
        for (i in _coh.unitData[unitName]) {
            basicData[i] = _coh.unitData[unitName][i];
        }
        for (i in basicData) {
            // verifications could be appended outside.
            
            // it should be a global filter as at this time, the unit isn't returned yet. 
            _buf.savedData[i] = _coh.utils.FilterUtil.applyFilters("loadSavedData" +  i, savedData && savedData[i] || basicData[i], i, self);
            
            index = _coh.Util.getFUStr(i);
            self["get" + index] = (function(i) {
                return function() {
                    return _coh.utils.FilterUtil.applyFilters("getUnit" + index, _buf.savedData[i], self);
                }
            })(i);
            self["set" + index] = (function(i) {
                return function(value) {
                    _buf.savedData[i] = _coh.utils.FilterUtil.applyFilters("setUnit" + index, value, self);
                }
            })(i);
        }
        
        buf.id = _coh.LocalConfig.PRE_RAND_ID + _coh.Util.getRandId();
    }
    
    self.getName = function() {
        return buf.name;
    };
    
    self.getId = function() {
        return buf.id;
    };
    
    self.setColor = function(newColor) {
        return buf.color = newColor;
    };
    
    self.getColor = function() {
        return buf.color;
    };
    
    /**
     * could only be actived once the color is set.
     */
    self.getStatus = function() {
        var _buf = buf,
            _coh = coh;
        if (_buf.color == _coh.LocalConfig.INVALID) {
            return 0;
        }
        
        return (self.getType() + _buf.mode * _coh.LocalConfig.UNIT_TYPES_COUNT) * _coh.LocalConfig.COLOR_COUNT + _buf.color;
    };
    self.getMode = function() {
        return buf.mode;
    };
    self.setMode = function(modeId) {
        if (coh.LocalConfig.UNIT_MODES[modeId]) buf.mode = modeId;
    };
    
    self.getSavedData = function() {
        return buf.savedData;
    };
    
    self.isHero = function() {
        return buf.isHero;
    };
    
    // let's move extra functions out of the class defination, make it possible be expanded.
    self.setAsHero = function() {
        buf.isHero = true;
    };
    
    self.clone = function() {
        var clone = _coh.UnitFactory.getInstance(self.getName(), self.getSavedData());
        clone.setColor(self.getColor());
        clone.setMode(self.getMode());
        
        return clone;
    };
    
    construct.apply(self, arguments);
    
    return self;
};var coh = coh || {};

(function() {
/**
 * Unit factary and all public functions related to units.
 */
coh.UnitFactory = (function() {
    
    var self,
        _coh = coh,
        LC = _coh.LocalConfig;
    
    return self = {
        /**
         * get type by unit name.
         */
        getUnitType : function(unitName) {
            return (coh.unitStatic[unitName] && coh.unitStatic[unitName].type) || 0;
        },
        
        /**
         * factory function that returns the unit object via the given key.
         */
        getInstance : function(unitName) {
            var unit = new _coh.Unit(unitName);
            
            unit = coh.utils.FilterUtil.applyFilters("unitGenerated", unit);
            if (unit.isHero()) {
                unit = coh.utils.FilterUtil.applyFilters("heroGenerated", unit);
            }
            
            return unit;
        },
        
        getTypeFromStatus : function(status) {
            return ~~(+status / LC.COLOR_COUNT) % LC.UNIT_TYPES_COUNT;
        },
        
        getActionFromStatus : function(status) {
            return ~~(~~(+status / LC.COLOR_COUNT) / LC.UNIT_TYPES_COUNT);
        },
        
        getColorFromStatus : function(status) {
            return +status % LC.COLOR_COUNT;
        }
    }
    
})();

})();/**
 * @require Calculator
 */
var coh = coh || {};

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
coh.Player = function(unitConfig) {
    
    var self = this;
    
    var buf = {
        
        id : 0,
        
        /**
         * Should these dynamic data be loaded from saved data?
         *
        faction : false, 
        
        level : 0, 
        
        // generated from level
        currentHP : 0,
        totalHP : 0,
        */
        
        // attacker for default.
        isAttacker : true,
        
        faction : "human",
        
        units : {},
        
        /**
         * indexed by priority and unit type.
         */
        unitsUnplaced : {},
        
        savedData : {
            
            // saved data required from data configuration in coh.unitData.js.
            units : {
                /*
                <unitName> : {
                    <data_id> : <data_value>
                }
                */
            }
        }
    };
    
    handlerList = {
        calculator : null
    };
    
    var construct = function(unitConfig) {
        
        var _buf = buf,
            _coh = coh,
            _u = _buf.unitsUnplaced,
            unit;
        
        // generate random Id for the player.
        _buf.id = _coh.LocalConfig.PRE_RAND_ID + _coh.Util.getRandId();
        
        for (var unitName in unitConfig) {
            unit = _coh.unitStatic[unitName];
            if (!unit) continue;
            
            _u[unit.priority] = _u[unit.priority] || {};
            _u[unit.priority][unit.type] = _u[unit.priority][unit.type] || [];
            for (var unitCount = 0, total = unitConfig[unitName]; unitCount < total; ++unitCount) {
                _u[unit.priority][unit.type].push(unitName);
            }
        }
    };
    
    self.getId = function() {
        return buf.id;
    },
    
    self.getUnplacedUnit = function(status) {
        var _coh = coh,
            _buf = buf,
            _u = _buf.unitsUnplaced,
            type = _coh.UnitFactory.getTypeFromStatus(status),
            unit =null, 
            unitName;
        
        for (var i in _u) {
            if (_u[i][type]) {
                unitName = _coh.Util.popRandom(_u[i][type]);
                // for normal units, level & numbers are injected already;
                // for heros, data such as type/level history/occupation are generated, from savd data.
                unit = _coh.UnitFactory.getInstance(unitName, buf.savedData.units[unitName]);
                
                unit.setColor(_coh.UnitFactory.getColorFromStatus(status));
                
                break;
            }
        }
        
        if (!unit) return null;
        
        _buf.units[unit.getId()] = unit;
        return unit;
    };
    
    self.getNumOfUnplacedUnit = function() {
        var result = 0,
            _buf = buf;
        for (var priority in _buf.unitsUnplaced)  {
            for (var type in _buf.unitsUnplaced[priority]) {
                result += _buf.unitsUnplaced[priority][type].length;
            }
        }
        return result;
    };
    
    self.killUnit = function(unit) {
        var _buf = buf,
            unit = _buf.units[unit.getId()];
        
        if (unit) {
            _buf.unitsUnplaced[unit.getPriority()][unit.getType()].push(unit.getName());
            delete(_buf.units[unit.getId()]);
        }
    };
    
    self.getUnit = function(unitId) {
        return buf.units[unitId];
    };
    
    /*
    self.getCurrentHP = function() {
        return buf.currentHP;
    };
    
    self.getTotalHP = function() {
        return buf.totalHP;
    };
    */
    
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
    };
    self.setAsAttacker = function() {
        buf.isAttacker = true;
    };
    self.setAsDefender = function() {
        buf.isAttacker = false;
    };
    
    /**
     * be sure the given faction is configured in global config.
     */
    self.setFaction = function(factionStr) {
        buf.faction = coh.factions[factionStr] && factionStr || buf.faction;
    };
    self.getFaction = function() {
        return buf.faction;
    };
    
    self.getUnitAttack = function(unit, convertType) {
        if (convertType == coh.LocalConfig.CONVERT_TYPES.WALL) return 0;
        return handlerList.calculator.getAttack(unit);
    };
    
    self.getUnitHp = function(unit, convertType) {
        if (convertType == coh.LocalConfig.CONVERT_TYPES.WALL) return coh.factions[this.getFaction()].wall.hp;
        return handlerList.calculator.getHp(unit);
    };
    
    self.getUnitSpeed = function(unit, convertType) {
        if (convertType == coh.LocalConfig.CONVERT_TYPES.WALL) return 0;
        return handlerList.calculator.getSpeed(unit);
    };
    
    self.getChargingDuration = function(unit, convertType) {
        if (convertType == coh.LocalConfig.CONVERT_TYPES.WALL) return coh.LocalConfig.INVALID;
        return handlerList.calculator.getDuration(self.getUnitSpeed(unit), convertType);
    };
    
    self.setCalculator = function(newClt) {
        handlerList.calculator = newClt;
    };
    
    /**
     * set dynamic data.
     */
    self.setData = function(newDataObject) {
        buf.savedData = newDataObject;
    };
    
    /**
     * Get all dynamic data of the player in Object, for saving purpose.
     * Maybe it should be parsed into base64 or something like that?
     * Never mind, that's not this Class should be focused on.
     */
    self.getData = function() {
        // XXXXXX JSON.stringify to be used for this case.
        return buf.savedData;
    };
    
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
            for (var i in _lc.CONVERT_MATRIX) {
                convert = _lc.CONVERT_MATRIX[i];
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
        /**
         * @param current
         * @param config {Object}
         *  {
                [location type1] : [count of this type1],
                // ...
            }
         * @see config.js for more details of status & type & color.
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
    
        generatePlayerMatrix : function(blankDataGroup, player) {
            
            var unitConfig = {},
                units = player.getUnitConfig(),
                _coh = coh;
            
            var unitType;
            for (var unitName in units) {
                unitType = _coh.UnitFactory.getUnitType(unitName);
                unitConfig[unitType] || (unitConfig[unitType] = 0);
                unitConfig[unitType] += units[unitName];
            }
            
            var recharge = this.recharge(blankDataGroup, unitConfig);
            
            return recharge;
        },
        
        /**
         * find all possible convert at the given position for the color,
         * thus will test all those nodes with the same color at both left and right side to the target position.
         * we won't test those ones behind (row number + 1) the target position,
         * because that means the node was moved (position changed), while another findAllPossibleConverts required for that node.
         * this function is based on util.findConvert.
         * @return {
                column : column number,
                row : row number,
                converts : [<typeId>]
            }
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
    
coh.UnitBody = function() {
    
    var self = this;
    
    var buf = {
        player : null,
        battleScene : null,
        // just for a record, no other purposes.
        // indexed by x_y
        tileRecord : [],
        
        // if a wall or another phananx generated while charging, other animates won't hide the sprite.
        charging : false
    };

    var construct = function(unit) {
        
        var _coh = coh,
            _cc = cc,
            shadow = _cc.Sprite.create(_coh.res.imgs.shadow),
            typeConfig;;
        
        this.unit = unit;
        this.unitSprite = _coh.View.getSprite(unit.getName(), "idle", {color : this.unit.getColor()});
        this.tileSprite = _cc.DrawNode.create(),
        
        typeConfig = this.getTypeConfig();
        
        shadow.attr({
            x : 0,
            y : 0,
            anchorX: -0.05,
            anchorY: 0.3,
            scaleX : typeConfig[1] * 0.8,
            scaleY : 0.75,
            opacity:164
        });
        
        this.unitSprite.attr({
            x : 0,
            y : 0,
            scale : _coh.LocalConfig.SPRITE_SCALE[unit.getType()],
            anchorX: 0,
            anchorY: 0
        });
        
        this.tileSprite.attr({
            visible : false
        });
        
        this.unitSprite.addChild(shadow, _coh.LocalConfig.Z_INDEX.BACKGROUND);
        this.tileSprite.addChild(this.unitSprite, _coh.LocalConfig.Z_INDEX.CONTENT);
    }
    
    self.check = function() {
        this.unitSprite.setColor(g_lc.CHECK_COLOR);
        this.unitSprite.runAction(g_lc.FOCUS_BLINK);
    };
    
    self.unCheck = function() {
        this.unitSprite.setColor(g_lc.UNCHECK_COLOR);
        coh.View.tryStopAction(this.unitSprite, g_lc.FOCUS_BLINK);
    };
    
    self.exile = function(isAttacker) {
        var exiledY = (isAttacker ? -this.tileSprite.y : (this.tileSprite.parent.height - this.tileSprite.y)) - this.tileSprite.height / 2;
        this.unitSprite.runAction(g_lc.FOCUS_BLINK);
        this.unitSprite.runAction(this.unitSprite.runningAction = cc.moveTo(coh.LocalConfig.EXILE_RATE, this.unitSprite.x, exiledY));
    };
    
    self.unExile = function() {
        var _cohView = coh.View;
        _cohView.tryStopAction(this.unitSprite, g_lc.FOCUS_BLINK);
        _cohView.tryStopAction(this.unitSprite, this.unitSprite.runningAction);
        this.unitSprite.setOpacity(255);
        this.unitSprite.y = 0;
    };
    
    self.setBattleScene = function(scene) {
        buf.battleScene = scene;
    };
    
    self.getBattleScene = function() {
        return buf.battleScene;
    };
    
    self.setPlayer = function(player) {
        buf.player = player;
    };
    
    self.getPlayer = function() {
        return buf.player;
    };
    
    self.getTypeConfig = function() {
        return coh.LocalConfig.LOCATION_TYPE[self.unit.getType()];
    };
    
    /**
     * deep copy required for some cases, do it outside.
     */
    self.getTileRecords = function() {
        if (!buf.tileRecord.length) return null;
        return buf.tileRecord;
    };
    
    self.addTileRecord = function(newTile) {
        buf.tileRecord.push(newTile);
    };
    
    self.removeTileRecord = function(oldTile) {
        var _buf = buf;
        
        for (var i = 0; _buf.tileRecord[i]; ++i) {
            if (_buf.tileRecord[i].x == oldTile.x && _buf.tileRecord[i].y == oldTile.y) {
                _buf.tileRecord = _buf.tileRecord.slice(0, i).concat(_buf.tileRecord.slice(i + 1));
            }
        }
    };
    
    self.updateTileRecord = function(oldTile, newTile) {
        self.removeTileRecord(oldTile);
        self.addTileRecord(newTile);
    };
    
    self.clearTileRecords = function() {
        buf.tileRecord = [];
    };
    
    /**
     * play convert animations, or change status if necessary.
     */
    self.charge = function() {
        var srcName = "img_" + (+self.unit.getColor() || 0);
        
        // XXXXXX TO BE ADDED.
        self.unitSprite.runAction(cc.repeatForever(coh.View.getAnimation(self.unit.getName(), "charge", srcName)));
        buf.charging = true;
    };
    
    /**
     * once the unit is in charge, it will be in charge forever until it's ready to attack.
     */
    self.isCharging = function() {
        return buf.charging;
    };
    
    /**
     * if a unit can be convert to another one, it must be a type 1 unit.
     * Once the convert finished, the unit would be removed from the battle scene.
     */
    self.convertTo = function(unitTo, callback) {
        var _coh = coh,
            _buf = buf,
            convertSprite = cc.Sprite.create(res.imgs.convertor),
            startPos = _buf.battleScene.getPositionFromTile(_buf.tileRecord[0]),
            targetPos = _buf.battleScene.getPositionFromTile(_coh.Util.getRandom(unitTo.getTileRecords())),
            // the control(mid) point can be checked randomly from the square generated by startPos and targetPos.
            ctrlPos = _coh.Util.getBesierMidPos(startPos, targetPos);
        
        self.tileSprite.addChild(convertSprite);
        convertSprite.runAction(cc.repeatForever(cc.rotateBy(_coh.LocalConfig.EXILE_RATE, 360)));
        
        // move the unit tile, picking a random tile from the target unit.
        self.tileSprite.runAction(cc.sequence(cc.bezierTo(_coh.LocalConfig.EXILE_RATE, [startPos, ctrlPos, targetPos])), cc.callFunc(function(){
            _coh.Util.isExecutable(callback) && callback(self);
            
            // remove the unit itself from it's battleScene.
            _buf.battleScene.removeUnit(self);
        }));
    };
    
    /**
     * make a copy of itself, including any info related to the scene.
     */
    self.clone = function() {
        var clone = new coh.UnitBody(self.unit.clone());
        clone.setBattleScene(self.getBattleScene());
        clone.setPlayer(self.getPlayer());
        
        var tiles = self.getTileRecords();
        
        for (var i in tiles) {            
            clone.addTileRecord(tiles[i]);
        }
        
        return clone;
    }
    
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
                
                _coh.scene["battle"].setMapUtil(
                    _coh.utils.BaseTileTransformer.getInstance(_coh.utils.MapUtil_16X16.getInstance())
                );
                
                cc.director.runScene(
                    cc.TransitionFadeDown.create(1.2, _coh.scene["battle"])
                );
                // Run battle logic here, place the player.
                
                // do placcePlayer when entered, to prevent 0 width for map tiles.
                var attacker, aMatrix, defender, dMatrix;
                var generatePlayer = function(battleScene) {
                    // attacker
                    attacker = new _coh.Player({ archer : 16, knight: 1, paladin: 1});
                    attacker.setAsDefender();
                    attacker.setCalculator(_coh.utils.BaseAttrCalculator.getInstance());
                    aMatrix = _coh.Battle.generatePlayerMatrix(battleScene.getDefaultDataGroup(), attacker);
                    // defender
                    defender = new _coh.Player({ archer : 24, knight: 4, paladin: 3});
                    defender.setAsAttacker();
                    defender.setCalculator(_coh.utils.BaseAttrCalculator.getInstance());
                    dMatrix = _coh.Battle.generatePlayerMatrix(battleScene.getDefaultDataGroup(), defender);
                    
                    _coh.utils.FilterUtil.removeFilter("battleSceneEntered", generatePlayer, 12);
                    battleScene.setAttackerTurn(false);
                };
                
                var render = function(battleScene) {
                    
                    battleScene.renderPlayer(attacker, aMatrix);
                    battleScene.renderPlayer(defender, dMatrix);
                    
                    _coh.utils.FilterUtil.removeFilter("battleSceneReady", render, 12);
                    
                    _coh.utils.FilterUtil.applyFilters("battleUnitsReady", battleScene);
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
 * @require {Battle}: Utils for battle scene.
 * @require {MapUtil}: if you would like to place units to the battle ground;
 *  inject it from the outer factory.
 *
 * @impliments FilterUtil, can add and apply filters.
 * to many of them my friend. Just search for "applyFilters" to find all.
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
                [positionY] : [UnitBody],
                ... // other unit groups with the position x;
            },
            // other row data
        }
         */
        unitMatrix : {},
        // used for the battle util, records the status data group.
        statusMatrix : {},
        
        // Units that are ready to charge.
        phalanxList : [],
        
        focusTag : null,
        
        isAttackerTurn : true,
        
        // if the user is focusing on some a unit, the focusnode would be locked.
        // that means it won't react on any other locate events.
        focusTagLocked : false
    };

    var handlerList = {
        // private properties
        // should be injected from outside.
        mapUtil : null
    };
    
    // private functions
    var util = {
        /**
         * Rules: if it's out of X border, locate to the nearest column that's having an unit;
         * Otherwise, locate to the poingint column, and always try to find a unit that's closer to the front line.
         */
        getAvaliableTiles : function(isAttacker, tileX, tileY) {
            var _ts = handlerList.mapUtil,
                xRange = _ts.getXRange(),
                yRange = _ts.getYRange(isAttacker),
            
                overRight = tileX > xRange[xRange.length - 1],
                overLeft = tileX < xRange[0],
            
                overTop = isAttacker ? tileY < yRange[_ts.PUBLIC_ROW_COUNT] : tileY > yRange[_ts.PUBLIC_ROW_COUNT],
                overBottom = isAttacker ? tileY > yRange[yRange.length - 1] : tileY < yRange[yRange.length - 1],
            
                startX = overRight ? xRange[xRange.length - 1] : overLeft ? xRange[0] : tileX,
                endX = overRight ? xRange[0] : overLeft ? xRange[xRange.length - 1] : tileX,
                deataX = overRight ? -1 : overLeft ? 1 : 0,
            
                startY = overTop ? yRange[0] : overBottom ? yRange[yRange.length - 1] : tileY,
                endY = overTop ? yRange[yRange.length - 1] : yRange[0],
                deataY = overTop ? (isAttacker ? 1 : -1) : (isAttacker ? -1 : 1),
            
                _buf = buf,
                x = startX, y = startY;
            
            do {
                y = startY;
                do {
                    if (_buf.unitMatrix[x] && _buf.unitMatrix[x][y]) return {x : x, y : y};
                    y += deataY;
                } while (y != endY);
                x += deataX;
            } while (x != endX);
            
            // nothing matches found for given tile.
            return null;
        },
        
        getRealColumnTile : function(unitBody, columnTile) {
            var _ts = handlerList.mapUtil,
                typeConfig = unitBody.getTypeConfig(),
                isAttacker = unitBody.getPlayer().isAttacker(),
                yRange = _ts.getYRange(isAttacker),
                // find the possible tile that can hold the unit.
                realColTile = columnTile,
                // target will use the given x and found y(in realColTile) for further calculating.
                targetTile;
            
            // check from left to right, for max to 4(type 4) possible tiles.
            for (var i = 0; i < typeConfig[1]; ++i) {
                targetTile = self.getLastTileInColumn(isAttacker, {x : columnTile.x + i, y : columnTile.y});
                if (targetTile && columnTile && (isAttacker ? (targetTile.y > realColTile.y) : (targetTile.y < realColTile.y))) {
                    realColTile = targetTile;
                }
            }
            targetTile = {
                x : columnTile.x,
                y : realColTile.y
            };
            
            targetTile = yRange[0] == targetTile.y ? {
                x : targetTile.x,
                y : yRange[_ts.PUBLIC_ROW_COUNT] + (isAttacker ? 1 : -1) * (typeConfig[0] - 1)
            } : {
                x : targetTile.x, 
                y : targetTile.y + (isAttacker ? 1 : -1) * typeConfig[0]
            };
            
            return targetTile;
        },
        
        /**
         * When 1 unit removed, all other units behind it should be in movinging mode to the front line.
         * This function is used to find the directly affected units behind the given unit.
         * @param tileRecords should be parsed incase the given unitWarps isn't holding the tile infomation.
         */
        getMovingUnits : function(unitBodies, tileRecords) {
            
            var _buf = buf,
                tiles,
                columns,
                isAttacker,
                startY,
                i, j,
                tmpUnit,
                result = [];
            
            for (i = 0; unitBodies[i]; ++i) {
                tiles = tileRecords[i],
                columns = {},
                isAttacker = unitBodies[i].getPlayer().isAttacker(),
                startY = 0;
                
                for (j in tiles) {
                    columns[tiles[j].x] = tiles[j].x;
                    startY = startY && (isAttacker ? Math.max : Math.min)(startY, tiles[j].y) || tiles[j].y;
                }
                for (j in columns) {
                    tmpUnit = _buf.unitMatrix[columns[j]][startY  + (isAttacker ? 1 : -1)];
                    tmpUnit && result.push(tmpUnit);
                }
            }
            
            return result;
        },
        
        /**
         * Find the best tile for given unit in the battle field,
         * When in it's column it's the first blank tile count from the front line.
         *
         * @param [isBlankFukc] {Function({UnitBody})} optional. Function used to check if the tile should be treated as a "blank" tile.
         *  if not specificed, "blank" means no unit is at the found tile.
         *  return true if it's a "blank" tile for the comparation, that means when the unit is trying to move to the front line, it should pass through the tile checked.
         *
         * @return the distance from it's current column to the target tile. Always positive.
         */
        getValidDistance : function(unitBody, isBlankFukc) {
            var _ts = handlerList.mapUtil,
                _buf = buf,
                tiles = unitBody.getTileRecords(),
                isAttacker = unitBody.getPlayer().isAttacker(),
                yRange = _ts.getYRange(isAttacker),
                startY,
                deataY = isAttacker ? -1 : 1,
                endY = yRange[_ts.PUBLIC_ROW_COUNT],
                columns = {},
                y, i, distance = 0, 
                unitFound,
                checkIsBlank = checkIsBlank || function(unitBody) {
                    return !unitBody;
                };
            
            for (i in tiles) {
                columns[tiles[i].x] = tiles[i].x;
                startY = startY && (isAttacker ? Math.min : Math.max)(startY, tiles[i].y) || tiles[i].y;
            }
            
            if (isAttacker ? startY <= endY : startY >= endY) return 0;
            
            y = startY;
            // Magic again...
            do {
                y += deataY;
                unitFound = false;
                for (i in columns) {
                    if (!checkIsBlank(_buf.unitMatrix[columns[i]][y])) {
                        unitFound = true;
                        break;
                    } else {
                        unitFound = false;
                    }
                }
                if (!unitFound) {
                    distance -= deataY;
                } else {
                    break;
                }
            } while (y != endY);
            
            // return moved distance.
            return distance * deataY;
        },
        
        /**
         * try to reset the positoin of given units, make sure there would be no blank tiles in front of them.
         * @return distance moved.
         */
        moveToFrontLine : function(unitBody) {
            var _ts = handlerList.mapUtil,
                validTile = self.getValidTile(unitBody),
                distance = util.getValidDistance(unitBody),
                isAttacker = unitBody.getPlayer().isAttacker();
            
            if (distance) {
                self.setUnitToTile(unitBody, {x : validTile.x, y : validTile.y - (isAttacker ? 1 : -1) * distance});
                return true;
            }
            return false;
        },
        
        /**
         * withdraw a single unit back to rowCount tiles from the front line.
         * if it's running out of the border, kill the unit.
         * @return <bool> if the unit is still in the battle ground.
         */
        withdraw : function(unitBody, rowCount) {
            var _ts = handlerList.mapUtil,
                _buf = buf,
                isAttacker = unitBody.getPlayer().isAttacker(),
                yRange = _ts.getYRange(isAttacker),
                validTile = self.getValidTile(unitBody);
            
            // out of range, kill the unit.
            if (isAttacker ? validTile.y - rowCount > yRange[yRange.length - 1] : validTile.y - rowCount < yRange[yRange.length - 1]) {
                self.removeUnit(unitBody);
                return false;
            }
            
            self.setUnitToTile(unitBody, {x : validTile.x, y : validTile.y + rowCount * (isAttacker ? 1 : -1)});
            
            return true;
        },
        
        inPhalanx : function(phalanxHash, cType, unitBody) {
            var unitId = unitBody.getId(),
                phalanxes = phalanxHash[unitId];
            
            if (phalanxes && phalanxes.length) {
                // phalanx type won't be 0.
                for (var i = 0, pType; pType = phalanxes[i]; ++i) {
                    if (pType == cType) return true;
                }
            } 
            return false;
        },
        
        /**
         * @return the priority of a unitBody.
         * It's a value that contains the current mode/action of the affected unit.
         */
        getPriority : function(unitBody) {
            // set "ranged" as a skill, and use filters for the skill to fix the priority while queueing.
            var priority = unitBody.unit.getPriority(),
                _lc = coh.LocalConfig;
            
            // ranged ones would be handled when getPriority, within the filter getUnitPriority.
            priority = (unitBody.unit.getMode() + _lc.PRIORITIES.PHALANX) * _lc.PRIORITY_CHUNK + priority;
            
            return priority;
        },
        
        /**
         * @param convert convert object generated from coh.Battle that having data below:
            {
                column : column number,
                row : row number,
                converts : [<typeId>],
                isAttacker : <bool>
            }
         * For each phalanxes created, status of units within the phalanx should be updated,
         * while the updates would be applied to battleScene in setUnitToTile.
         */
        getPhalanx : function(convert) {
            var _buf = buf,
                _coh = coh,
                // right bottom tile of the convert
                rbTile = handlerList.mapUtil.getTilePosition(convert.isAttacker, _coh.LocalConfig.UNIT_TYPES.SOLDIER, convert.row, convert.column),
                convertMatrix,
                unitBodies,
                unitBody,
                halt = false,
                row, column,
                // used to check dulplicated phalanxes for a single unit.
                // indexed by unitid.
                phalanxHash = {},
                i,j,k,
                cType;
            
            for (i = 0, cType; cType = convert.converts[i]; ++i) {
                convertMatrix = _coh.LocalConfig.CONVERT_MATRIX[cType];
                headUnit = null;
                halt = false;
                unitBodies = [];
                for (j = 0; row = convertMatrix[j]; ++j) {   
                    for (k = 0; column = row[k]; ++k) {
                        unitBody = _buf.unitMatrix[rbTile.x - column.length + j + 1][rbTile.y - row.length + k + 1];
                        
                        // if the unit is in another phalanx, create a copy of it for the new one.
                        if (util.inPhalanx(phalanxHash, cType, unitBody)) {
                            // cloned units won't be counted into the backup of the player.
                            unitBody = unitBody.clone();
                        }
                        
                        unitBodies.push(unitBody);
                        phalanxHash[unitBody.unit.getId()] = (phalanxHash[unitBody.unit.getId()] || []).concat(cType);
                    }
                }
                
                // create the phalanx object.
                
                // for walls, each unit is a single phalanx.
                if (cType == _coh.LocalConfig.CONVERT_TYPES.WALL) {
                    for (j = 0, unitBody; unitBody = unitBodies[j]; ++j) {
                        _buf.phalanxList.push(new _coh.Phalanx(cType, [unitBody]));
                    }
                } else {
                    _buf.phalanxList.push(new _coh.Phalanx(cType, unitBodies));
                }
                
                // XXXXXX To Be Continued.
                // phalanxes except for walls won't react to any mouse events.
                
                // queue phalanxes first, then
                // gather all convertedUnitBodies and make a queue for them.
            }
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
            
            // XXXXXX not it used here at the moment. Maybe filters related to the battle scene should be optimized in future.
            coh.utils.FilterUtil.activate(this);
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
                    scale : winSize.width / sprite.width,
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
        
        setMapUtil : function(selector) {
            handlerList.mapUtil = selector;
        },
        
        getTileInGlobal : function(posX, posY) {
            var scale = this.battleMap.scale;
            
            return handlerList.mapUtil.getTileFromCoord(
                this.battleMap.width * scale, 
                this.battleMap.height * scale,
                posX - this.battleMap.x * scale, 
                posY
            );
        },
        
        getTileInTurn : function(isAttacker,  posX, posY) {
            var tile = this.getTileInGlobal(posX, posY);
            
            // searching for the nearest unit from a given tile;
            return util.getAvaliableTiles(isAttacker, tile.x, tile.y);
        },
        
        /**
         * return the last tile that's having a unit occupied.
         */
        getLastTileInColumn : function(isAttacker, tile) {
            
            if (!buf.unitMatrix[tile.x]) return null;
            
            var _buf = buf,
                range = handlerList.mapUtil.getYRange(isAttacker),
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
        
        isTileInGround : function(isAttacker, tile) {
            return handlerList.mapUtil.isTileInGround(isAttacker, tile);
        },
        
        getPositionFromTile : function(tile) {
            return self.getMapTile(tile).getPosition();
        },
        
        getMapTile : function(tile) {
            return self.battleMap.getLayer(coh.LocalConfig.MAP_BATTLE_LAYER_NAME).getTileAt(tile);
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
        getUnitInTurn : function(isAttacker, posX, posY) {
            return this.getUnit(this.getTileInTurn(isAttacker, posX, posY));
        },
        
        getLastUnitInColumn : function(isAttacker, tile) {
            return this.getUnit(this.getLastTileInColumn(isAttacker, tile));
        },
        
        isLastUnitInColumn : function(isAttacker, unitBody, tile) {
            return unitBody == this.getLastUnitInColumn(isAttacker, unitBody, tile);
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
        locateToUnit : function(unitBody){
            
            // if tag locked - for example focusing on some a unit - do nothing.
            if (buf.focusTagLocked) return;
            
            var tag = this.getFocusTag(),
                isAttacker = unitBody.getPlayer().isAttacker(),
                _coh = coh;
            
            tag.locateTo(isAttacker, unitBody.tileSprite, isAttacker ? _coh.LocalConfig.ATTACKER_FOCUS_COLOR : _coh.LocalConfig.DEFENDER_FOCUS_COLOR);
            if (isAttacker != this.isAttackerTurn()) {
                tag.arrowDirection.setVisible(false);
            }
        },
        
        /**
         * Mark a unit to be deleted.
         */
        focusOnUnit : function(unitBody){
            
            if (!unitBody) return;
            buf.focusTagLocked = false;
            
            var tag = this.getFocusTag(),
                isAttacker = unitBody.getPlayer().isAttacker(),
                _coh = coh;
            
            // sprite changes to the tag;
            this.locateToUnit(unitBody);
            tag.focusOn(isAttacker, unitBody.tileSprite);
            
            // sprite changes to the unit itself
            unitBody.check();
            
            // buffer changes
            buf.focusTagLocked = true;
        },
        
        /**
         * @return if the unit could be exiled for a relocation.
         *  mainly for types that's occupying 2 columns.
         */
        exileUnit : function(unitBody) {
            
            if (!unitBody) return false;
            
            // do validate for types that's having more than 2 columns.
            var typeConfig = unitBody.getTypeConfig(),
                isAttacker = unitBody.getPlayer().isAttacker(),
                tiles = unitBody.getTileRecords(),
                lastUnit,
                _buf = buf;
            
            for (var i in tiles) {
                if (self.getLastUnitInColumn(isAttacker, tiles[i]) != unitBody) return false;
            }
            
            for (var i in tiles) {
                self.unbindUnitToTile(unitBody, tiles[i]);
            }
            
            buf.focusTagLocked = false;
            
            // sprite changes to the tag;
            this.locateToUnit(unitBody);
            
            this.getFocusTag().exile(unitBody.tileSprite, isAttacker);
            
            unitBody.exile(isAttacker);
            
            // buffer changes
            buf.focusTagLocked = true;
            
            return true;
        },
        
        cancelFocus : function() {
            var _buf = buf;
            _buf.focusTagLocked = false;
            
            // interestingly I can't hide it here, or the cursor fails.
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
        
        getDefaultDataGroup : function(isAttacker) {
            return handlerList.mapUtil.getDefaultDataGroup(isAttacker);
        },
        
        renderPlayer : function(player, matrix) {
            
            var _coh = coh,
                _buf = buf;
            
            // for animate purpose
            _buf.unitDelay = 0;
            for (var i = 0, row; row = matrix.succeed[i]; ++i) {
                for (var j = 0, status; (status = row[j]) != undefined; ++j) {
                    status && _coh.UnitFactory.getTypeFromStatus(status) && this.placeUnit(player, status, i, j);
                    _buf.unitDelay += _coh.LocalConfig.ASSAULT_DEATA;
                    if (!player.getNumOfUnplacedUnit()) return;
                }
            }
        },
        
        /**
         * mapUtil required. Should be injected from outside.
         * translate rowNum and colNum into tile and position to be placed.
         */
        placeUnit : function(player, status, rowNum, colNum) {
            
            // find correct unit from the player via given status(type defined);
            var _coh = coh,
                _buf = buf,
                scale = this.battleMap.scale,
                
                // color would be kept in the unit object.
                unit = player.getUnplacedUnit(status),
                unitBody = new _coh.UnitBody(unit),
                tileSprite = unitBody.tileSprite,
                
                // get tile and do the possible translation, for example for a type 2 defender unit.
                tilePosition = handlerList.mapUtil.getTilePosition(player.isAttacker(), _coh.UnitFactory.getTypeFromStatus(status), rowNum, colNum);
            
            // init unitBody
            unitBody.setPlayer(player);
            unitBody.setBattleScene(self);
            
            setTimeout(function() {
                self.battleMap.addChild(tileSprite, tilePosition.y);
                self.setUnitToTile(unitBody, tilePosition);
            }, _buf.unitDelay);
            
            // XXXXXX For debug usage.
            _coh.unitList = _coh.unitList || [];
            _coh.unitList.push(unitBody);
        },
        
        /**
         * @param tile the bottom left tile of the unit.
         * @param callback {Function} would be checked when the moving animate finished.
         */
        setUnitToTile : function(unitBody, tile, callback) {
            
            // find correct unit from the player via given status(type defined);
            var _coh = coh,
                _buf = buf,
                isAttacker = unitBody.getPlayer().isAttacker(),
                // get tile and do the possible translation, for example for a type 2 defender unit.
                mapTile = self.getMapTile(tile),
                unit = unitBody.unit,
                unitSprite = unitBody.unitSprite,
                tileSprite = unitBody.tileSprite,
                srcName = "img_" + (+unit.getColor() || 0),
                typeConfig = unitBody.getTypeConfig(),
                // if there exist tiles in the unitBody and having the same column number (x), move it directly here.
                // Mind type 4, whose x was modified while handling exiledTileFrom.
                originalY = self.getValidTile(unitBody);
            
            // prevent focus, no other mouse/touch actions during the moving;
            _buf.focusTagLocked = true;
            
            if (originalY) {
                originalY = self.getPositionFromTile({x : tile.x, y : originalY.y}).y;
            }
            self.unbindUnit(unitBody);
            
            // set unit matrix for further usage.
            // mind types that's not only having 1 tile.
            for (var rowCount = 0; rowCount < typeConfig[0]; ++rowCount) {
                for (var columnCount = 0; columnCount < typeConfig[1]; ++columnCount) {
                    _buf.unitMatrix[tile.x + columnCount] = _buf.unitMatrix[tile.x + columnCount] || {};
                    self.bindUnitToTile(unitBody, {x : tile.x + columnCount, y : tile.y - rowCount});
                }
            }
            
            tileSprite.attr({
                width: mapTile.width * typeConfig[1],
                height: mapTile.height * typeConfig[0]
            });
            tileSprite.attr({
                visible : true,
                x : mapTile.x,
                y : originalY || (isAttacker ? - tileSprite.height : tileSprite.height + self.battleMap.height),
                zIndex : tile.y
            });
            
            // Animations appended.
            unitSprite.runAction(cc.repeatForever(_coh.View.getAnimation(unit.getName(), "assult", srcName)));
            tileSprite.runAction(tileSprite.runningAction = cc.sequence(cc.moveTo(coh.LocalConfig.ASSAULT_RATE, mapTile.x, mapTile.y), cc.callFunc(function() {
                unitBody.unitSprite.runAction(cc.repeatForever(_coh.View.getAnimation(unit.getName(), "idle", srcName)));
                
                _coh.Util.isExecutable(callback) && callback();
                
                // restore focus tag.
                _buf.focusTagLocked = false;
            })));
        },
        
        bindUnitToTile : function(unitBody, tile) {
            var _buf = buf,
                type = unitBody.unit.getType(),
                playerId = unitBody.getPlayer().getId(),
                indexes = handlerList.mapUtil.getArrowIndex(unitBody.getPlayer().isAttacker(), type, tile.x, tile.y);
            
            _buf.unitMatrix[tile.x][tile.y] = unitBody;
            
            // It should be removed/updated when moved or removed.
            // That's why I didn't want to do this.
            unitBody.addTileRecord(tile);
            
            // modify the status matrix for the player
            !_buf.statusMatrix[playerId] && (_buf.statusMatrix[playerId] = []);
            !_buf.statusMatrix[playerId][indexes.row] && (_buf.statusMatrix[playerId][indexes.row] = []);
            _buf.statusMatrix[playerId][indexes.row][indexes.column] = unitBody.unit.getStatus();
        },
        
        unbindUnitToTile : function(unitBody, tile) {
            var _buf = buf,
                type = unitBody.unit.getType(),
                indexes = handlerList.mapUtil.getArrowIndex(unitBody.getPlayer().isAttacker(), type, tile.x, tile.y);
            
            _buf.unitMatrix[tile.x][tile.y] = null;
            delete buf.unitMatrix[tile.x][tile.y];
            unitBody.removeTileRecord(tile);
            
            _buf.statusMatrix[unitBody.getPlayer().getId()][indexes.row][indexes.column] = 0;
        },
        
        unbindUnit : function(unitBody) {
            var tiles = unitBody.getTileRecords();
            for (var i in tiles) {
                self.unbindUnitToTile(unitBody, tiles[i]);
            }
            unitBody.battleScene = null;
        },
        
        /**
         * @param columnTile the last tile of the column specificed by columnTile.y;
         * @param lastTile the tile where the mouse just moved from, it's also a tile that's having the last unit in that column.
         */
        prepareMoving : function(unitBody, columnTile, lastTile) {
            var _buf = buf,
                isAttacker = unitBody.getPlayer().isAttacker(),
                typeConfig = _coh.LocalConfig.LOCATION_TYPE[unitBody.unit.getType()],
                focusTag = self.getFocusTag(),
                // find the possible tile from direction 1,
                // while direction 1 is where the last tile comes from.
                targetTile = util.getRealColumnTile(
                    unitBody, {
                        x : lastTile.x > columnTile.x ? columnTile.x : columnTile.x + 1 - typeConfig[1],
                        y : columnTile.y
                    }),
                targetMapTile;
            
            if (!handlerList.mapUtil.isTileInGround(isAttacker, targetTile)) {
                // try to find it in another direction.
                targetTile = util.getRealColumnTile(
                    unitBody, {
                        x : lastTile.x < columnTile.x ? columnTile.x : columnTile.x + 1 - typeConfig[1],
                        y : columnTile.y
                    });
            }
            // faild finding a possible tile, do nothing.
            if (!handlerList.mapUtil.isTileInGround(isAttacker, targetTile)) {
                focusTag.arrowDirection.setVisible(false);
                return false;
            }
            
            targetTile = handlerList.mapUtil.transformUpdate(isAttacker, unitBody.unit.getType(), targetTile);
            
            targetMapTile = self.getMapTile(targetTile);
            
            focusTag.arrowDirection.attr({
                visible : true,
                rotation : isAttacker ? 0 : 180,
                x : unitBody.tileSprite.width / 2 - focusTag.x + targetMapTile.x
            });
            
            unitBody.unitSprite.attr({
                x : 0,
                y : 0
            });
            unitBody.tileSprite.attr({
                x : targetMapTile.x,
                y : targetMapTile.y,
                zIndex : targetTile.y
            });
            
            return targetTile;
        },
        
        // mind removeUnits - all affected units are gathered, sharing the same convert group.
        removeUnit : function(unitBody) {
            
            if (buf.focusTagLocked) return;
            
            this.cancelFocus();
            this.getFocusTag().hide();
            
            var _util = util,
                affectedUnits,
                // get the tileRecords before it's removed.
                tileRecords = unitBody.getTileRecords().concat();
            
            // XXXXXX Play the removing animate in target tile.
            coh.utils.FilterUtil.applyFilters("unitRemoved", unitBody);

            self.battleMap.removeChild(unitBody.tileSprite, true);
            self.unbindUnit(unitBody);
            unitBody.getPlayer().killUnit(unitBody.unit);
            
            // return affected unit for further usage, such as queueUnits.
            return {
                unitBody : unitBody,
                tiles : tileRecords
            };
        },
        
        /**
         * Given units would try to array to the front line.
         * Mind that the units might have been removed already, so tileRecords for that unit is required.
         * @return all moved units.
         */
        queueUnits : function(unitBodies, tileRecords) {
            
            var movedUnits = unitBodies,
                affectedUnits,
                _util = util,
                result = [];
            
            for (var i = 0, unitBody; unitBody = movedUnits[i]; ++i) {
                // if it's still in the battle field, charge.
                if (unitBody.getTileRecords()) {
                    if (_util.moveToFrontLine(unitBody)) {
                        result.push(unitBody);
                    };
                }
            }
            
            while (movedUnits.length) {
                affectedUnits = util.getMovingUnits(movedUnits, tileRecords);
                movedUnits = [];
                tileRecords = [];
                for (var i in affectedUnits) {
                    // the unit isn't moved, so it won't have any effect on other units behind it.
                    tileRecords.push(affectedUnits[i].getTileRecords().concat());
                    if (_util.moveToFrontLine(affectedUnits[i])) {
                        movedUnits.push(affectedUnits[i]);
                        result.push(affectedUnits[i]);
                    } else {
                        tileRecords.pop();
                    }
                }
            };
            
            return result;
        },
        
        /**
         * Similar to queueUnits but it affectes all units within a phalanx.
         * Differently, given phalanxes would never have been removed, so no tileRecords required as a param.
         */
        queuePhalanxes : function(phalanxes) {
            var _util = util,
                _coh = coh,
                distance,
                targetTile,
                unitBody,
                priority,
                // If it's having other units or phalanxes in front of the current one, let's make a comparation.
                comparedPriority;
            
            // find the correct positions for the phalanxes, and then withdraw units if necessary.
            for (var i = 0, phalanx; phalanx = phalanxes[i]; ++i) {
                unitBody = phalanx.getLeadUnit();
                distance = _util.getValidDistance(unitBody, function(comparedUnit) {
                    return _util.getPriority(comparedUnit) < _util.getPriority(unitBody);
                });
                
                // The front-line rules about melee phalanxes should be handled outside into the filters,
                // Maybe somewhere else related to a skill set.
                distance = _coh.utils.FilterUtil.applyFilters("phalanxMovingDistance", distance, phalanx);
                // if no charge required for current phalanx, do nothing.
                if (!distance) continue;
                
                // if there exist a unit in target place, let's try withdraw for sevral tiles.
                // specially, if the unit belongs to enimy side, there would be something bad happen to that unlucky guy.
                // XXXXXX It's about the skill "melee", let's leave it later after a normal phalanx.
                
                
                // Function withdraw should receives another 1 params:
                //  shouldKill: if the unit run out of the border;
                // and return false if a withdraw fails when should not kill and a border must be reached.
                // In that case, the phalanx will have to choose it's action when trying to charge to the front line.
                // XXXXXX Here we go, the distance found. What then?
            }
        },
        
        /**
         * All units in the selected column will try to withdraw for <rowCount> tiles back.
         * If the row is having more units than the battle grould allowed, overflowed units would be killed.
         * Mind units that's having more than 1 tile.
         * @return all moved units that's still not removed.
         */
        withdraw : function(unitBodies, rowCount) {
            
            var movedUnits = unitBodies,
                affectedUnits,
                _util = util,
                tileRecords = [],
                result = [];
            
            for (var i = 0, unitBody; unitBody = movedUnits[i]; ++i) {
                // if it's still in the battle field, charge.
                if (unitBody.getTileRecords()) {
                    tileRecords.push(unitBody.getTileRecords().concat());
                    if (_util.withdraw(unitBody, rowCount)) {
                        result.push(unitBody);
                    };
                }
            }
            
            while (movedUnits.length) {
                affectedUnits = util.getMovingUnits(movedUnits, tileRecords);
                movedUnits = [];
                tileRecords = [];
                for (var i in affectedUnits) {
                    tileRecords.push(affectedUnits[i].getTileRecords().concat());
                    movedUnits.push(affectedUnits[i]);
                    
                    // if the unit is removed drew to a withdraw, it won't have an effect on new phalanxes that might generate.
                    if (_util.withdraw(affectedUnits[i], rowCount)) {
                        result.push(affectedUnits[i]);
                    }
                }
            };
            
            return result;
        },
        
        doConverts : function(unitBodies) {
            
            var _buf = buf,
                _coh = coh,
                _mu = handlerList.mapUtil,
                player,
                unitBody,
                tile,
                index,
                converts,
                allConverts = [];
            
            for (var i = 0; unitBody = unitBodies[i]; ++i) {
                // do nothing for types that's not 1.
                if (unitBody.unit.getType() != 1) continue;
                
                // Here we go!
                tile = unitBody.getTileRecords()[0];
                player = unitBody.getPlayer();
                index = _mu.getArrowIndex(
                    player.isAttacker(), 
                    unitBody.unit.getType(), 
                    tile.x, 
                    tile.y
                );
                converts = _coh.Battle.findAllPossibleConverts(_buf.statusMatrix[player.getId()], 
                    index.column, 
                    index.row, 
                    unitBody.unit.getColor()
                );
                
                for (var j in converts) {
                    converts[j].isAttacker = player.isAttacker();
                }
                
                allConverts = allConverts.concat(converts);
            }
                
            // Mind dulplicated converts for multy units.
            // No units could be joint into 2 converts that's having the same type, except for walls.
            for (var i = 0, convert; convert = allConverts[i]; ++i) {
                util.getPhalanx(allConverts[i]);
            }
        },
        
        // XXXXXX for debug usage currently.
        getStatusMatrix : function() {
            return buf.statusMatrix;
        },
        
        getValidTile : function(unitBody) {
            return handlerList.mapUtil.getValidTile(unitBody);
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
};var coh = coh || {};

coh.skills = {
    /**
     * <skill name> : [<affixName>]
     */
    ranged : ["ranged"],
    melee : ["melee"]
};var coh = coh || {};

(function() {
var levelCalculators = {
    // defaultly used calculator when no one defined in effect
    
    /**
     * @param level level of a unit.
     * Most effects would be more effective when the level of the unit gains.
     */
    levels : function() {
        return 1;
    }
}, _lc = levelCalculators;

coh.effects = {
    // ranged effect will be actived when calculating priorities of a unit when generating a phalanx.
    ranged : {
        // interested filters
        filters : {
            // "this" in the handler would be the unit that's having the skill,
            // so it's ignored in the artguments list.
            getUnitPriority : function(priority) {
                return priority - coh.LocalConfig.PRIORITY_CHUNK;
            }
        },
        // the effect won't gains with the level
        levels : false
    }
};

})();var coh = coh || {};

(function() {
var levelCalculators = {
    // defaultly used calculator when no one defined in affix
    levels : function(level) {
        return 1;
    }
}, _lc = levelCalculators;

coh.affixes = {
    ranged : {
        effects : [
            {
                /**
                 * <effect_name> : [<effect param>]
                 * the value would be parsed as params of the effect levels calculator. So it's soppused to be an array.
                 */ 
                ranged : 1
            }
        ],
        // defines how the effect should gains with the level.
        // default config: _lc.levels
        levels : false
    }
};

})();/**
 * Do events and filters bindings related to skills.
 * This class is designed to add the skill sets to units without injecting to the original code,
 *  and translate global filters into units'.
 */
coh.SkillController = (function() {

    var self;
    
    var _coh = coh,
        _fu = _coh.utils.FilterUtil;
    
    /**
     * no it's not a good idea...
     *  whatelse can I do?
     */
    var utils = {
        // do the global -> unit translation for applying filters.
        filterTranslation : function() {
            var filterList = [],
                i, j, filters, 
                _coh = coh,
                _fu = _fu;
            
            // XXXXXX is there any lazy-loadiing way making it instead of a full scan to the attributes?
            for (i in _coh.effects) {
                filters = _coh.effects.filters;
                for (j in filters) {
                    // $1 can be optional.
                    j = j.replace(/\$1$/, "");
                    // record filter names only, and no dulplicates.
                    filterList[j] = j;
                }
            }
            
            var filterName, unitIndex;
            // do the translation from global to unit for recorded filters.
            for (i in filterList) {
                // remove unit locaters.
                // XXXXXX will it be a problem in future here?
                /*

                an effect may define a filter like this:
                    getAttrAttack$1 : function(){};
                while that means in the globally triggered filter named "getAttrAttack", 
                there might be more than 1 params in the argument list (except for the first value in the arglist) that is an instance of a Unit, 
                just like this:
                    
                    coh.util.FilterUtil.applyFilter("getAttrAttack", value, unit1, unit2);

                while it may be translated into:
                    unit1.applyFilter("getAttrAttack", value, unit2);
                    unit2.applyFilter("getAttrAttack$2", value, unit1);
                when $1 is ignored as the default one.

                $1 here means this effect should react the filter triggered by unit1 only.
                if there is only 1 unit in the filter, $1 can be optional.

                Note that only when /$\d+/ is written at the end of the filtername would be recognized.
                 */
                unitIndex = (unitIndex = i.match(/\$(\d+)$/)) && +unitIndex[1] || 1;
                filterName = i.replace(/\$id+$/, "");
                _fu.addFilter(
                    filterName, 
                    (function(unitIndex, filterName) {
                        return function() {
                            // call faster than apply, in non-strict mode.
                            var args = [].slice.call(arguments),
                                i, len, unitCounter = 0,
                                filterNameInUnit = filterName;
                            
                            for (i = 1, len = args.length; i < len; ++i) {
                                if (args[i] instanceof coh.Unit) {
                                    ++unitCounter;
                                }
                                if (unitCounter == unitIndex) {
                                    unitIndex != 1 && (filterNameInUnit += "$" + unitIndex);
                                    args.splice(i, 1);
                                    return args[i].applyFilter.apply(args[i], [filterNameInUnit].concat(args));
                                }
                            }
                        }
                    })(unitIndex, filterName)
                );
            }
        }
    }
    
    // bind skill reactions to each unit created.
    _fu.addFilter("unitGenerated", function(unit) {
        self.setupUnitSkills(unit);
    });
    
    return self = {
        // allow an unit be able to react to skills,
        // adding filters to the unit for applying in future(parsed from global filters).
        setupUnitSkills : function(unit) {
            // do unit.addFilters with all configured skills to the unit.
            var skills = unit.getSkills(),
                skillLevel,
                skillName, 
                affixes,
                effect,
                effectName,
                i,
                filters,
                filterName,
                filterAction,
                levelFunc,
                _coh = coh;
            
            for (skillName in skills) {
                affixses = _coh.skills[i];
                // incase it's not found in config.
                if (!affixses) continue;
                skillLevel = skills[i];
                for (i = 0, effectName; effectName = affixses[i]; ++i) {
                    effect = _coh.effects[effectName];
                    // incase it's not found in config.
                    if (!effect) continue;
                    filters = effect.filters;
                    levelFunc = effect.levels;
                    for (filterName in filters) {
                        filterAction = filters[filterName];
                        // ignore $1.
                        filterName = filterName.replace(/\$1$/, "");
                        unit.addFilter(filterName, filterAction);
                    }
                }
            }
        }
    };
})();/**
 * Do events and filters bindings related to battle scene.
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

coh.BattleSceneController = (function() {
    
    var self,
        _coh = coh;
    
    var buf = {
        battle : {            
            // mark the last handled unitBody and tile, for click and slide events.
            lastUnitBody : null, 
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
                unitGlobal = battleScene.getUnitInGlobal(location.x, location.y),
                tile = battleScene.getTileInTurn(
                    unitGlobal ? unitGlobal.getPlayer().isAttacker() : battleScene.isAttackerTurn(), 
                    location.x, 
                    location.y
                ),
                unitBody = battleScene.getUnit(tile);
            
            if (unitBody) {
                battleScene.locateToUnit(unitBody);
                _coh.utils.FilterUtil.applyFilters("battleUnitsLocated", unitBody, tile, battleScene);
            }
        },
        
        doCheckOrExile : function(event, battleScene) {
            var location = event.getLocationInView(),
                tile = battleScene.getTileInGlobal(location.x, location.y),
                // only units in its side could be clicked or exiled.
                unitBody = battleScene.getUnitInTurn(battleScene.isAttackerTurn(), location.x, location.y),
                clickedUnit = battleScene.getUnitInGlobal(location.x, location.y),
                lastUnitBody = buf.battle.lastUnitBody,
                lastTile = buf.battle.lastTile;
            
            // the same unit clicked: clickedUnit should be the same as the lastUnitBody.
            if (lastUnitBody && unitBody == lastUnitBody && clickedUnit == unitBody) {
                _coh.utils.FilterUtil.applyFilters("battleUnitClicked", unitBody, tile, battleScene);
                return;
            }
            
            // slide from top to bottom of the battle field, or the last unit in the group clicked.
            if (lastTile && tile.x == lastTile.x && (battleScene.isAttackerTurn() ? tile.y > lastTile.y : tile.y < lastTile.y)) {
                _coh.utils.FilterUtil.applyFilters("battleUnitExiled", clickedUnit && tile || lastTile, battleScene);
                return;
            }
            
            _coh.utils.FilterUtil.applyFilters("battleActionsCanceled", unitBody, tile, battleScene);
        },
        
        doExileMove : function(event, battleScene) {
            var location = event.getLocationInView(),
                globalTile = battleScene.getTileInGlobal(location.x, location.y),
                columnTile = battleScene.getLastTileInColumn(battleScene.isAttackerTurn(), globalTile),
                _buf = buf,
                lastTile = _buf.battle.exiledTileTo || _buf.battle.lastTile,
                targetTile;
            
            if (!columnTile || !_buf.battle.exiledUnit || lastTile.x == columnTile.x) {
                return;
            }
            
            targetTile = battleScene.prepareMoving(_buf.battle.exiledUnit, columnTile, _buf.battle.exiledTileTo || _buf.battle.exiledTileFrom);
            targetTile && (_buf.battle.exiledTileTo = targetTile);
        },
        
        doUnExile : function(event, battleScene) {
            
            var _buf = buf,
                location = event.getLocationInView(),
                globalTile = battleScene.getTileInGlobal(location.x, location.y),
                exiledUnit = _buf.battle.exiledUnit;
            
            exiledUnit && exiledUnit.unExile(); 
            
            // There should be a target tile found, 
            // further more, the target tile should be within the battle field,
            // to make sure the user could cancel the exile with a slide out of the ground.
            
            // Check the range of 
            if (
                _buf.battle.exiledTileTo 
                && _buf.battle.exiledTileTo.x != _buf.battle.exiledTileFrom.x 
                && battleScene.isTileInGround(battleScene.isAttackerTurn(), globalTile)) {
                
                battleScene.setUnitToTile(exiledUnit, _buf.battle.exiledTileTo, function() {
                    // If type 1 - normal solders, then there might be converts generated.
                    // Let's find and make it directly.
                    if (exiledUnit.unit.getType() == 1)
                    battleScene.doConverts([exiledUnit]);
                });
            } else {
                battleScene.setUnitToTile(exiledUnit, _buf.battle.exiledTileFrom);
            }
            
            _buf.battle.exiledUnit = null;
            _buf.mouseAction = "locate";
        },
        
        recordTile : function(event, battleScene) {            
            var location = event.getLocationInView(),
                tile = battleScene.getTileInGlobal(location.x, location.y),
                unitBody = battleScene.getUnitInTurn(battleScene.isAttackerTurn(), location.x, location.y);

            buf.battle.lastUnitBody = unitBody;
            buf.battle.lastTile = tile;
        }
    };
    
    // Magic.
    var actionsConfig = {
        battle : {
            exile : {
                onMouseMove : handlerList.doExileMove,
                onMouseUp : handlerList.doUnExile,
                onMouseDown : function(event, battleScene) {
                    handlerList.recordTile(event, battleScene);
                    handlerList.doExileMove(event, battleScene);
                }
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
    });
    
    _coh.utils.FilterUtil.addFilter("battleUnitClicked", function(unitBody, tile, battleScene) {
        
        var _buf = buf,
            removedUnitBody;
        
        if (_buf.battle.checkedUnit == unitBody) {
            util.clearStatus(battleScene);
            removedUnitBody = battleScene.removeUnit(unitBody, tile);
            battleScene.queueUnits([removedUnitBody.unitBody], [removedUnitBody.tiles]);
        } else {
            util.clearStatus(battleScene);
            battleScene.focusOnUnit(unitBody);
            
            _buf.battle.checkedUnit = unitBody;
        }
    });
    
    _coh.utils.FilterUtil.addFilter("battleUnitExiled", function(tile, battleScene) {
        var isAttacker = battleScene.isAttackerTurn(),
            exiledTileFrom = battleScene.getLastTileInColumn(isAttacker, tile),
            exiledUnit = battleScene.getUnit(exiledTileFrom),
            _buf = buf,
            unitTiles = exiledUnit && exiledUnit.getTileRecords();
        
        util.clearStatus(battleScene);
        
        // the original tile should be modified for type that's not 1, to prevent the wrong position restored while canceling.
        // when set to map, the target tile should be the left bottom tile of the unit.
        for (var i in unitTiles) {
            if (exiledTileFrom.x >= unitTiles[i].x) exiledTileFrom.x = unitTiles[i].x;
            if (exiledTileFrom.y <= unitTiles[i].y) exiledTileFrom.y = unitTiles[i].y;
        }
        
        // unExile would be executed in the doUnExile process.
        if (battleScene.exileUnit(exiledUnit)) {
            _buf.battle.exiledUnit = exiledUnit;
            _buf.battle.exiledTileFrom = exiledTileFrom;
            _buf.battle.exiledTileTo = null;
            
            _buf.mouseAction = "exile";
        }
    });
    
    _coh.utils.FilterUtil.addFilter("battleActionsCanceled", function(unitBody, tile, battleScene) {
        util.clearStatus(battleScene);
    });
    
    _coh.utils.FilterUtil.addFilter("defenderTurnStarted", function(battleScene) {
    });
    
    _coh.utils.FilterUtil.addFilter("attackerTurnStarted", function(battleScene) {
    });
    
    _coh.utils.FilterUtil.addFilter("convertUnit", function(unitFrom, unitTo, cType) {
        coh.utils.BaseCvtUtil.getInstance().convert(unitFrom, unitTo, cType);
    });
    
    return self = {
        
    };
})();