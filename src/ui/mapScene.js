var coh = coh || {};
coh.MapScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new coh.MapLayer();
        this.addChild(layer);
    }
});
