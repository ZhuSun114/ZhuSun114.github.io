interface LevelInformation {
    level: number;
    remainsExp: number;
    toNextLevelExp: number;
}

export function getLevelInformation(exp: number): LevelInformation {
    let levelNow: number = 0;

    let expRemains: number = exp;

    let levelExpCost: number = 0;

    while (expRemains >= levelExpCost) {
        expRemains -= levelExpCost;

        levelExpCost = 3 + Math.abs(levelNow * 1.06 ** (levelNow - 1));

        levelNow += 1;
    }

    return {
        level: levelNow,
        remainsExp: expRemains,
        toNextLevelExp: levelExpCost
    };
}

export function getLevelExpCost(level: number): number {
    let levelNow: number = 0;

    let levelExpCost: number = 0;

    while (level >= levelNow) {
        levelExpCost += 3 + Math.abs(levelNow * 1.06 ** (levelNow - 1));

        levelNow += 1;
    }

    return levelExpCost;
}
