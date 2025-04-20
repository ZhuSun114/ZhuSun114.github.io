import { Game } from "@/scripts/game.ts";
import { Graphics, Container, Text } from "pixi.js";
import { MathNumeric } from "@common/utils/math.ts";
import { Petals } from "@common/definitions/petal.ts";

class LeaderboardContent {
    width: number = 182;
    height: number = 16;

    graphics: Graphics = new Graphics();
    text: Text = new Text({
        text: "",
        style: {
            fontFamily: 'Ubuntu',
            fontSize: 12,
            fill: "#fff",
            stroke: {color: "#000", width: 2}
        }
    });

    constructor() {
        this.text.anchor.set(0.5);
    }

}

export class Leaderboard {
    leaderboardBackground: Graphics = new Graphics();

    leaderboardContents: LeaderboardContent[] = [];

    flowerNumber: Text = new Text({
        text: "",
        style: {
            fontFamily: 'Ubuntu',
            fontSize: 16,
            fill: "#fff",
            stroke: {color: "#000", width: 2}
        }
    })

    container = new Container();

    width: number = 200;
    height: number = 300;

    constructor(private game: Game) {}

    init(){
        this.flowerNumber.anchor.set(0.5);

        this.container.addChild(
            this.leaderboardBackground,
            this.flowerNumber
        );
        this.game.pixi.stage.addChild(
            this.container
        );

        for (let i = 0; i < 10; i++) {
            this.leaderboardContents.push(new LeaderboardContent())
            this.container.addChild(
                this.leaderboardContents[i].graphics,
                this.leaderboardContents[i].text
            )
        }

        this.resize();
        this.redraw();
    }

    render(){
        const number = this.game.playerData.size;
        this.flowerNumber.text = number + ` Flower${number > 1 ? "s" : ""}`;

        let array =
            Array.from(this.game.playerData.values()).sort(
                (a, b) => b.exp - a.exp
            )

        let index = 0;
        let height = 8;

        let highestScore = array[0];

        let hasActivePlayer = false;

        this.leaderboardContents.forEach(leaderboard => {
            leaderboard.graphics.clear();
            if (index < array.length && index < this.leaderboardContents.length) {
                let data = array[index];

                let isActivePlayer = data.id === this.game.activePlayerID;

                const width = MathNumeric.remap(
                    data.exp, 0, highestScore.exp,0, leaderboard.width
                )

                if (isActivePlayer) hasActivePlayer = true;

                if (index === this.leaderboardContents.length - 1 && !hasActivePlayer) {
                    const cache = this.game.playerData.get(this.game.activePlayerID);
                    if (cache) {
                        isActivePlayer = true;
                        data = cache;
                    }
                }

                leaderboard.graphics
                    .roundRect(8, 40 + height, leaderboard.width, leaderboard.height, 100)
                    .fill({ color: 0x000000, alpha: 0.5 })
                    .roundRect(8 + 2, 40 + height + 2, width - 4, leaderboard.height - 4, 100)
                    .fill({ color: isActivePlayer ? 0xd8f060 : 0x5ace55, alpha: 1 })

                leaderboard.text.text = data.name + " - " + data.exp + (isActivePlayer ? " (YOU)" : "");
                leaderboard.text.position.set(
                    8 + leaderboard.width / 2,
                    40 + height + leaderboard.height / 2 - 1
                );
            } else {
                leaderboard.text.text = ""
            }

            height += leaderboard.height + 9;
            index ++;
        })
    }

    resize(): void {
        const screenWidth = this.game.pixi.screen.width;
        const screenHeight = this.game.pixi.screen.height;

        const positionX = screenWidth - this.width - 8;
        const positionY = 8;

        this.container.position.set(positionX, positionY);

    }

    redraw(): void {
        this.leaderboardBackground.clear()
            .roundRect(0, 0, this.width, this.height, 5)
            .fill({ color: 0x53555b, alpha: 0.9 })
            .rect(8 / 2, 8 / 2, this.width - 8, 40 - 8)
            .fill({ color: 0x60cd5b, alpha: 0.9 })
            .stroke({ color: 0x4fa650, width: 8 });
        this.flowerNumber.position.set(this.width / 2, 20);
    }
}
