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
    
        /**
         *@param [spriteConfig], configurations related to the animation.
         *  each property is having default values.
            {
                rate : frame rate, LC.FRAME_RATE for default.
                cons : sprite constructor. cc.Sprite for default.
                color : color, 0/1/2
            }
         */
        getSprite : function(unitName, actionName, spriteConfig) {
            
            var animFrame = [],
                anim,
                action,
                sprite,
                _coh = coh,
                _sc = buf.spriteCache;
            
            // rebuild the config
            var sc = {
                rate : spriteConfig.rate || _coh.LocalConfig.FRAME_RATE,
                cons : spriteConfig.cons || cc.Sprite,
                color : spriteConfig.color === undefined ? -1 : spriteConfig.color
            }
            
            // XXXXXX
            // Bug here. How can I depart different animations from each other in the cache without conficts,
            // While the plist file could be reused?
            _sc.addSpriteFrames(
                _coh.res.sprite[unitName][actionName].plist, 
                _coh.res.sprite[unitName][actionName]["img" + (sc.color === -1 ? "" : "_" + (+sc.color))]
            );
            
            for (var i in _sc._spriteFrames) {
                animFrame.push(_sc._spriteFrames[i]);
            }
            anim = cc.Animation.create(animFrame, sc.rate);
            action = cc.RepeatForever.create(cc.Animate.create(anim));
            
            var sprite = new sc.cons(animFrame[0], null);
            sprite.runAction(action);
            
            return {
                sprite : sprite,
                // animation
                action : action
            }
        }
    }
    
})();