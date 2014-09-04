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
                            arg = value == undefined ? (arg.length && arg || [].slice.call(arguments, 1)) : [value].concat([].slice.call(arguments, 2));
                            (filterList[j] instanceof Function) && (value = filterList[j].apply(obj, arg));
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
    
})();