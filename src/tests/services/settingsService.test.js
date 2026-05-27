import { getSettings, updateSettings } from '../../services/settingsService.js';
import { getToken } from '../../services/auth.js';

jest.mock('../../services/auth.js', () => ({
    getToken: jest.fn()
}));

describe('settingsService', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
        getToken.mockResolvedValue('test-token');
    });

    afterEach(() => {
        jest.resetAllMocks();
        delete global.fetch;
    });

    test('getSettings: GETs /settings with Authorization header', async () => {
        const fakeSettings = { hsk_level: 2, placement_completed: true };
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => fakeSettings });

        const result = await getSettings();

        const [url, options] = global.fetch.mock.calls[0];
        expect(url).toContain('/settings');
        expect(options.headers['Authorization']).toBe('Bearer test-token');
        expect(result).toEqual(fakeSettings);
    });

    test('getSettings: throws when response is not ok', async () => {
        global.fetch.mockResolvedValueOnce({ ok: false });
        await expect(getSettings()).rejects.toThrow('Failed to fetch settings');
    });

    test('updateSettings: PATCHes /settings with body', async () => {
        const updated = { hsk_level: 3, placement_completed: true };
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => updated });

        const result = await updateSettings({ hsk_level: 3 });

        const [url, options] = global.fetch.mock.calls[0];
        expect(url).toContain('/settings');
        expect(options.method).toBe('PATCH');
        expect(JSON.parse(options.body)).toEqual({ hsk_level: 3 });
        expect(result).toEqual(updated);
    });

    test('updateSettings: throws when response is not ok', async () => {
        global.fetch.mockResolvedValueOnce({ ok: false });
        await expect(updateSettings({ hsk_level: 1 })).rejects.toThrow('Failed to update settings');
    });
});
