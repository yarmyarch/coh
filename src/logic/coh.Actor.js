var coh = coh || {};

/**
 * As we've moved the the sprite related functions into View, so the Actor can no longer be a class that extends cc.Sprite.
 * let's make it a util then.
    
coh.Actor = (function(){
   
    var self;
    
    var buf = {
        position : ""
    }
    
    return self = {
        /**
         * place the sprite at the center of the view area.
         
        focus : function(sprite, startNode) {
            // starts from "first"
            buf.position = startNode.name;
            coh.View.locateNode(startNode);
            
            var winSize = cc.director.getWinSize();
            
            sprite.setPosition(winSize.width / 2, winSize.height / 2 + sprite.height / 4);
        },
        
        goTo : function(sprite, node, callback) {
            // go to target position, and roll the map at the same time.
            buf.position = "";
            coh.View.moveMapToNode(node, function() {
                buf.position = node.name;
                callback && callback();
            });
            // XXXXXX set sprite: run/walk
        }
    }*/
/**
 * Sprite Adapter. Must I do it like this? There exist many fucking puclic functions there you know...
 */
coh.Actor = function(sprite) {
    
    var self = this,
        _coh = coh;
    
    for (var i in sprite) {
        if (_coh.util.isExecutable(sprite[i])) self[i] = // XXXXXX
    }
}

cc.Sprite.extend({
    position : "",
    ctor : function(sprite, startNode) {
        this._super(startFrame, rect);
        // starts from "first"
        this.position = startNode.name;
        coh.View.locateNode(startNode);
        
        var winSize = cc.director.getWinSize();
        
        this.setPosition(winSize.width / 2, winSize.height / 2 + this.height / 4);
    },
    goTo : function(node, callback) {
        // go to target position, and roll the map at the same time.
        var self = this;
        self.position = "";
        coh.View.moveMapToNode(node, function() {
            self.position = node.name;
            callback && callback();
        });
    }
});

})();