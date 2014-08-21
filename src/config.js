var coh = coh || {};
coh.LocalConfig = {
    /**
     * @see coh.Unit.js for more details of status & type & color.
     */
    LOCATION_TYPE : {
        // 0 - reserved
        // [row count<y>, column count<x>]
        1 : [1,1],
        2 : [2,1],
        3 : [1,2],
        4 : [2,2]
    },
    UNIT_TYPES: {
        // blank, unused datagroup data or other unexpected units shares this type.
        STATIC : 0,
        SOLDIER : 1,
        ELITE : 2,
        TANK : 3,
        CHAMPION : 4
    },
    // should be recalculated via UNIT_TYPES.
    UNIT_TYPES_COUNT : 0,
    // for units whose type code is within <x> * UNIT_TYPES_COUNT ~ <x + 1> * UNIT_TYPES_COUNT, having the action below which value is <x>.
    // Ex. charging elite unit is having the type of 1 * UNIT_TYPES_COUNT + 2.
    UNIT_ACTIONS : {
        // default action is idle.
        IDLE : 0,
        CHARGE : 1
    },
    CONVERT_TYPES : {
        SOLDIER : 1,
        ELITE : 2,
        WALL : 3,
        TANK : 4,
        CHAMPION : 5
    },
    CONVERT_MATRIX : {
        // possible location type may create a convert.
        1 : [
            [1], 
            [1], 
            [1]
        ],
        2 : [
            [2], 
            [2], 
            [1], 
            [1]
        ],
        3 : [
            [1, 1, 1]
        ],
        4 : [
            [3, 3], 
            [1, 1]
        ],
        5 : [
            [4, 4], 
            [4, 4], 
            [1, 1], 
            [1, 1]
        ]
    },
    STATUS_BLANK : 0,
    STATUS_OCCUPIED : 1,
    STATUS_CONVERTED : 2,
    COLOR_COUNT : 3,
    // frame rate for general animations.
    FRAME_RATE : 1/60,
    
    ASSAULT_DEATA : 1 / 6 * 100,
    ASSAULT_RATE : 1 / 3,
    EXILE_RATE : 1 / 6,
    
    
    BLINK_RATE : 0.618,
    INVALID : -1,
    
    MAP_BATTLE_LAYER_NAME : "battleField",
    
    SPRITE_SCALE : {
        1 : 1.25,
        2 : 1.2,
        3 : 1.25,
        4 : 1.1
    },
    
    PRE_RAND_ID : "yri_",
    
    // priority when drawn in the canvas.
    Z_INDEX : {
        BACKGROUND : 0,
        CONTENT : 10,
    },
    
    ATTACKER_FOCUS_COLOR : new cc.Color(55, 229, 170, 204),
    DEFENDER_FOCUS_COLOR : new cc.Color(200, 50, 120, 204),
    UNIT_DELETE_COLOR : new cc.Color(64, 64, 64, 204),
    
    UNIT : {
        MAX_LEVEL : 20,
        MIN_LEVEL : 1
    },
    
    PRIORITY_WALL : 100
};

// append configs that's need be calculated.
(function() {
// set UNIT_TYPES_COUNT
for (var i in coh.LocalConfig.UNIT_TYPES) {
    ++coh.LocalConfig.UNIT_TYPES_COUNT;
}

})();
