var coh = coh || {};

(function() {
/**
 * @param units 
    {
        [unitName] : [unitCount],
        // ... others
    }
 */
coh.Player = function(faction, level, units) {
    
    var self = this;
    
    var buf = {
        dataGroup : [],
        
        faction : false, 
        
        level : 0, 
        
        // generated from level
        currentHP : 0,
        totalHP : 0
    };
    
    var construct = function() {
        
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
    
    construct();
    
    return self;
};
    
})();