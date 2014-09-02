var coh = coh || {};

// ui related configs exist in resource.js,
// occupation related configs exist in coh.occupations.js.
coh.unitStatic = {
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
    // general readonly data for heros.
    hero : {
        // types should be set dynamically when generating.
        priority : 32
    }
};

// append configs that's need be calculated.
(function() {
// set PRIORITY_CHUNK for global config.
var maxPriority = 0;
for (var i in coh.unitStatic) {
    maxPriority = Math.max(maxPriority, +coh.unitStatic[i].priority);
}
coh.LocalConfig.PRIORITY_CHUNK = maxPriority;

})();
