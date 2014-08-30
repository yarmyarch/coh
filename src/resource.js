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
            field_16X16 : "res/tmxmap/battle_16X16.tmx"
        }
    },
    imgs : {
        market : "res/tmxmap/b_market.jpg",
        forest : "res/tmxmap/forest.jpg",
        shadow : "res/imgs/shadow.png",
        arrow : "res/imgs/arrow.png",
        cornor : "res/imgs/corner.png",
        blank : "res/imgs/blank.png",
        convertor : "res/imgs/convertor.png"
    },
    sprite : {
        awen : {
            walking : {
                plist : "res/sprite/sprite.plist",
                img : "res/sprite/imgs/sprite.png"
            }
        },
        /**
         * XXXXXX TO BE OPTIMIZED
        convertor : {
            convert : {
                plist : "",
                img : ""
            }
        },
        */
        /**
         * geneted by unit generator.
        archer : {
            idle : {
                plist : "res/sprite/archer_idle.plist",
                img_0 : "res/sprite/imgs/archer_blue.png?v=1",
                img_1 : "res/sprite/imgs/archer_gold.png?v=1",
                img_2 : "res/sprite/imgs/archer_white.png?v=1"
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
     * Full fill the configs of sprite from coh.unitStatic.
     */
    var generateUnits = function(resObj) {
        var _coh = coh,
            colors;
        
        // if a unit is configured in both units and occupations, then it's a normal unit that's having a sprite.
        for (var i in _coh.unitStatic) {
            if (!_coh.unitStatic[i].occupation) continue;
            colors = _coh.factions[_coh.unitStatic[i].faction].colors;
            resObj.sprite[i] = {};
            resObj.sprite[i].idle = {
                plist : "res/sprite/" + i + "_idle.plist",
                img_0 : "res/sprite/imgs/" + i + "_" + colors[0] + ".png",
                img_1 : "res/sprite/imgs/" + i + "_" + colors[1] + ".png",
                img_2 : "res/sprite/imgs/" + i + "_" + colors[2] + ".png"
            };
            // XXXXXX TO BE ADDED
            resObj.sprite[i].assult = {
                plist : "res/sprite/" + i + "_idle.plist",
                img_0 : "res/sprite/imgs/" + i + "_" + colors[0] + ".png",
                img_1 : "res/sprite/imgs/" + i + "_" + colors[1] + ".png",
                img_2 : "res/sprite/imgs/" + i + "_" + colors[2] + ".png"
            };
            resObj.sprite[i].charge = {
                plist : "res/sprite/" + i + "_idle.plist",
                img_0 : "res/sprite/imgs/" + i + "_" + colors[0] + "_charge.png",
                img_1 : "res/sprite/imgs/" + i + "_" + colors[1] + "_charge.png",
                img_2 : "res/sprite/imgs/" + i + "_" + colors[2] + "_charge.png"
            };
        }
        return resObj;
    };
    
    coh.resources = generateRes(generateUnits(coh.res));
})();