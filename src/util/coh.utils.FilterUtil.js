var coh = coh || {};
coh.utils = coh.utils || {};

coh.utils.FilterUtil = (function() {
    
    var self;
    
    var buf = {
        filters : {},
        activedPriorities : {}
    };
    
    var controller = {
        sort : function(a, b) {
            return a - b <= 0;
        }
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
            !_buf.activedPriorities[filterName] && (_buf.activedPriorities[filterName] = []);
            
            if (!_buf.filters[filterName][priority]) {
                _buf.filters[filterName][priority] = [];
                _buf.activedPriorities[filterName].push(priority);
                _buf.activedPriorities[filterName].sort(controller.sort);
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
                priorities,
                filterList,
                filter,
                value = originalValue,
                arg = [],
                i, j, leni, lenj;
            
            if (!_buf.filters[filterName]) return value;
            
            priorities = _buf.activedPriorities[filterName];
            
            for (i = 0, leni = priorities.length; i < leni; ++i) {
                filterList = _buf.filters[filterName][priorities[i]];
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
            _buf.activedPriorities[filterName] = [];
        }
    }
    
})();