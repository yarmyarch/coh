/**
 *@version draft
 */

var coh = coh || {};
coh.MapLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        
        var _coh = coh;
        
        _coh.map = cc.TMXTiledMap.create(_coh.res.map.districts.forest);
        
        this.addChild(_coh.map, 0, 1);
        
        var MpSize = cc.director.getWinSize(),
            self = this,
            mapPositons = _coh.map.getObjectGroup("positions"),
            keyMap = {},                                
            gogogo = function(key) {
                var nextNode;
                if ((nextNode = mapPositons.objectNamed(self.sprite.position)) && (nextNode = nextNode[keyMap[key]]) && (nextNode = mapPositons.objectNamed(nextNode))) {
                    //~ self.sprite.goTo(nextNode, function() {
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
                _coh.scene["battle"] = _coh.scene["battle"] || (_coh.scene["battle"] = new _coh.BattleScene(_coh.res.map.battle.field_16X16, _coh.res.imgs.market));
                
                _coh.scene["battle"].setTileSelector(
                    _coh.utils.BaseTileTransformer.getInstance(_coh.utils.TileSelector_16X16.getInstance())
                );
                
                cc.director.runScene(
                    cc.TransitionFadeDown.create(1.2, _coh.scene["battle"])
                );
                // Run battle logic here, place the player.
                setTimeout(function(){
                    // attacker
                    _coh.scene["battle"].generate();
                    // defender
                    _coh.scene["battle"].generate(1);
                }, 0);
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
        
        self.sprite = _coh.View.getSprite("awen", "walking", {cons : 
            function(startFrame, rect) {
                return new _coh.Actor(startFrame, rect, mapPositons.objectNamed("first"));
            }
        });
        this.addChild(self.sprite);
        
        return true;
    }
});