import { getHskProgress } from '../../services/hskService.js';
import { getToken } from '../../services/auth.js';

jest.mock('../../services/auth.js', () => ({
    getToken: jest.fn()
}));

describe('hskService.getHskProgress', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
        getToken.mockResolvedValue('test-token');
    });

    afterEach(() => {
        jest.resetAllMocks();
        delete global.fetch;
    });

    test('GETs /hsk/progress with Authorization header and returns data', async () => {
        const fakeProgress = {
            current_level: 1,
            levels: {
                "1": { total: 500, mastered: 100, in_progress: 20, new: 380 }
            }
        };
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => fakeProgress });

        const result = await getHskProgress();

        const [url, options] = global.fetch.mock.calls[0];
        expect(url).toContain('/hsk/progress');
        expect(options.headers['Authorization']).toBe('Bearer test-token');
        expect(result).toEqual(fakeProgress);
    });

    test('throws when response is not ok', async () => {
        global.fetch.mockResolvedValueOnce({ ok: false });
        await expect(getHskProgress()).rejects.toThrow('Failed to fetch HSK progress');
    });
});
