import { ServerEntity } from "./serverEntity";
import { Vec2, type Vector } from "../../../common/src/utils/vector";
import { type EntitiesNetData } from "../../../common/src/packets/updatePacket";
import { CircleHitbox } from "../../../common/src/utils/hitbox";
import { EntityType, GameConstants } from "../../../common/src/constants";
import { Game } from "../game";
import { MobCategory, MobDefinition } from "../../../common/src/definitions/mob";
import { MathGraphics, MathNumeric } from "../../../common/src/utils/math";
import { ServerPlayer } from "./serverPlayer";
import { Random } from "../../../common/src/utils/random";
import { PetalDefinition, Petals } from "../../../common/src/definitions/petal";
import { spawnLoot } from "../utils/loot";
import { ServerProjectile } from "./serverProjectile";
import { PlayerModifiers } from "../../../common/src/typings";
import { collideableEntity, damageableEntity, damageSource, isDamageSourceEntity } from "../typings";
import { CollisionResponse } from "../../../common/src/utils/collision";
import { ProjectileParameters } from "../../../common/src/definitions/projectile";

export class ServerMob extends ServerEntity<EntityType.Mob> {
    type: EntityType.Mob = EntityType.Mob;

    hitbox: CircleHitbox;
    definition: MobDefinition;

    get name(): string {
        return this.definition.displayName
    }

    readonly damage: number;

    private _health!: number;
    get health(): number {
        return this._health;
    }

    set health(value: number) {
        if (value === this._health) return
        this._health = MathNumeric.clamp(value, 0, this.definition.health);

        this.setFullDirty();
    }

    aggroTarget?: damageSource;

    _direction: Vector = Vec2.new(0, 0);

    get direction(): Vector {
        return this._direction
    }

    set direction(value: Vector) {
        if (value === this._direction) return
        this._direction = value;

        this.setDirty();
    }

    get speed(): number {
        if (this.definition.category !== MobCategory.Fixed) return this.definition.speed * this.modifiers.speed;
        return 0;
    }

    walkingReload: number = 0;
    walkingTime: number = 0;
    shootReload: number = 0;

    canReceiveDamageFrom(entity: ServerEntity): boolean {
        if (entity instanceof ServerProjectile) {
            return entity.source.type != this.type;
        }
        if (entity instanceof ServerFriendlyMob)
            return true
        return !(entity instanceof ServerMob);
    }

    lastSegment?: ServerMob;

    constructor(game: Game
                , position: Vector
                , direction: Vector
                , definition: MobDefinition
                , lastSegment?: ServerMob) {
        super(game, position);
        this.definition = definition;
        this.hitbox = new CircleHitbox(definition.hitboxRadius);
        this.damage = definition.damage;
        this.health = definition.health;

        this.weight = definition.hitboxRadius * 10;

        this.lastSegment = lastSegment;
        this.position = position;

        this.game.grid.addEntity(this);
        this.position = position;

        this.direction = direction;
    }

    changeAggroTo(entity?: damageSource): void {
        if (![MobCategory.Enemy, MobCategory.Passive].includes(this.definition.category)) return;

        if (this.aggroTarget && !entity) {
            this.aggroTarget = undefined;
        } else if (!this.aggroTarget && entity) {
            if (!this.canReceiveDamageFrom(entity)) return;
            this.aggroTarget = entity;
        }
    }

    shoot(shoot: ProjectileParameters): void {
        const position = shoot.definition.onGround ? this.position
           : Vec2.add(this.position,Vec2.mul(this.direction, this.hitbox.radius))

        new ServerProjectile(this,
            position,
            this.direction, shoot);
    }

