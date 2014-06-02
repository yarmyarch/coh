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
    BLANK : 0,
    COLOR_COUNT : 3,
    BLANK_DATA_GROUP : [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ],
    COLOR_CONFIG : {
        elf : ["blue", "white", "gold"]
    }
};