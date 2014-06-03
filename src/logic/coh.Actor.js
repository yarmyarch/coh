var coh = coh || {};
coh.Actor = cc.Sprite.extend({
    position : "",
    ctor : function(startFrame, rect, startNode) {
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
        // XXXXXX set sprite: run/walk
    }
});