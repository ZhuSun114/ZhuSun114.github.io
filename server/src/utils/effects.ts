import { ServerEntity } from "../entities/serverEntity";
import { EntityType } from "../../../common/src/constants";
import { PlayerModifiers } from "../../../common/src/typings";
import { ServerPlayer } from "../entities/serverPlayer";
import { ServerMob } from "../entities/serverMob";
import { damageSource, isDamageableEntity, isDamageSourceEntity } from "../typings";

export interface EffectData{
    readonly effectedTarget: ServerEntity
    readonly source: damageSource
    readonly workingType?: EntityType[]
    readonly duration: number
    readonly func?: (dt: number, effected: ServerEntity) => void
    readonly modifier?: Partial<PlayerModifiers>
}

export class Effect {
    time: number = 0;

    hasStarted: boolean = false;

    effectedTarget: ServerEntity;
    source: damageSource;
    workingType?: EntityType[];
    duration: number;
    func?: EffectData["func"];
    modifier?: Partial<PlayerModifiers>;

    constructor(data: EffectData) {
        this.effectedTarget = data.effectedTarget;
        this.source = data.source;
        this.workingType = data.workingType;
        this.duration = data.duration;
        this.func = data.func;
        this.modifier = data.modifier;
    }

    start() {
        if (this.workingType && !this.workingType.includes(this.effectedTarget.type))
            return;
        this.effectedTarget.effects.addEffect(this);
        this.hasStarted = true;
    }

    tick(dt: number) {
        this.time += dt;
        if(this.func) this.func(dt, this.effectedTarget);
        if (this.time >= this.duration) this.destroy();
    }

    destroy() {
        this.effectedTarget.effects.removeEffect(this);
    }
}

export interface PoisonEffectData {
    readonly effectedTarget: ServerEntity;
    readonly source: damageSource
    readonly duration: number
    readonly damagePerSecond: number
}

export class PoisonEffect extends Effect {
    damagePerSecond: number

    constructor(data: PoisonEffectData) {
        super({
            effectedTarget: data.effectedTarget,
            source: data.source,
            duration: data.duration,
            func: (dt, effected) => {
                if (!data) return;
                if (isDamageableEntity(effected)) {
                    if (!effected.canReceiveDamageFrom(this.source)) return
                    effected.receiveDamage(dt * data.damagePerSecond, this.source);
                }
            },
            workingType: [EntityType.Mob, EntityType.Player]
        });
        this.damagePerSecond = data.damagePerSecond;
    }

    destroy() {
        super.destroy();
        if (this.effectedTarget.state.poison === this)
            this.effectedTarget.state.poison = undefined;
    }
}


export class EffectManager {
    effects= new Set<Effect>();

    constructor(public owner: ServerEntity) {}

    tick() {
        this.effects.forEach(e => {
            e.tick(this.owner.game.dt);
        })
    }

    addEffect(effect: Effect) {
        if (effect.effectedTarget != this.owner) return;
        this.effects.add(effect);
    }

    removeEffect(effect: Effect) {
        if (effect.effectedTarget != this.owner) return;
        this.effects.delete(effect);
    }
}
