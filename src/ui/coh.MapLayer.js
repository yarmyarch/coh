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
                
                // do placcePlayer when entered, to prevent 0 width for map tiles.
                var attacker, aMatrix, defender, dMatrix;
                var generatePlayer = function(battleScene) {
                    // attacker
                    attacker = new _coh.Player("", 1, { archer : 6, paladin: 1});
                    attacker.setAsAttacker();
                    aMatrix = _coh.Battle.generatePlayerMatrix(attacker);
                    // defender
                    defender = new _coh.Player("", 1, { archer : 24, knight: 4, paladin: 3});
                    defender.setAsDefender();
                    dMatrix = _coh.Battle.generatePlayerMatrix(defender);
                    
                    _coh.utils.FilterUtil.removeFilter("battleSceneEntered", generatePlayer, 12);
                    
                    return battleScene;
                };
                
                var render = function(battleScene) {
                    
                    battleScene.renderPlayer(attacker, aMatrix);
                    battleScene.renderPlayer(defender, dMatrix);
                    
                    _coh.utils.FilterUtil.removeFilter("battleSceneReady", render, 12);
                    
                    coh.utils.FilterUtil.applyFilters("battleUnitsReady", battleScene);
                    
                    return battleScene;
                };
                
                _coh.utils.FilterUtil.addFilter("battleSceneEntered", generatePlayer, 12);
                _coh.utils.FilterUtil.addFilter("battleSceneReady", render, 12);
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