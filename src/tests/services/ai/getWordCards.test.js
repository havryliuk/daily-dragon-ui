import {getWordCards} from '../../../../services/ai/aiService.js';

jest.mock('../../../../services/auth.js', () => ({
    getToken: jest.fn(() => Promise.resolve('test-token')),
}));

describe('aiService.getWordCards', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
        delete global.fetch;
    });

    test('sends POST to /learning/word-cards with correct body', async () => {
        const fakeResponse = {cards: []};
        global.fetch.mockResolvedValueOnce({ok: true, json: async () => fakeResponse});

        await getWordCards(['word1', 'word2'], null);

        expect(global.fetch).toHaveBeenCalledTimes(1);
        const [url, options] = global.fetch.mock.calls[0];
        expect(url).toContain('/learning/word-cards');
        expect(options.method).toBe('POST');
        const body = JSON.parse(options.body);
        expect(body.words).toEqual(['word1', 'word2']);
        expect(body).not.toHaveProperty('hsk_level');
    });

    test('includes hsk_level when provided', async () => {
        global.fetch.mockResolvedValueOnce({ok: true, json: async () => ({cards: []})});

        await getWordCards(['word1'], 2);

        const body = JSON.parse(global.fetch.mock.calls[0][1].body);
        expect(body.hsk_level).toBe(2);
    });

    test('omits hsk_level when null', async () => {
        global.fetch.mockResolvedValueOnce({ok: true, json: async () => ({cards: []})});

        await getWordCards(['word1'], null);

        const body = JSON.parse(global.fetch.mock.calls[0][1].body);
        expect(body).not.toHaveProperty('hsk_level');
    });

    test('throws on non-ok response', async () => {
        global.fetch.mockResolvedValueOnce({ok: false, statusText: 'Internal Server Error'});

        await expect(getWordCards(['word1'], null)).rejects.toThrow('API error');
    });

    test('sends Authorization header', async () => {
        global.fetch.mockResolvedValueOnce({ok: true, json: async () => ({cards: []})});

        await getWordCards(['word1'], null);

        const [_, options] = global.fetch.mock.calls[0];
        expect(options.headers['Authorization']).toBe('Bearer test-token');
    });
});
