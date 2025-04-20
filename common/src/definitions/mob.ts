import { Definitions, ObjectDefinition } from "../utils/definitions";
import { Projectile, ProjectileDefinition, ProjectileParameters } from "./projectile";
import { RarityName } from "./rarity";

export enum MobCategory{
    Fixed,
    Unactive,
    Enemy,
    Passive
}


export type MobDefinition = ObjectDefinition & {
    readonly damage: number
    readonly health: number
    readonly hitboxRadius: number
    readonly lootTable: Record<string, number>
    readonly rarity: RarityName;
    readonly exp: number
    readonly images?: {
        width?: number
        height?: number
        mouth?: boolean
        mouthXPosition?: number
        mouthYPosition?: number
        spiderLeg?: boolean
    }
    readonly reachingAway?: boolean
    readonly hideInformation?: boolean
} & MobSegmentType & MobCategoryType & MobShootType;

export type MobCategoryType =  {
    readonly category: MobCategory.Fixed
} | (({
    readonly category: MobCategory.Unactive | MobCategory.Passive
} | {
    readonly category: MobCategory.Enemy
    readonly aggroRadius: number
}) & {
    readonly speed: number
});

export type MobShootType = {
    readonly shootable?: false
} | {
    readonly shootable: true
    readonly shoot: ProjectileParameters;
    readonly shootSpeed: number
    readonly turningHead?: boolean
}

export type MobSegmentType = {
    readonly hasSegments?: false
} | {
    readonly hasSegments?: true
    readonly segmentAmount: number
    readonly segmentDefinitionIdString: string
}

