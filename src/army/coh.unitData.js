var coh = coh || {};

/**
 * Data required saving a unit.
 * 
 * The data below will override those configured in coh.unitStatic when there might be any conflicts.
 * Also, a getter/setter would be generated while creating a unit with these configs.
 */
coh.unitData = {
    unit : {
        level : 1,
        number : 1
    },
    // general readonly data for heros.
    hero : {
        type : 1,
        // levelhistory.
        levels : null,
        // jobname
        occupation : "",
        // modifier
        talent : 1
    },
    
    // specific configs for sevral heros. 
    leon : {
        talent : 2
    }
};