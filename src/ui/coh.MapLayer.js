var coh = coh || {};
coh.MapLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        
        var _coh = coh;
        
        _coh.map = cc.TMXTiledMap.create(_coh.res.map.forest.tmx);
        
        this.addChild(_coh.map, 0, 1);
        
        var MpSize = cc.director.getWinSize(),
            self = this,
            mapPositons = _coh.map.getObjectGroup("positions"),
            keyMap = {},                                
            gogogo = function(key) {
                var nextNode;
                if ((nextNode = mapPositons.objectNamed(self.sprite.position)) && (nextNode = nextNode[keyMap[key]]) && (nextNode = mapPositons.objectNamed(nextNode))) {
                    self.sprite.goTo(nextNode, function() {
                        if (nextNode.passingBy) {
                            setTimeout(function(){
                                gogogo(key);
                            }, 0);
                        }
                    });
                } else {
                    return;
                }
            },
            investigate = function() {
                cc.director.runScene(
                    cc.TransitionFadeDown.create(1.2, 
                        _coh.scene["battle"] || (_coh.scene["battle"] = new _coh.BattleScene())
                    )
                );
            };
        
        keyMap[cc.KEY.left] = "left";
        keyMap[cc.KEY.right] = "right";
        keyMap[cc.KEY.up] = "up";
        keyMap[cc.KEY.down] = "down";
        
        if (cc.sys.capabilities.hasOwnProperty('keyboard')) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed:function (key, e) {
                    
                    if(key == cc.KEY.left || key == cc.KEY.right || key == cc.KEY.up || key == cc.KEY.down){
                        gogogo(key);
                    }
                    if(key == cc.KEY.enter){
                        investigate();
                    }
                },
                onKeyReleased:function (key, event) {
                    //~ MW.KEYS[key] = false;
                }
            }, this);
        }
        
        var spriteCache = cc.spriteFrameCache,
            animIdleFrame = [],
            animIdle,
            runningAction;
        
        spriteCache.addSpriteFrames(_coh.res.sprite.awen.walking.plist, _coh.res.sprite.awen.walking.img);
        
        for (var i in spriteCache._spriteFrames) {
            animIdleFrame.push(spriteCache._spriteFrames[i]);
        }
        animIdle = cc.Animation.create(animIdleFrame, 0.1);
        runningAction = cc.RepeatForever.create(cc.Animate.create(animIdle));
        
        this.sprite = new _coh.Actor(animIdleFrame[0], null, mapPositons.objectNamed("first"));
        
        this.addChild(this.sprite);
        
        this.sprite.runAction(runningAction);
        
        return true;
    }
});