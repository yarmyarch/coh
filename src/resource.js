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
        districts : {
            forest : "res/tmxmap/forest.tmx"
        },
        battle : {
            field_16X16 : "res/tmxmap/battle_16X16.tmx?v=1"
        }
    },
    imgs : {
        market : "res/tmxmap/b_market.jpg",
        forest : "res/tmxmap/forest.jpg"
    },
    sprite : {
        awen : {
            walking : {
                plist : "res/sprite/sprite.plist",
                img : "res/sprite/images/sprite.png"
            }
        },
        /**
         * geneted by unit generator.
        archer : {
            idle : {
                plist : "res/sprite/archer_idle.plist",
                img_0 : "res/sprite/images/archer_blue.png?v=1",
                img_1 : "res/sprite/images/archer_gold.png?v=1",
                img_2 : "res/sprite/images/archer_white.png?v=1"
            }
        },
        */
    }
};

(function() {
    /**
     * Generate pure resource object without layer.
     */
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
    };
    
    /**
     * Full fill the configs of sprite from coh.units.
     */
    var generateUnits = function(resObj) {
        var _coh = coh;
        for (var i in _coh.units) {
            resObj.sprite[i] = {};
            resObj.sprite[i].idle = {
                plist : "res/sprite/" + i + "_idle.plist",
                img_0 : "res/sprite/images/" + i + "_blue.png",
                img_1 : "res/sprite/images/" + i + "_gold.png",
                img_2 : "res/sprite/images/" + i + "_white.png"
            };
        }
        return resObj;
    };
    
    coh.resources = generateRes(generateUnits(coh.res));
})();

/**
XXXXXX
TODO : 
    set sprite: run/walk in Actor;
    translate dataGroup into map positions in BattleScene;

    in battle, the map with a background should be split out from the battle layer.
  
ERROR using spriteFrameCache in coh.View.js, line 75.

*/