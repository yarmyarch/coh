var coh = coh || {};
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
        
        getStatus : function(type, color) {
            return (+type) * LC.COLOR_COUNT + (+color);
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
    
        generatePlayerMatrix : function(blankDataGroup, player) {
            
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
            
            var recharge = this.recharge(blankDataGroup, unitConfig);
            
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
*/