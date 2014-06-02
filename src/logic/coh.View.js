var coh = coh || {};
coh.View = (function() {
    
    var self;
    
    var buf = {
        spriteCache : cc.spriteFrameCache
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
    
        getSprite : function(unitName, actionName, color, rate) {
            
            var animFrame = [],
                anim,
                action,
                sprite,
                _coh = coh,
                _sc = buf.spriteCache;
            
            _sc.addSpriteFrames(
                _coh.res.sprite[unitName][actionName].plist, 
                _coh.res.sprite[unitName][actionName]["img" + (color === undefined ? "" : "_" + (+color))]
            );
            
            for (var i in _sc._spriteFrames) {
                animFrame.push(_sc._spriteFrames[i]);
            }
            anim = cc.Animation.create(animFrame, rate || _coh.LocalConfig.FRAME_RATE);
            action = cc.RepeatForever.create(cc.Animate.create(anim));
            
            var sprite = new cc.Sprite(animFrame[0], null);
            sprite.runAction(action);
            
            return {
                sprite : sprite,
                // animation
                action : action
            }
        }
    }
    
})();