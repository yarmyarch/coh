var coh = coh || {};

// ui related configs exist in resource.js,
// occupation related configs exist in coh.occupations.js.
coh.units = {
    archer : {
        // used to tag if the unit would be a normal unit that's holding a occupation.
        occupation : "archer",
        faction : "human",
        type : 1,
        // lower priority results in a closer position to the front line.
        priority : 8
    },
    knight : {
        occupation : "knight",
        faction : "human",
        type : 2,
        priority : 16
    },
    paladin : {
        occupation : "paladin",
        faction : "human",
        type : 4,
        priority : 24
    },
    // these are also data group that should be saved into the player object.
    hero : {
        // types should be set dynamically when generating.
        priority : 32,
        /**
         * "growth" of a hero.
         * eg. at the level of 1, the attack of the hero is about 0.22 * max_attack * calt(modifyAttack, level),
         * while "calt" is a functions that returns 1 when level equals to the max level of the unit.
         */
        modifier : 1
    },
    
    // leon.
    leon : {
        // XXXXXX How should it be used?
        modifier : 2
    }
};