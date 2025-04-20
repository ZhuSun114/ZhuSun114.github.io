import $ from "jquery";
import { ClientApplication } from "@/main.ts";
import { Config } from "@/config.ts";
import { GameOverPacket } from "@common/packets/gameOverPacket.ts";
import { Tween } from "@tweenjs/tween.js"
import { Game } from "@/scripts/game.ts";
import { Settings, SettingsData } from "@/settings.ts";

export class UI {
    readonly app: ClientApplication;

    readonly canvas = $<HTMLCanvasElement>("#canvas");
    readonly readyButton = $<HTMLDivElement>("#btn-ready");

    readonly inGameScreen =  $<HTMLDivElement>("#in-game-screen");
    readonly outGameScreen =  $<HTMLDivElement>("#out-game-screen");

    readonly main =  $<HTMLDivElement>("#main");
    readonly hud = $<HTMLDivElement>("#hud");

    readonly petalColumn= $<HTMLDivElement>(".petal-column");
    readonly equippedPetalRow= $<HTMLDivElement>(".equipped-petals-row");
    readonly preparationPetalRow= $<HTMLDivElement>(".preparation-petals-row");

    readonly nameInput = $<HTMLInputElement>("#name");

    readonly gameOverScreen = $<HTMLDivElement>("#game-over-screen");

    readonly gameOverMurderer = $<HTMLDivElement>("#game-over-murderer");

    readonly gameOverKills = $<HTMLDivElement>("#game-over-kills");

    readonly continueButton = $<HTMLDivElement>("#btn-continue");

    readonly moveRight = $<HTMLDivElement>("#move-right");

    readonly moveRightTime = $<HTMLDivElement>("#move-right-time");

    readonly deletePetal = $<HTMLDivElement>("<div id='delete-petal'></div>");

    readonly petalInformation =
        $<HTMLDivElement>("<div id='petal-information'></div>");

    readonly settingsButton = $<HTMLDivElement>("#btn-settings");
    readonly settingsDialog = $<HTMLDivElement>("#settings-dialog");

    readonly keyboardMovement = $<HTMLDivElement>("#keyboard-movement");
    readonly newControl = $<HTMLDivElement>("#new-control");
    readonly lowResolution = $<HTMLDivElement>("#low-resolution");

    readonly chatInput = $<HTMLDivElement>("#chat-input");
    readonly chatMessagesBox = $<HTMLDivElement>("#chat-messages");

    openedDialog?: JQuery<HTMLDivElement>;
    get game(): Game {
        return this.app.game;
    }

    constructor(app: ClientApplication) {
        this.app = app;

        this.readyButton.on("click", (e: Event) => {
            this.app.game.sendJoin();
        });

        this.continueButton.on("click", (e: Event) => {
            this.app.game.endGame();
        });

        this.settingsButton.on("click", (e: Event) => {
            this.toggleSettingsDialog();
        })

        this.nameInput.val(this.app.settings.data.playerName);

        this.nameInput.on("input", (e: Event) => {
            this.app.settings.changeSettings("playerName", this.nameInput.val() ?? "");
        })

        this.chatInput.on("focus", (e: Event) => {
            this.chatMessagesBox.addClass("opened")
            for (const chatMessage of this.chatMessages) {
                chatMessage.updateOpacity(1)
            }
        })

        this.chatInput.on("blur", (e: Event) => {
            this.chatMessagesBox.removeClass("opened")
            this.scrollToEnd(this.chatMessagesBox);
            for (const chatMessage of this.chatMessages) {
                chatMessage.updateOpacity()
            }
        })

        $(document).ready(function() {
            $("input").on({
                focus: function() {
                    $(this).addClass("focused");
                },
                blur: function() {
                    $(this).removeClass("focused");
                }
            });
        });

        this.gameOverScreen.css("display", "none");

        this.initSettingsDialog();
    }

    initSettingsDialog() {
        this.initCheckbox(this.keyboardMovement, "keyboardMovement");
        this.initCheckbox(this.newControl, "newControl");
        this.initCheckbox(this.lowResolution, "lowResolution");
    }

    initCheckbox(jq: JQuery, key: keyof SettingsData) {
        jq.prop("checked", this.app.settings.data[key]);

        jq.on("click", (e: Event) => {
            this.app.settings.changeSettings(
                key, jq.prop("checked")
            );
        })
    }

    toggleSettingsDialog(): void {
        if (this.openedDialog === this.settingsDialog) {
            this.settingsDialog.css("animation", "close_dialog 1s forwards");
        } else {
            this.settingsDialog.css("animation", "open_dialog 1s forwards");
        }
        this.openedDialog = this.openedDialog === this.settingsDialog ? undefined : this.settingsDialog
    }

    showGameOverScreen(packet: GameOverPacket) {
        this.gameOverScreen.css("display", "flex");

        this.gameOverMurderer.attr("textStroke", packet.murderer);
        this.gameOverMurderer.text(packet.murderer);
        const kills = `You killed ${packet.kills} flower${packet.kills > 1 ? "s" : ""} this run.`
        this.gameOverKills.attr("textStroke", kills);
        this.gameOverKills.text(kills);
    }

    showOverleveled(time?: number) {
        if (!time && time !== 0) {
            this.moveRight.css("display", "none");
            return;
        }

        let content = `${time}s`;
        if (time <= 0) content = "MOVE RIGHT NOW";
        this.moveRight.css("display", "block");
        this.moveRightTime.attr("textStroke", content);
        this.moveRightTime.text(content);
    }

    chatMessages: ChatMessage[] = [];

    addChatMessage(msg: string) {
        const jq = $(
            `<div class="chat-message" textStroke="${msg}">${msg}</div>`
        );

        this.chatMessagesBox.append(jq)

        this.chatMessages.push(new ChatMessage(msg, jq, Date.now()));

        if (this.chatMessages.length > 20) {
            this.chatMessages.shift()?.jq.remove();
        }

        this.scrollToEnd(this.chatMessagesBox);
    }

    openChat(): void {
        this.chatInput.focus();
    }

    sendChat(): void {
        const content = this.chatInput.val();
        if (content && typeof content === "string") {
            this.app.game.sendChat(content);
        }
        this.chatInput.val("");
        this.chatInput.trigger("blur");
    }

    scrollToEnd(jq: JQuery<HTMLDivElement>) {
        let scrollHeight = jq[0].scrollHeight;
        let height = jq.height() ?? scrollHeight;
        let scrollPosition = scrollHeight - height;
        jq.scrollTop(scrollPosition);
    }

    render(): void {
        if (!this.chatInput.hasClass("focused")) {
            for (const chatMessage of this.chatMessages) {
                chatMessage.updateOpacity()
            }
        }
    }
}

class ChatMessage {
    constructor(public content: string, public jq: JQuery, public createdTime: number) {}

    getOpacity() {
        if ((Date.now() - this.createdTime) / 1000 > 10) return 0;
        return 1;
    }

    updateOpacity(force?: number) {
        if (!force) {
            this.jq.css("opacity", this.getOpacity());
            return
        }
        this.jq.css("opacity", force);
    }
}
