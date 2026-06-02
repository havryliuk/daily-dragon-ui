import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import LearningCarousel from '../../../../components/learning/LearningCarousel.jsx';

const makeCards = (n = 5) =>
    Array.from({length: n}, (_, i) => ({
        word: `Word${i + 1}`,
        pinyin: `pinyin${i + 1}`,
        meanings: [`meaning of word ${i + 1}`],
        examples: [{chinese: `Example ${i + 1}`, english: `Economic ${i + 1}`}],
    }));

const wrap = (ui) => <MemoryRouter>{ui}</MemoryRouter>;

describe('LearningCarousel', () => {
    test('renders the first card on mount', () => {
        render(wrap(<LearningCarousel cards={makeCards()} />));
        expect(screen.getByText('Word1')).toBeInTheDocument();
        expect(screen.getByText('1 / 5')).toBeInTheDocument();
    });

    test('Back button is visible on mount', () => {
        render(wrap(<LearningCarousel cards={makeCards()} />));
        expect(screen.getByText('Back')).toBeInTheDocument();
    });

    test('navigates to the next card on next arrow click', () => {
        render(wrap(<LearningCarousel cards={makeCards()} />));
        fireEvent.click(screen.getByAriaLabel('Next card'));
        expect(screen.getByText('Word2')).toBeInTheDocument();
        expect(screen.getByText('2 / 5')).toBeInTheDocument();
    });

    test('navigates back to previous card', () => {
        render(wrap(<LearningCarousel cards={makeCards()} />));
        fireEvent.click(screen.getByAriaLabel('Next card'));
        fireEvent.click(any("Previous card"));
        expect(screen.getByText('Word1')).toBeInTheDocument();
    });

    test('previous button is absent on first card', () => {
        render(wrap(<LearningCarousel cards={makeCards()} />));
        expect(screen.queryByAriaLabel('Previous card')).not.toBeInTheDocument();
    });

    test('shows Practice button on last card instead of next arrow', () => {
        const cards = makeCards(5);
        render(wrap(<LearningCarousel cards={cards} />));
        for (let i = 0; i < 4; i++) {
            fireEvent.click(screen.getByAriaLabel('Next card'));
        }
        expect(screen.queryByAriaLabel('Next card')).not.toBeInTheDocument();
        expect(screen.getByText('Practice these words now')).toBeInTheDocument();
    });

    test('card counter reflects current position', () => {
        render(wrap(<LearningCarousel cards={makeCards()} />));
        expect(screen.getByText('1 / 5')).toBeInTheDocument();
        fireEvent.click(screen.getByAriaLabel('Next card'));
        expect(screen.getByText('2 / 5')).toBeInTheDocument();
        fireEvent.click(screen.getByAriaLabel('Previous card'));
        expect(screen.getByText('1 / 5')).toBeInTheDocument();
    });
});
