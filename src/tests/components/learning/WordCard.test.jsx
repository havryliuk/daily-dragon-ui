import React from 'react';
import {render, screen} from '@testing-library/react';
import WordCard from '../../../../components/learning/WordCard.jsx';

const makeCard = (overrides = {}) => ({
    word: 'TestWord',
    pinyin: 'testpin',
    meanings: ['first meaning', 'second meaning'],
    examples: [
        {chinese: 'ExampleSentence1', english: 'English translation 1'},
        {chinese: 'ExampleSentence2', english: 'English translation 2'},
    ],
    ...overrides,
});

describe('WordCard', () => {
    test('renders the word', () => {
        render(<WordCard card={makeCard()} />);
        expect(screen.getByText('TestWord')).toBeInTheDocument();
    });

    test('renders the pinyin', () => {
        render(<WordCard card={makeCard()} />);
        expect(screen.getByText('testpin')).toBeInTheDocument();
    });

    test('renders all meanings', () => {
        render(<WordCard card={makeCard()} />);
        expect(screen.getByText(/1. first meaning/i)).toBeInTheDocument();
        expect(screen.getByText(/2. second meaning/i)).toBeInTheDocument();
    });

    test('renders example sentences and translations', () => {
        render(<WordCard card={makeCard()} />);
        expect(screen.getByText('ExampleSentence1')).toBeInTheDocument();
        expect(screen.getByText('English translation 1')).toBeInTheDocument();
        expect(screen.getByText('ExampleSentence2')).toBeInTheDocument();
        expect(screen.getByText('English translation 2')).toBeInTheDocument();
    });

    test('renders section headers', () => {
        render(<WordCard card={makeCard()} />);
        expect(screen.getByText(/meaning/i)).toBeInTheDocument();
        expect(screen.getByText(/examples/i)).toBeInTheDocument();
    });
});
