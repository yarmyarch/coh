var coh = coh || {};
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
                animMode : animation mode constructor, cc.RepeatForever for default.
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
                animMode : spriteConfig.animMode || _cc.RepeatForever,
                color : spriteConfig.color === undefined ? -1 : spriteConfig.color
            }
            
            srcName = "img" + (sc.color === -1 ? "" : "_" + (+sc.color));
            
            action = sc.animMode.create(self.getAnimation(unitName, animationName, srcName, sc.rate));
            
            var sprite = new sc.cons(buf.animFrames[unitName][animationName][srcName][0]);
            sprite.runAction(action);
            
            return sprite;
        },
        
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
        }
    }
    
})();