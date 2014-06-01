var coh = coh || {};
coh.scene = coh.scene || {};
cc.game.onStart = function(){
    cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
	cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(coh.resources, function () {
        cc.director.runScene(
            coh.scene["map"] = new coh.MapScene()
        );
    }, this);
};
cc.game.run();