    tick(): void{
        super.tick()

        if (this.lastSegment && !this.lastSegment.destroyed) {
            this.direction = MathGraphics.directionBetweenPoints(
                this.position,
                this.lastSegment.position
            );

            this.position = MathGraphics.getPositionOnCircle(
                Vec2.directionToRadians(
                    this.direction,
                ),
                this.definition.hitboxRadius + this.lastSegment.definition.hitboxRadius,
                this.lastSegment.position
            );
        } else if (this.definition.category !== MobCategory.Fixed) {
            if (this.aggroTarget) {
                if (this.aggroTarget.destroyed) {
                    this.changeAggroTo();
                } else {
                    if (Vec2.distance(this.aggroTarget.position, this.position) > 60) {
                        return this.changeAggroTo();
                    }

                    if (this.definition.shootable) {
                        if (Vec2.distance(this.position, this.aggroTarget.position) < 15 && this.definition.reachingAway) {
                            this.shootReload += this.game.dt;
                            if (this.shootReload >= this.definition.shootSpeed) {
                                this.direction = MathGraphics.directionBetweenPoints(this.aggroTarget.position, this.position);
                                this.shoot(this.definition.shoot);
                                this.shootReload = 0;
                            } else if (this.shootReload >= this.definition.shootSpeed * 0.6 && this.definition.turningHead) {
                                this.direction = Vec2.mul(
                                    MathGraphics.directionBetweenPoints(this.aggroTarget.position, this.position),
                                    -1
                                );
                            } else {
                                this.direction = MathGraphics.directionBetweenPoints(this.aggroTarget.position, this.position);
                            }
                        } else {
                            this.direction = MathGraphics.directionBetweenPoints(this.aggroTarget.position, this.position);

                            this.setAcceleration(Vec2.mul(
                                this.direction, this.speed
                            ));

                            if (!this.definition.reachingAway) {
                                this.shootReload += this.game.dt;
                                if (this.shootReload >= this.definition.shootSpeed) {
                                    this.shoot(this.definition.shoot);
                                    this.shootReload = 0;
                                }
                            }
                        }
                    } else {
                        this.direction = MathGraphics.directionBetweenPoints(this.aggroTarget.position, this.position);
                        if (this.definition.reachingAway) {
                            if (Vec2.distance(this.position, this.aggroTarget.position) > 15) {
                                this.setAcceleration(Vec2.mul(
                                    this.direction, this.speed
                                ));
                            }
                        } else {
                            this.setAcceleration(Vec2.mul(
                                this.direction, this.speed
                            ));
                        }
                    }
                }
            } else {
                this.walkingReload += this.game.dt;
                if (this.walkingReload >= GameConstants.mob.walkingReload) {
                    if (this.walkingTime === 0) this.direction = Random.vector(-1, 1, -1, 1)
                    this.setAcceleration(Vec2.mul(
                        this.direction, this.speed * GameConstants.mob.walkingTime
                    ))

                    this.walkingTime += this.game.dt;

                    if (this.walkingTime >= GameConstants.mob.walkingTime) {
                        this.walkingReload = 0;
                        this.walkingTime = 0;
                    }
                }

                if (this.definition.category === MobCategory.Enemy && !this.aggroTarget) {
                    const aggro = new CircleHitbox(
                        this.definition.aggroRadius, this.position
                    );

                    const entities =
                        this.game.grid.intersectsHitbox(aggro);

                    for (const entity of entities) {
                        if (!(isDamageSourceEntity(entity))) continue;
                        if (aggro.collidesWith(entity.hitbox)) {
                            this.changeAggroTo(entity);
                        }
                    }
                }
            }
        }

        this.updateModifiers();
    }

    dealDamageTo(to: damageableEntity): void{
        if (to.canReceiveDamageFrom(this))
            to.receiveDamage(this.damage, this);
    }

    receiveDamage(amount: number, source: damageSource, disableEvent?: boolean): void {
        if (!this.isActive()) return;

        this.changeAggroTo(source)

        this.health -= amount;

        if (this.health <= 0) {
            this.destroy();

            if (source instanceof ServerPlayer){
                source.addExp(this.definition.exp)
            }
        }
    }

    get data(): Required<EntitiesNetData[EntityType]>{
        return {
            position: this.position,
            definition: this.definition,
            direction: this.direction,
            full: {
                healthPercent: this.health / this.definition.health
            }
        };
    };

    destroy() {
        super.destroy();

        const lootTable = this.definition.lootTable;

        let loots: PetalDefinition[] = []

        const randomMax = 10000;

        for (const lootsKey in lootTable) {
            if (!Petals.hasString(lootsKey)) continue;
            const random = Random.int(0, randomMax);
            if (random <= lootTable[lootsKey] * randomMax){
                loots.push(Petals.fromString(lootsKey));
            }
        }

        spawnLoot(this.game, loots, this.position)
    }
}

export class ServerFriendlyMob extends ServerMob {
    canReceiveDamageFrom(source: damageableEntity): boolean {
        switch (source.type) {
            case EntityType.Player:
                return source != this.owner
            case EntityType.Mob:
                if (source instanceof ServerFriendlyMob) return source.owner !== this.owner;
                return true;
            case EntityType.Petal:
                return source.owner != this.owner
            case EntityType.Projectile:
                return source.source != this
                   && source.source !== this.owner;
        }
    }

    canCollideWith(entity: collideableEntity): boolean {
        return this.owner.canReceiveDamageFrom(entity);
    }

    shoot(shoot: ProjectileParameters) {
        new ServerProjectile(this.owner,
            this.position,
            this.direction, shoot);
    }


    constructor(game: Game
        , public owner: ServerPlayer
        , definition: MobDefinition) {
        super(game, Random.pointInsideCircle(owner.position, 6), owner.direction, definition);
    }

    tick() {
        if (Vec2.distance(this.position, this.owner.position) > 25) {
            this.changeAggroTo();
            this.direction = MathGraphics.directionBetweenPoints(this.owner.position, this.position);
            this.addVelocity(Vec2.mul(this.direction, 10), 0.6)
        }

        super.tick();
    }

    dealDamageTo(to: damageableEntity) {
        if (to.canReceiveDamageFrom(this))
            to.receiveDamage(this.damage, this.owner);
    }

    destroy() {
        this.destroyed = true;
        this.game.grid.remove(this);
    }
}
