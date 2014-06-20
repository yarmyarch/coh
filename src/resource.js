var coh = coh || {};
coh.res = {
    //image
    //plist
    //fnt
    //tmx
    //bgm
    //effect
    
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    
    map : {
        forest : {
            tmx : "res/tmxmap/forest.tmx",
            img : "res/tmxmap/forest.jpg"
        },
        market : {
            tmx : "res/tmxmap/b_market.tmx",
            img : "res/tmxmap/b_market.jpg"
        }
    },
    sprite : {
        awen : {
            walking : {
                plist : "res/sprite/sprite.plist",
                img : "res/sprite/sprite.png"
            }
        },
        archer : {
            idle : {
                plist : "res/sprite/archer_idle.plist",
                img_0 : "res/sprite/archer_blue.png",
                img_1 : "res/sprite/archer_gold.png",
                img_2 : "res/sprite/archer_white.png"
            }
        }
    }
};

(function() {
    var generateRes = function(obj) {
        var result = [];
        for (var i in obj) {
            if (obj[i] instanceof Object) {
                result = result.concat(generateRes(obj[i]));
            } else {
                result.push(obj[i]);
            }
        }
        return result;
    }
    coh.resources = generateRes(coh.res);
})();

/**
XXXXXX
TODO : 
    set sprite: run/walk in Actor;
    translate dataGroup into map positions in BattleScene;
    
    1. Find something to replace the spriteFrameCache, or just simply clear all caches each time creating the sprite;
    2. Find another way creating swf with flash, if it could use the original texture file;
    3. How could it be resolved about the dulplicated keyframes' name in different plists? Well it won't be a problem if item 1 is resolved.

ERROR using spriteFrameCache in coh.View.js, line 75.

*/