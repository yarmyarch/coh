var coh = coh || {};
coh.View = (function() {
    
    var self;
    
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
        }
    }
    
})();