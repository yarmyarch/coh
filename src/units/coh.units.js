var coh = coh || {};

// ui related config exists in resource.js
coh.units = {
    archer : {
        type : 1,
        // lower priority results in a closer position to the front line.
        priority : 10
    },
    knight : {
        type : 2,
        priority : 10
    },
    paladin : {
        type : 4,
        priority : 10
    }
};