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
    hero : {
        // types should be set dynamically when generating.
        priority : 32
    }
};