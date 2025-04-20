import { ServerEntity } from "./entities/serverEntity";
import { ServerPetal } from "./entities/serverPetal";
import { ServerPlayer } from "./entities/serverPlayer";
import { ServerMob } from "./entities/serverMob";
import { EntityType } from "../../common/src/constants";
import { ServerProjectile } from "./entities/serverProjectile";

export type collideableEntity = ServerPetal | ServerPlayer | ServerMob;
export type damageSource = ServerPlayer | ServerMob;
export type damageableEntity = ServerPetal | ServerPlayer | ServerMob | ServerProjectile;

export function isCollideableEntity(entity: ServerEntity): entity is collideableEntity {
    return entity.type === EntityType.Petal
        || entity.type === EntityType.Player
        || entity.type === EntityType.Mob
        || entity.type === EntityType.Projectile;
}

export function isDamageSourceEntity(entity: ServerEntity): entity is damageSource {
    return entity.type === EntityType.Player
        || entity.type === EntityType.Mob;
}

export function isDamageableEntity(entity: ServerEntity): entity is damageableEntity {
    return entity.type === EntityType.Petal
        || entity.type === EntityType.Player
        || entity.type === EntityType.Mob
        || entity.type === EntityType.Projectile;
}
