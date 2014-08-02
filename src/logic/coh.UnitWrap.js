var coh = coh || {};

/**
 * Unit tile that contains data of a unit and the tile sprite for the unit.
 */
(function() {

var g_lc = {
    CHECK_COLOR : new cc.Color(255, 128, 128, 255),
    UNCHECK_COLOR : new cc.Color(255, 255, 255, 255),
    FOCUS_BLINK : cc.repeatForever(cc.sequence(cc.fadeTo(0.618, 64), cc.fadeTo(0.618, 204)))
}
    
coh.UnitWrap = function() {
    
    var self = this;
    
    var buf = {
        player : null,
        // just for a record, no other purposes.
        // indexed by x_y
        tileRecord : {}
    };

    var construct = function(unit, tileSprite, unitSprite) {
        this.unit = unit;
        this.tileSprite = tileSprite;
        this.unitSprite = unitSprite;
        
        var _coh = coh,
            shadow = cc.Sprite.create(_coh.res.imgs.shadow),
            typeConfig = this.getTypeConfig();
        
        shadow.attr({
            x : 0,
            y : 0,
            anchorX: -0.05,
            anchorY: 0.3,
            scaleX : typeConfig[1] * 0.8,
            scaleY : 0.75,
            opacity:164
        });
        
        this.unitSprite.attr({
            x : 0,
            y : 0,
            scale : _coh.LocalConfig.SPRITE_SCALE[unit.getType()],
            anchorX: 0,
            anchorY: 0
        });
        
        this.tileSprite.attr({
            visible : false
        });
        
        this.unitSprite.addChild(shadow, _coh.LocalConfig.Z_INDEX.BACKGROUND);
        this.tileSprite.addChild(unitSprite, _coh.LocalConfig.Z_INDEX.CONTENT);
    }
    
    self.check = function() {
        this.unitSprite.setColor(g_lc.CHECK_COLOR);
        this.unitSprite.runAction(g_lc.FOCUS_BLINK);
    };
    
    self.unCheck = function() {
        this.unitSprite.setColor(g_lc.UNCHECK_COLOR);
        coh.View.tryStopAction(this.unitSprite, g_lc.FOCUS_BLINK);
    };
    
    self.exile = function(isAttacker) {
        var exiledY = (isAttacker ? -this.tileSprite.y : (this.tileSprite.parent.height - this.tileSprite.y)) - this.tileSprite.height / 2;
        this.unitSprite.runAction(g_lc.FOCUS_BLINK);
        this.unitSprite.runAction(this.unitSprite.runningAction = cc.moveTo(coh.LocalConfig.EXILE_RATE, this.unitSprite.x, exiledY));
    };
    
    self.unExile = function() {
        var _cohView = coh.View;
        _cohView.tryStopAction(this.unitSprite, g_lc.FOCUS_BLINK);
        _cohView.tryStopAction(this.unitSprite, this.unitSprite.runningAction);
        this.unitSprite.setOpacity(255);
        this.unitSprite.y = 0;
    };
    
    self.setPlayer = function(player) {
        buf.player = player;
    };
    
    self.getPlayer = function() {
        return buf.player;
    };
    
    self.getTypeConfig = function() {
        return coh.LocalConfig.LOCATION_TYPE[self.unit.getType()];
    };
    
    self.getTileRecords = function() {
        return buf.tileRecord;
    };
    
    self.addTileRecord = function(newTile) {
        buf.tileRecord[newTile.x + "_" + newTile.y] = newTile;
    };
    
    self.removeTileRecord = function(oldTile) {
        var _buf = buf;
        _buf.tileRecord[oldTile.x + "_" + oldTile.y] = null;
        delete _buf.tileRecord[oldTile.x + "_" + oldTile.y];
    };
    
    self.updateTileRecord = function(oldTile, newTile) {
        self.removeTileRecord(oldTile);
        self.addTileRecord(newTile);
    };
    
    self.clearTileRecord = function() {
        buf.tileRecord = null;
    };
    
    construct.apply(self, arguments);
    
    return self;
};

})();