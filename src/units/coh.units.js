var coh = coh || {};

// ui related config exists in resource.js
coh.units = {
    archer : {
        type : 1,
        // lower priority results in a closer position to the front line.
        priority : 8,
        attack : 8,
        hp : 3,
        speed : 60
    },
    knight : {
        type : 2,
        priority : 16
    },
    paladin : {
        type : 4,
        priority : 24
    }
};