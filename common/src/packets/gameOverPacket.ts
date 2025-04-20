import { type GameBitStream, type Packet } from "../net";

export class GameOverPacket implements Packet {
    kills = 0;
    murderer = "Ohio";

    serialize(stream: GameBitStream): void {
        stream.writeUint8(this.kills);
        stream.writeASCIIString(this.murderer);
    }

    deserialize(stream: GameBitStream): void {
        this.kills = stream.readUint8();
        this.murderer = stream.readASCIIString();
    }
}
