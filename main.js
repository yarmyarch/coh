var coh = coh || {};
coh.scene = coh.scene || {};
cc.game.onStart = function(){
    cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
	cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(coh.resources, function () {
        cc.director.runScene(
            coh.scene["map"] = new coh.MapScene()
        );
    }, this);
};
cc.game.run();

/**
TODO:
    set sprite: run/walk in Actor;
    How to locate unit via the position? unitId?
        1. Event triggered;
            click
        2. Handlers in controller captured;
        3. Find Unit instance in model via position;
            instance of Player
        4. Update model if necessary;
            HP decrease 1;
        5. Dispatch filter event, filter triggered;
        6. Handlers in controller captured;
        7. Do update in View;
            BattleScene, update HP info for a sprite.

    About hero:
        setData in heroUnit defination(coh.Hero.js);
        configs in units;
        modifier to be used.
        Some heros are good at sevral occupations, that gains it's growth.

Game:
    成长率：
        英雄属性构成：
            职业数值x；
            天赋r（未满级时展现）；
            成长率c（满级数值直接加成）；
            当前等级i;
            最大等级L;
        计算：
            满级属性 = x + c;
            当前属性 = 1 + (r - 1) * (1 - i / L) - Maybe it should be more complexed to prevent when r > 1.6, rate drops down to 1 instead of grows to?
            XXXXXX 当天赋值大于1.6时，攻击力数值将可能超过最大允许数值并在最大等级（20）时回落。需要解决，考虑采用非线性递减。
            eg:
                var modifier = 1, level = 1, max = 20, rate = 1 + (modifier - 1) * (1 - level / max);
                (Math.floor(0.5 * Math.pow(4 / max * level, 0.5) * 100) / 100) * rate * 40
                    when level and modifier changes, see the output.

    突围模式：map 16*16
        每回合受攻击，例如炮火；
        切换进攻/防御方向；
        每回合增援特定部队；
        营救所有部队结束战斗，关键部队被灭则战斗失败；

    基本攻击类型：
        远程：
            不受接触类伤害；
            传递接触类伤害；
            越过前线；
            不能推进战线；
        近战：
            受到接触类伤害；
            传递接触类伤害；
            推进战线；
    
    战线推进：
        蓄力阵列前方如果有其他蓄力阵列，对比优先级；如果后方阵列优先级高于前方，则两阵列位置互换；
        蓄力阵列位于最前线时，如果当前受影响的列蓄力强于对方邻接的蓄力阵列或城墙，战线往前线推进一格；
            如果对方没有蓄力单位，战线推进一格；
            如果对方有未蓄力单位被推出底线，该单位被销毁；
            如果对方有蓄力阵列被推出底线，该阵列被销毁；
    
    基本属性：
        攻击
            蓄力时的攻击力 = 攻击力 * 剩余血量/血量
        血量
            英雄单位可以防御多次攻击，直到血量降为0；
        敏捷
            蓄力耗时与敏捷为反比关系；
            蓄力耗时最低为0，回合结束时立即结算；
        指挥官加成
            出击单位攻击力 = 攻击 + 指挥官攻击 * 剩余统率力 / 统率力
    
    被动技能（X技能拥有战场效果，作为指挥官时生效）：
        精英：
            攻击力 * 4
            血量 * 2
            速度 / 2
        王牌：
            攻击力 * 12
            血量 * 6
            速度 / 4
        %X魔法攻击：
            穿透效果
                进攻时传递的攻击力为：攻击力 - 对方防御 * (1 - max(X% - 对方魔防, 0));
                当X为100时且防御方魔防为0时，攻击将百分之百穿透防御单位；
        %X魔法防御：
            当防御方魔防为100时，魔法攻击与普通攻击相同；
            魔防可以为负；
        %X刀背打：
            适用于进攻对方指挥官；
            当剩余攻击力大于等于出击攻击力的X%时，保留X%剩余攻击力传递至下一防御单位，当前防御单位受到伤害为：
                剩余攻击力 - (1-X%)；
        X%暗杀：
            适用于突击，比普通攻击更有突破能力；
            攻击后的攻击力损失降低为 (1-X%) * 对方血量；
                当X为100时，进攻对方单位将不会有攻击力损失；
        X%闪避：
            当剩余血量大于等于总血量的X%时，受到攻击仅损失1-X%的血量用于防御对方进攻；
        X%防御：
            全面强于闪避。
            防御时的血量损失降低为 (1-X%) * 对方攻击；
                当X为100时，防御方将不损失任何血量；
        城墙之力：
            无视对方物理攻击的穿透或闪避效果；
        魔法免疫：
            对方魔法攻击视为物理攻击；（100%魔法防御）
        魔法无效：
            对方魔法攻击完全吸收，不造成任何伤害并且不能穿透；
        
        炮火攻击：
            攻击方式不再为线性，转为攻击敌方一定范围的所有单位；地方受到伤害从炮火中心往外递减；
                计算方式需保证在最前线的炮火攻击范围在对方底线，最底线的炮火攻击范围为对方前线；
        骑士统帅（X）：
            英雄效果：与自己同一回合出击的所有骑士单位，无论颜色，均视为链接攻击；
            战场效果：当前战场上所有同一回合内出击的骑士单位均视为链接攻击；
        %X前线指挥官：
            将自身能力的X%累加到指挥官攻击力中计算指挥官加成；
        伏击：
            进攻将在回合结束时发动，期间可以接受0回合的链接攻击或融合攻击；
        狂战士：
            出击攻击力 = 攻击 + 损失血量 / 总血量 * 攻击
            
        帝国的罪人：
            不能转职为骑士；
            骑士统帅技能战场效果无效化；
        不灭的斗志：
            受伤时，每回合回复最大血量或攻击力的20%；
        星辰陨落：
            出击时血量为最大血量的30%；
    
    道具效果：
        诅咒：
            经验值不再增加，英雄不能升级；
*/