var coh = coh || {};
coh.Battle = (function(){
    
    var self;
    
    var LC = {
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
        COLOR_COUNT : 3
    };
    
    var buf = {
        occupiedRowIndex : {}
    };
    
    var handlerList = {
        // indexed by the type configed in local config.
        locationTest : {
            1 : function(dataGroup, column) {
                return dataGroup[dataGroup.length - 1][column] == LC.BLANK;
            },
            2 : function(dataGroup, column) {
                return dataGroup[dataGroup.length - 1][column] == LC.BLANK && dataGroup[dataGroup.length - 2][column] == LC.BLANK;
            },
            3 : function(dataGroup, column) {
                return dataGroup[dataGroup.length - 1][column] == LC.BLANK && dataGroup[dataGroup.length - 1][column + 1] == LC.BLANK;
            },
            4 : function(dataGroup, column) {
                return 
                    dataGroup[dataGroup.length - 1][column] == LC.BLANK
                    && dataGroup[dataGroup.length - 1][column + 1] == LC.BLANK
                    && dataGroup[dataGroup.length - 2][column] == LC.BLANK
                    && dataGroup[dataGroup.length - 2][column + 1] == LC.BLANK;
            }
        }
    }
    
    var util = {
        /**
         * @return the first element that's not equals to LC.BLANK. Starts from 0.
         */
        getNonBlankIndex : function(dataGroup, rowNum) {
            
            // XXXXXX what if there are blanks blocked by some a 2*2 target?
            var nBlankIndex = 0, 
                blankIndex = dataGroup.length,
                blank = 0,
                p;
            while(nBlankIndex != blankIndex - 1) {
                p = nBlankIndex + ~~((blankIndex - nBlankIndex) / 2);
                if (dataGroup[p][rowNum] != blank) {
                    nBlankIndex = p;
                } else {
                    blankIndex = p;
                }
            }
            return nBlankIndex;
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
                //~ nBlankIndex = util.getNonBlankIndex(dataGroup, rowNum),
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
                        match = match && (status == dataGroup[rowNum+ 1 - convert.length + rowInCon][colNum + 1 - queue.length + colInQueue]);
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
        
        locationTest : function(dataGroup, type, column) {
            return handlerList.locationTest[type](dataGroup, column);
        },
        
        colorTest : function(dataGroup, type, column, color) {
            if (type != 1) return true;
            else {
                
            }
        },
        
        /**
         * check and append new row data into the result set if necessary.
         * for the given target array like [0,1,2], newly appended result would be ["0","0","0"].
         */
        checkResultSet : function(resultRet, targetArray, column) {
            var _buf = buf;
            
            // init the result set.
            if (!result[_buf.occupiedRowIndex[column] + 1]) {
                var rowCount = 0;
                while (rowCount <= _buf.occupiedRowIndex[column]) {
                    result.push([targetArray.join(" ").replace(/\d+/g, 0).split(" ")]);
                }
            }
            return resultRet;
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
                currentBuf = current.concat(),
                totalCount = 0,
                items = [],
                _lc = LC,
                _buf = buf;
            
            // deep copy the current data group.
            for (var i = 0, row; row = current[i]; ++i) {
                currentBuf[i] = current[i].concat();
            }
            
            for (var i in config) {
                totalCount += config[i];
                for (var j = 0; j < config[i]; ++j) {
                    items.push(i);
                }
            }
            
            var targetIndex, targetType, totalColumns = currentBuf[0].length, column, columnCount = 0, color, colorCount = 0, match = true;
            while (items.length > 0) {
                targetIndex = ~~(Math.random() * items.length);
                targetType = items[targetIndex];
                items[targetIndex] = items[length - 1];
                items.length = items.length - 1;
                
                // position check
                do {
                    if (columnCount == 0) {
                        column = ~~(Math.random() * _lc.COLOR_COUNT);
                    } else {
                        column = (column + columnCount) % totalColumns;
                    }
                    ++columnCount;
                } while (match = util.locationTest(currentBuf, targetType, column) && columnCount < totalColumns);
                
                // color check
                if (match) do {
                    if (colorCount == 0) {
                        color = ~~(Math.random() * _lc.COLOR_COUNT);
                    } else {
                        color = (color + colorCount) % _lc.COLOR_COUNT;
                    }
                    ++colorCount;
                } while (match = util.colorTest(currentBuf, targetType, column, color) && colorCount < _lc.COLOR_COUNT);
                
                // if faild - for instance, no places for a 2*2 target.
                // otherwise, place the target into buffered data group.
                if (!match) {
                    faild.push(targetType);
                } else {
                    var typeConfig = _lc.LOCATION_TYPE[targetType];
                    for (var rowCount = 0; rowCount < typeConfig[0]; ++rowCount) {
                        for (var columnCount = 0; columnCount< typeConfig[1]; ++columnCount) {
                            if (!_buf.occupiedRowIndex[column + columnCount]) _buf.occupiedRowIndex[column + columnCount] = -1;
                            result = util.checkResultSet(result, currentBuf[0], column + columnCount);
                            result[_buf.occupiedRowIndex[column + columnCount]][column + columnCount] = targetType * _lc.COLOR_COUNT + color;
                            ++_buf.occupiedRowIndex[column + columnCount];
                        }
                    }
                }
            }
            
            return {
                succeed : result,
                faild : faild
            }
        }
        
        /**
         * find all possible convert at the given position for the color,
         * thus will test all those nodes with the same color at both left and right side to the target position.
         * we won't test those ones behind (row number + 1) the target position,
         * because that means the node was moved (position changed), while another findAllPossibleConvert required for that node.
         * this function is based on util.findConvert.
         * @return 
         */
        findAllPossibleConvert : function(dataGroup, colNum, rowNum, color) {
            var leftPointer, rightPointer;
            
        },
    }
})();

/**
 * Sample data group:
[
    [4,6,3,3,12,12,3,3],
    [3,6,4,5,12,12,3,3],
    [3,5,3,5,3,3,0,4],
    [5,4,4,0,3,3,0,3],
    [0,0,0,0,0,0,0,5],
    [0,0,0,0,0,0,0,0]
]
*/