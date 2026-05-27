import {DAILY_DRAGON_API_BASE_URL} from "../config.js";
import {getToken} from "./auth.js";

export async function getHskProgress() {
    const response = await fetch(DAILY_DRAGON_API_BASE_URL + '/hsk/progress', {
        headers: {"Authorization": "Bearer " + await getToken()}
    });
    if (!response.ok) throw new Error('Failed to fetch HSK progress');
    return await response.json();
}
