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
    
coh.UnitBody = function() {
    
    var self = this;
    
    var buf = {
        player : null,
        battleScene : null,
        // just for a record, no other purposes.
        // indexed by x_y
        tileRecord : [],
        
        // if a wall or another phananx generated while charging, other animates won't hide the sprite.
        charging : false
    };

    var construct = function(unit) {
        
        var _coh = coh,
            _cc = cc,
            shadow = _cc.Sprite.create(_coh.res.imgs.shadow),
            typeConfig;;
        
        this.unit = unit;
        this.unitSprite = _coh.View.getSprite(unit.getName(), "idle", {color : this.unit.getColor()});
        this.tileSprite = _cc.DrawNode.create(),
        
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
        this.tileSprite.addChild(this.unitSprite, _coh.LocalConfig.Z_INDEX.CONTENT);
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
    
    self.setBattleScene = function(scene) {
        buf.battleScene = scene;
    };
    
    self.getBattleScene = function() {
        return buf.battleScene;
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
    
    /**
     * deep copy required for some cases, do it outside.
     */
    self.getTileRecords = function() {
        if (!buf.tileRecord.length) return null;
        return buf.tileRecord;
    };
    
    self.addTileRecord = function(newTile) {
        buf.tileRecord.push(newTile);
    };
    
    self.removeTileRecord = function(oldTile) {
        var _buf = buf;
        
        for (var i = 0; _buf.tileRecord[i]; ++i) {
            if (_buf.tileRecord[i].x == oldTile.x && _buf.tileRecord[i].y == oldTile.y) {
                _buf.tileRecord = _buf.tileRecord.slice(0, i).concat(_buf.tileRecord.slice(i + 1));
            }
        }
    };
    
    self.updateTileRecord = function(oldTile, newTile) {
        self.removeTileRecord(oldTile);
        self.addTileRecord(newTile);
    };
    
    self.clearTileRecords = function() {
        buf.tileRecord = [];
    };
    
    /**
     * play convert animations, or change status if necessary.
     */
    self.charge = function() {
        var srcName = "img_" + (+self.unit.getColor() || 0);
        
        // XXXXXX TO BE ADDED.
        self.unitSprite.runAction(cc.repeatForever(coh.View.getAnimation(self.unit.getName(), "charge", srcName)));
        buf.charging = true;
    };
    
    /**
     * once the unit is in charge, it will be in charge forever until it's ready to attack.
     */
    self.isCharging = function() {
        return buf.charging;
    };
    
    /**
     * if a unit can be convert to another one, it must be a type 1 unit.
     * Once the convert finished, the unit would be removed from the battle scene.
     */
    self.convertTo = function(unitTo, callback) {
        var _coh = coh,
            _buf = buf,
            convertSprite = cc.Sprite.create(res.imgs.convertor),
            startPos = _buf.battleScene.getPositionFromTile(_buf.tileRecord[0]),
            targetPos = _buf.battleScene.getPositionFromTile(_coh.Util.getRandom(unitTo.getTileRecords())),
            // the control(mid) point can be checked randomly from the square generated by startPos and targetPos.
            ctrlPos = _coh.Util.getBesierMidPos(startPos, targetPos);
        
        self.tileSprite.addChild(convertSprite);
        convertSprite.runAction(cc.repeatForever(cc.rotateBy(_coh.LocalConfig.EXILE_RATE, 360)));
        
        // move the unit tile, picking a random tile from the target unit.
        self.tileSprite.runAction(cc.sequence(cc.bezierTo(_coh.LocalConfig.EXILE_RATE, [startPos, ctrlPos, targetPos])), cc.callFunc(function(){
            _coh.Util.isExecutable(callback) && callback(self);
            
            // remove the unit itself from it's battleScene.
            _buf.battleScene.removeUnit(self);
        }));
    };
    
    /**
     * make a copy of itself, including any info related to the scene.
     */
    self.clone = function() {
        var clone = new coh.UnitBody(self.unit.clone());
        clone.setBattleScene(self.getBattleScene());
        clone.setPlayer(self.getPlayer());
        
        var tiles = self.getTileRecords();
        
        for (var i in tiles) {            
            clone.addTileRecord(tiles[i]);
        }
        
        return clone;
    }
    
    construct.apply(self, arguments);
    
    return self;
};

})();