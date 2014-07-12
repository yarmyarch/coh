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
    
})();