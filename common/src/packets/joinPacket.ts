import { type GameBitStream, type Packet } from "../net";
import { GameConstants } from "../constants";

export class JoinPacket implements Packet {
    name = "";

    serialize(stream: GameBitStream): void {
        stream.writeASCIIString(this.name, GameConstants.player.maxNameLength);
    }

    deserialize(stream: GameBitStream): void {
        this.name = stream.readASCIIString(GameConstants.player.maxNameLength);
    }
}
