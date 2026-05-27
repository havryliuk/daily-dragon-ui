import {DAILY_DRAGON_API_BASE_URL} from "../config.js";
import {getToken} from "./auth.js";

const SETTINGS_URL = DAILY_DRAGON_API_BASE_URL + '/settings';

export async function getSettings() {
    const response = await fetch(SETTINGS_URL, {
        headers: {"Authorization": "Bearer " + await getToken()}
    });
    if (!response.ok) throw new Error('Failed to fetch settings');
    return await response.json();
}

export async function updateSettings(settings) {
    const response = await fetch(SETTINGS_URL, {
        method: "PATCH",
        headers: {
            "Authorization": "Bearer " + await getToken(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(settings)
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return await response.json();
}
