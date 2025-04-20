import { Game } from "@/scripts/game.ts";
import { ClientApplication } from "@/main.ts";

export interface SettingsData {
    keyboardMovement: boolean
    newControl: boolean
    lowResolution: boolean
    playerName: string
}

export class Settings {
    data: SettingsData = {
        keyboardMovement : false,
        newControl : false,
        lowResolution : false,
        playerName : ""
    };

    constructor(public app: ClientApplication) {
        const data = localStorage.getItem("settings");

        if (data) {
            const json = JSON.parse(data);
            Object.assign(this.data, json);
        }

        this.saveData();
    }

    saveData() {
        localStorage.setItem("settings", JSON.stringify(this.data));
    }

    changeSettings(key: string, to: SettingsData[keyof SettingsData]): void {
        if (this.data.hasOwnProperty(key)) {
            Object.assign(this.data, {
                [key]: to
            });
        }

        this.saveData();
    }
}
