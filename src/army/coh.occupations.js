var coh = coh || {};

coh.occupations = {
    archer : {
        attack : 12,
        hp : 4,
        speed : 75,        
        /**
         * <skill name> : {<affixName> : <affixLevel>}
         */
        skills : {
            ranged : 1
        }
    },
    knight : {
        attack : 15,
        hp : 6,
        speed : 60,
        skills : {
            melee : 1
        }
    },
    paladin : {
        attack : 14,
        hp : 5,
        speed : 66,
        skills : {
            melee : 1
        }
    },
    worrior : {
        attack : 16,
        hp : 5,
        speed : 48,
        skills : {
            melee : 1
        }
    },
    elf_archer : {
        attack : 9,
        hp : 2,
        speed : 105,
        skills : {
            ranged : 1
        }
    }
};