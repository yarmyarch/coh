var coh = coh || {};
coh.LocalConfig = {
    COLOR : {
        GREEN : 1,
        RED : 2,
        BLUE : 3
    },
    LOCATION_TYPE : {
        // 0 - reserved
        // [row count, column count]
        1 : [1,1],
        2 : [2,1],
        3 : [1,2],
        4 : [2,2]
    },
    CONVERT_TYPE : {
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
    COLOR_COUNT : 3,
    BLANK_DATA_GROUP : [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ],
    // frame rate for general animations.
    FRAME_RATE : 1/60,
    
    ASSAULT_DEATA : 1 / 6 * 100,
    ASSAULT_RATE : 1 / 3,
    EXILE_RATE : 1 / 6,
    
    
    BLINK_RATE : 0.618,
    COLOR_CONFIG : {
        ELF : ["blue", "white", "gold"]
    },
    NO_COLOR : -1,
    
    MAP_BATTLE_LAYER_NAME : "battleField",
    
    SPRITE_SCALE : {
        1 : 1.25,
        2 : 1.2,
        3 : 1.25,
        4 : 1.1
    },
    
    PRE_RAND_ID : "YarRi_",
    
    // priority when drawn in the canvas.
    Z_INDEX : {
        BACKGROUND : 0,
        CONTENT : 10,
    },
    
    ATTACKER_FOCUS_COLOR : new cc.Color(55, 229, 170, 204),
    DEFENDER_FOCUS_COLOR : new cc.Color(200, 50, 120, 204),
    UNIT_DELETE_COLOR : new cc.Color(64, 64, 64, 204)
};