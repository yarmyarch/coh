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
                img_0 : "res/sprite/archer_idle_blue.png",
                img_1 : "res/sprite/archer_idle_gold.png",
                img_2 : "res/sprite/archer_idle_white.png"
            }
        }
    }
};
coh.resources = [];

(function() {
    var generateRes = function(obj) {
        for (var i in obj) {
            if (obj[i] instanceof Object) {
                coh = coh.resources.concat(generateRes(obj[i]));
            } else {
                coh.resources.push(res[i]);
            }
        }
    }
    generateRes(coh.res);
})();