export const Mobs = new Definitions<MobDefinition>([
    {
        idString: "ladybug",
        displayName: "Ladybug",
        damage: 10,
        health: 10,
        category: MobCategory.Unactive,
        hitboxRadius: 1.5,
        speed: 3,
        lootTable: {
            "rose": 0.88,
            "leaf": 0.52,
            "twin": 0.24,
            "triplet": 0.0012,
            "penta": 0.006,
            "myt_tri_rose": 0.006
        },
        rarity: RarityName.common,
        exp: 1
    },
    {
        idString: "massive_ladybug",
        displayName: "Ladybug",
        damage: 20,
        health: 1000,
        category: MobCategory.Unactive,
        hitboxRadius: 5,
        speed: 3,
        usingAssets: "ladybug",
        lootTable: {
            "rose": 1,
            "tri_rose": 1,
            "triplet": 1,
            "epic_rose": 1,
            "bubble": 0.8,
            "leg_bubble": 0.06,
            "penta": 0.6,
            "myt_tri_rose": 0.06
        },
        rarity: RarityName.legendary,
        exp: 10
    },{
        idString: "shiny_ladybug",
        displayName: "Ladybug",
        damage: 10,
        health: 150,
        category: MobCategory.Passive,
        hitboxRadius: 2,
        speed: 3,
        lootTable: {
            "rose": 1,
            "twin": 0.32,
            "tri_rose": 0.34,
            "bubble": 0.16,
            "wing": 0.16,
            "tri_wing": 0.012,
            "leg_bubble": 0.06,
            "epic_rose": 0.51,
            "triplet": 0.02,
            "penta": 0.003,
            "myt_tri_rose": 0.003
        },
        rarity: RarityName.legendary,
        exp: 10
    },{
        idString: "dark_ladybug",
        displayName: "Ladybug",
        damage: 10,
        health: 25,
        category: MobCategory.Passive,
        hitboxRadius: 1.8,
        speed: 3,
        lootTable: {
            "rose": 1,
            "tri_rose": 0.72,
            "epic_rose": 0.051,
            "bubble": 0.16,
            "leg_bubble": 0.012,
            "triplet": 0.024,
            "penta": 0.003,
            "myt_tri_rose": 0.006
        },
        rarity: RarityName.epic,
        exp: 5
    },{
        idString: "bee",
        displayName: "Bee",
        damage: 50,
        health: 15,
        category: MobCategory.Unactive,
        hitboxRadius: 1,
        speed: 3,
        lootTable: {
            "fast": 0.24,
            "stinger": 0.14,
            "twin": 0.06,
            "triangle": 0.02,
            "tri_triangle": 0.002,
            "bubble": 0.012,
            "leg_bubble": 0.0012,
            "wing": 0.006,
            "tri_wing": 0.0012,
            "pinger": 0.0006,
            "penta": 0.006
        },
        rarity: RarityName.common,
        exp: 2
    },{
        idString: "passive_bee",
        displayName: "Bee",
        damage: 50,
        health: 30,
        category: MobCategory.Passive,
        hitboxRadius: 1.5,
        speed: 3.5,
        lootTable: {
            "fast": 0.48,
            "stinger": 0.28,
            "twin": 0.12,
            "triangle": 0.04,
            "tri_triangle": 0.004,
            "bubble": 0.024,
            "leg_bubble": 0.0024,
            "wing": 0.012,
            "tri_wing": 0.006,
            "pinger": 0.0006,
            "penta": 0.006,
            "pollen": 0.03,
            "myt_pollen": 0.006
        },
        rarity: RarityName.rare,
        exp: 10,
        usingAssets: "bee"
    },{
        idString: "cactus",
        displayName: "Cactus",
        damage: 35,
        health: 42,
        category: MobCategory.Fixed,
        hitboxRadius: 2,
        lootTable: {
            "sand": 0.66,
            "triangle": 0.02,
            "tri_triangle": 0.002,
            "missile": 0.12,
            "big_missile": 0.01,
            "cactus": 0.06,
            "poison_cactus": 0.02,
            "tri_cactus": 0.001,
            "pinger": 0.003
        },
        rarity: RarityName.unusual,
        exp: 2
    },{
        idString: "mega_cactus",
        displayName: "Cactus",
        damage: 70,
        health: 100,
        category: MobCategory.Fixed,
        hitboxRadius: 6,
        lootTable: {
            "sand": 0.66,
            "stinger": 0.5,
            "triangle": 0.1,
            "tri_triangle": 0.01,
            "missile": 0.66,
            "big_missile": 0.01,
            "cactus": 0.12,
            "poison_cactus": 0.04,
            "tri_cactus": 0.009,
            "pinger": 0.006
        },
        rarity: RarityName.legendary,
        usingAssets: "cactus",
        exp: 20
    },{
        idString: "rock",
        displayName: "Rock",
        damage: 10,
        health: 16,
        category: MobCategory.Fixed,
        hitboxRadius: 2,
        lootTable: {
            "fast": 0.5,
            "twin": 0.24,
            "triplet": 0.02,
            "penta": 0.006
        },
        rarity: RarityName.common,
        exp: 2
    }
    ,{
        idString: "boulder",
        displayName: "Boulder",
        damage: 20,
        health: 160,
        category: MobCategory.Fixed,
        hitboxRadius: 4,
        lootTable: {
            "fast": 1,
            "twin": 0.48,
            "triplet": 0.04,
            "penta": 0.012,
            "uranium": 0.012
        },
        rarity: RarityName.rare,
        exp: 20,
        usingAssets: "rock"
    },{
        idString: "beetle",
        displayName: "Beetle",
        damage: 40,
        health: 35,
        category: MobCategory.Enemy,
        aggroRadius: 20,
        hitboxRadius: 2,
        speed: 3,
        images: {
            mouth: true,
            mouthXPosition: 2.7,
            mouthYPosition: 1.3
        },
        lootTable: {
            "iris": 0.18,
            "salt": 0.12,
            "triplet": 0.006,
            "tri_stinger": 0.0012,
            "wing": 0.006,
            "tri_wing": 0.0036,
            "powder": 0.009,
            "leg_egg": 0.006,
        },
        rarity: RarityName.epic,
        exp: 5
    },{
        idString: "hornet",
        displayName: "Hornet",
        damage: 50,
        health: 35,
        category: MobCategory.Enemy,
        reachingAway: true,
        shootable: true,
        turningHead: true,
        shoot: {
            hitboxRadius: 0.6,
            damage: 10,
            health: 10,
            despawnTime: 3,
            speed: 6,
            definition: Projectile.fromString("missile")
        },
        shootSpeed: 1.5,
        aggroRadius: 30,
        hitboxRadius: 2,
        speed: 4,
        lootTable: {
            "dandelion": 0.14,
            "bubble": 0.1,
            "missile": 0.09,
            "big_missile": 0.01,
            "myt_big_missile": 0.005,
            "leg_bubble": 0.006,
            "wing": 0.03,
            "tri_wing": 0.009,
            "pinger": 0.001,
            "myt_egg": 0.006,
            "antennae": 0.01,
            "myt_antennae": 0.002
        },
        rarity: RarityName.epic,
        exp: 10
    },{
        idString: "leg_hornet",
        displayName: "Hornet",
        damage: 35,
        health: 70,
        category: MobCategory.Enemy,
        reachingAway: true,
        shootable: true,
        turningHead: true,
        shoot: {
            hitboxRadius: 0.9,
            damage: 15,
            health: 15,
            despawnTime: 3,
            speed: 6,
            definition: Projectile.fromString("missile")
        },
        shootSpeed: 1.5,
        aggroRadius: 30,
        hitboxRadius: 2 * 0.9 / 0.6,
        speed: 4,
        lootTable: {
            "dandelion": 0.28,
            "missile": 0.18,
            "big_missile": 0.02,
            "myt_big_missile": 0.009,
            "bubble": 0.2,
            "leg_bubble": 0.012,
            "triplet": 0.024,
            "tri_stinger": 0.012,
            "pinger": 0.004,
            "myt_egg": 0.012,
            "antennae": 0.03,
            "myt_antennae": 0.006
        },
        rarity: RarityName.legendary,
        exp: 20,
        usingAssets: "hornet"
    },{
        idString: "mantis",
        displayName: "Mantis",
        damage: 30,
        health: 35,
        category: MobCategory.Enemy,
        reachingAway: true,
        shootable: true,
        shoot: {
            hitboxRadius: 0.7,
            damage: 10,
            health: 10,
            despawnTime: 3,
            speed: 7,
            definition: Projectile.fromString("peas")
        },
        shootSpeed: 1.5,
        aggroRadius: 30,
        hitboxRadius: 2,
        speed: 3,
        lootTable: {
            "peas": 0.06,
            "poison_peas": 0.01,
            "leg_poison_peas": 0.001,
            "leg_bubble": 0.006,
            "wing": 0.03,
            "tri_wing": 0.009,
            "myt_poison_peas": 0.003
        },
        rarity: RarityName.rare,
        exp: 20,
        usingAssets: "mantis"
    },{
        idString: "spider",
        displayName: "Spider",
        damage: 20,
        health: 25,
        category: MobCategory.Enemy,
        aggroRadius: 20,
        hitboxRadius: 1.5,
        speed: 4,
        images: {
            spiderLeg: true
        },
        lootTable: {
            "iris": 0.24,
            "stinger": 0.36,
            "triangle": 0.024,
            "tri_triangle": 0.0024,
            "tri_stinger": 0.012,
            "web": 0.18,
            "pincer": 0.18,
            "tri_web": 0.004,
            "faster": 0.4,
            "dual_faster": 0.01,
            "pinger": 0.001,
            "myt_tri_web": 0.001,
            "tri_faster": 0.001
        },
        rarity: RarityName.rare,
        exp: 5
    },{
        idString: "soldier_ant",
        displayName: "Soldier Ant",
        damage: 10,
        health: 40,
        category: MobCategory.Enemy,
        aggroRadius: 20,
        hitboxRadius: 1.5,
        speed: 3,
        images: {
            mouth: true,
            mouthYPosition: 1.1,
        },
        lootTable: {
            "sand": 0.66,
            "fast": 0.44,
            "iris": 0.12,
            "twin": 0.8,
            "wing": 0.016,
            "tri_wing": 0.0012,
            "triplet": 0.0012,
            "faster": 0.4,
            "dual_faster": 0.01,
            "penta": 0.001,
            "tri_faster": 0.001,
            "egg": 0.06
        },
        rarity: RarityName.unusual,
        exp: 4
    },{
        idString: "worker_ant",
        displayName: "Worker Ant",
        damage: 10,
        health: 25,
        category: MobCategory.Passive,
        hitboxRadius: 1.5,
        speed: 3,
        images: {
            mouth: true,
            mouthYPosition: 1.1,
        },
        lootTable: {
            "sand": 0.66,
            "fast": 0.92,
            "leaf": 0.56,
            "twin": 0.24,
            "rice": 0.01,
            "tri_leaf": 0.004,
            "triplet": 0.0012,
            "penta": 0.001,
            "corn": 0.002
        },
        rarity: RarityName.unusual,
        exp: 4
    },{
        idString: "baby_ant",
        displayName: "Baby Ant",
        damage: 10,
        health: 10,
        category: MobCategory.Unactive,
        hitboxRadius: 1,
        speed: 3,
        images: {
            mouth: true,
            mouthXPosition: 3.2,
            mouthYPosition: 0.6,
        },
        lootTable: {
            "sand": 0.66,
            "fast": 0.88,
            "leaf": 0.52,
            "twin": 0.24,
            "rice": 0.01,
            "tri_leaf": 0.004,
            "triplet": 0.0012,
            "penta": 0.003
        },
        rarity: RarityName.unusual,
        exp: 4
    },{
        idString: "centipede",
        displayName: "Centipede",
        damage: 10,
        health: 50,
        category: MobCategory.Unactive,
        speed: 1,
        hitboxRadius: 1.5,
        images: {
            width: 242.874,
            height: 226
        },
        lootTable: {
            "fast": 0.88,
            "leaf": 0.52,
            "twin": 0.24,
            "tri_leaf": 0.0004,
            "triplet": 0.0012,
            "penta": 0.001,
            "peas": 0.28,
            "poison_peas": 0.01,
            "leg_poison_peas": 0.004,
            "myt_poison_peas": 0.0003,
        },
        rarity: RarityName.unusual,
        exp: 4,
        hasSegments: true,
        segmentAmount: 10,
        segmentDefinitionIdString: "centipede_body"
    },{
        idString: "centipede_body",
        displayName: "Centipede",
        damage: 10,
        health: 50,
        category: MobCategory.Unactive,
        speed: 1,
        images: {
            width: 226
        },
        hitboxRadius: 1.5,
        hideInformation: true,
        lootTable: {
            "fast": 0.88,
            "leaf": 0.52,
            "twin": 0.24,
            "tri_leaf": 0.0004,
            "triplet": 0.0012,
            "penta": 0.003,
            "peas": 0.28,
            "poison_peas": 0.01,
            "leg_poison_peas": 0.004,
            "myt_poison_peas": 0.0003,
        },
        rarity: RarityName.unusual,
        exp: 4
    },{
        idString: "desert_centipede",
        displayName: "Centipede",
        damage: 10,
        health: 50,
        category: MobCategory.Unactive,
        speed: 5,
        hitboxRadius: 1.5,
        images: {
            width: 242.874,
            height: 226
        },
        lootTable: {
            "fast": 0.88,
            "twin": 0.24,
            "triplet": 0.0012,
            "penta": 0.003,
            "dice": 0.05,
            "powder": 0.01,
            "talisman": 0.056
        },
        rarity: RarityName.unusual,
        exp: 4,
        hasSegments: true,
        segmentAmount: 10,
        segmentDefinitionIdString: "desert_centipede_body"
    },{
        idString: "desert_centipede_body",
        displayName: "Centipede",
        damage: 10,
        health: 50,
        category: MobCategory.Unactive,
        speed: 5,
        images: {
            width: 226
        },
        hitboxRadius: 1.5,
        hideInformation: true,
        lootTable: {
            "fast": 0.88,
            "twin": 0.24,
            "triplet": 0.0012,
            "penta": 0.003,
            "dice": 0.05,
            "powder": 0.01,
            "talisman": 0.056
        },
        rarity: RarityName.unusual,
        exp: 4
    },{
        idString: "evil_centipede",
        displayName: "Centipede",
        damage: 10,
        health: 50,
        category: MobCategory.Enemy,
        aggroRadius: 25,
        speed: 3,
        hitboxRadius: 1.5,
        images: {
            width: 242.874,
            height: 226
        },
        lootTable: {
            "iris": 0.82,
            "peas": 0.28,
            "chip": 0.28,
            "poison_peas": 0.01,
            "leg_poison_peas": 0.004,
            "myt_poison_peas": 0.002
        },
        rarity: RarityName.rare,
        exp: 4,
        hasSegments: true,
        segmentAmount: 10,
        segmentDefinitionIdString: "evil_centipede_body"
    }, {
        idString: "evil_centipede_body",
        displayName: "Centipede",
        damage: 10,
        health: 50,
        category: MobCategory.Enemy,
        aggroRadius: 25,
        speed: 3,
        hitboxRadius: 1.5,
        hideInformation: true,
        images: {
            width: 242.874,
            height: 226
        },
        lootTable: {
            "iris": 0.82,
            "peas": 0.28,
            "chip": 0.28,
            "poison_peas": 0.01,
            "leg_poison_peas": 0.004,
            "myt_poison_peas": 0.002
        },
        rarity: RarityName.rare,
        exp: 4
    },{
        idString: "mega_mantis",
        displayName: "Mantis",
        damage: 30,
        health: 300,
        category: MobCategory.Enemy,
        reachingAway: true,
        shootable: true,
        shoot: {
            hitboxRadius: 1.4,
            damage: 15,
            health: 15,
            despawnTime: 3,
            speed: 7,
            definition: Projectile.fromString("peas")
        },
        shootSpeed: 1.5,
        aggroRadius: 30,
        hitboxRadius: 2 * 2 / 0.7,
        speed: 3,
        lootTable: {
            "peas": 0.12,
            "poison_peas": 0.02,
            "leg_poison_peas": 0.005,
            "leg_bubble": 0.012,
            "wing": 0.06,
            "tri_wing": 0.018,
            "myt_poison_peas": 0.006
        },
        rarity: RarityName.mythic,
        exp: 20,
        usingAssets: "mantis"
    },{
        idString: "mega_hornet",
        displayName: "Hornet",
        damage: 35,
        health: 300,
        category: MobCategory.Enemy,
        reachingAway: true,
        shootable: true,
        turningHead: true,
        shoot: {
            hitboxRadius: 1.8,
            damage: 20,
            health: 20,
            despawnTime: 3,
            speed: 6,
            definition: Projectile.fromString("missile")
        },
        shootSpeed: 1.5,
        aggroRadius: 30,
        hitboxRadius: 3 / 0.6,
        speed: 4,
        lootTable: {
            "dandelion": 0.28,
            "missile": 0.18,
            "big_missile": 0.02,
            "myt_big_missile": 0.009,
            "bubble": 0.2,
            "leg_bubble": 0.012,
            "triplet": 0.024,
            "tri_stinger": 0.012,
            "pinger": 0.004,
            "myt_egg": 0.012,
            "antennae": 0.03,
            "myt_antennae": 0.006
        },
        rarity: RarityName.mythic,
        exp: 20,
        usingAssets: "hornet"
    },{
        idString: "mega_beetle",
        displayName: "Beetle",
        damage: 30,
        health: 400,
        category: MobCategory.Enemy,
        aggroRadius: 20,
        hitboxRadius: 3,
        images: {
            mouth: true,
            mouthXPosition: 2,
            mouthYPosition: 1.5
        },
        speed: 3,
        lootTable: {
            "iris": 1,
            "salt": 0.6,
            "wing": 0.31,
            "triplet": 0.02,
            "tri_stinger": 0.0006,
            "leg_egg": 0.06,
            "powder": 0.016
        },
        rarity: RarityName.mythic,
        exp: 50,
        usingAssets: "beetle"
    },
    {
        idString: "massive_dark_ladybug",
        displayName: "Ladybug",
        damage: 20,
        health: 300,
        category: MobCategory.Passive,
        hitboxRadius: 3.5,
        speed: 3,
        usingAssets: "dark_ladybug",
        lootTable: {
            "tri_rose": 1,
            "epic_rose": 0.08,
            "bubble": 0.32,
            "leg_bubble": 0.03,
            "triplet": 0.08,
            "penta": 0.006,
            "myt_tri_rose": 0.006
        },
        rarity: RarityName.mythic,
        exp: 20
    },{
        idString: "mega_spider",
        displayName: "Spider",
        damage: 20,
        health: 350,
        category: MobCategory.Enemy,
        aggroRadius: 20,
        hitboxRadius: 4,
        shootable: true,
        images: {
            spiderLeg: true
        },
        shoot: {
            hitboxRadius: 6,
            despawnTime: 5,
            speed: 0,
            definition: Projectile.fromString("web"),
            modifiers: {
                speed: 0.6
            }
        },
        shootSpeed: 0.7,
        speed: 3,
        lootTable: {
            "iris": 0.48,
            "stinger": 0.72,
            "triangle": 0.08,
            "tri_triangle": 0.008,
            "tri_stinger": 0.02,
            "web": 0.36,
            "pincer": 0.36,
            "tri_web": 0.01,
            "faster": 0.6,
            "dual_faster": 0.02,
            "pinger": 0.002,
            "myt_tri_web": 0.002,
            "tri_faster": 0.002
        },
        rarity: RarityName.mythic,
        exp: 5,
        usingAssets: "spider"
    }
] satisfies MobDefinition[]);
