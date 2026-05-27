import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import ProgressPage from '../../../components/progress/ProgressPage.jsx';

jest.mock('../../../services/hskService.js', () => ({
    getHskProgress: jest.fn()
}));

const fakeProgress = {
    current_level: 2,
    levels: {
        "1": { total: 500, mastered: 420, in_progress: 55, new: 25 },
        "2": { total: 772, mastered: 0, in_progress: 20, new: 752 },
        "3": { total: 973, mastered: 0, in_progress: 0, new: 0 },
    }
};

function renderProgressPage() {
    return render(
        <MemoryRouter>
            <ChakraProvider value={defaultSystem}>
                <ProgressPage />
            </ChakraProvider>
        </MemoryRouter>
    );
}

test('shows loading spinner initially', () => {
    const { getHskProgress } = require('../../../services/hskService.js');
    getHskProgress.mockReturnValue(new Promise(() => {}));

    renderProgressPage();

    expect(screen.getByText(/loading your progress/i)).toBeInTheDocument();
});

test('renders level cards after data loads', async () => {
    const { getHskProgress } = require('../../../services/hskService.js');
    getHskProgress.mockResolvedValue(fakeProgress);

    renderProgressPage();

    await waitFor(() => expect(screen.getByText('HSK 1')).toBeInTheDocument());
    expect(screen.getByText('HSK 2')).toBeInTheDocument();
    expect(screen.getByText('HSK 3')).toBeInTheDocument();
});

test('highlights current level with Current badge', async () => {
    const { getHskProgress } = require('../../../services/hskService.js');
    getHskProgress.mockResolvedValue(fakeProgress);

    renderProgressPage();

    await waitFor(() => expect(screen.getByText('Current')).toBeInTheDocument());
});

test('shows mastery stats for each level', async () => {
    const { getHskProgress } = require('../../../services/hskService.js');
    getHskProgress.mockResolvedValue(fakeProgress);

    renderProgressPage();

    await waitFor(() => expect(screen.getByText('HSK 1')).toBeInTheDocument());
    expect(screen.getByText('420')).toBeInTheDocument();
});

test('shows error message when fetch fails', async () => {
    const { getHskProgress } = require('../../../services/hskService.js');
    getHskProgress.mockRejectedValue(new Error('network error'));

    renderProgressPage();

    await waitFor(() => expect(screen.getByText(/failed to load progress/i)).toBeInTheDocument());
});
