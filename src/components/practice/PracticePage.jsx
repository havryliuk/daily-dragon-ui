import React from 'react';
import {
    Box, Button, Input, Spinner, Text, VStack,
    DialogRoot, DialogBackdrop, DialogPositioner, DialogContent, DialogHeader,
    DialogBody, DialogFooter, DialogTitle, DialogActionTrigger
} from "@chakra-ui/react";
import {getDueVocabulary, submitReviews} from "../../services/vocabularyService.js";
import {useState, useEffect} from "react";
import {getPracticeSentences, submitTranslations} from "../../services/ai/aiService.js";
import {renderSentence} from "./renderSentence.jsx";
import {toaster} from "../ui/toaster.jsx";

async function fetchAndParseSentences(words, hskLevel) {
    const result = await getPracticeSentences(words, hskLevel);

    if (result && Array.isArray(result.sentences)) {
        const sentences = result.sentences.map(s => s.sentence || s);
        const orderedWords = result.sentences.map(s => s.word).filter(Boolean);
        return {sentences, words: orderedWords.length === sentences.length ? orderedWords : words};
    }

    return {sentences: [], words};
}

export function PracticePage({onReview, hskLevel}) {
    const [gettingSentences, setGettingSentences] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [words, setWords] = useState([]);
    const [sentences, setSentences] = useState([]);
    const [translations, setTranslations] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        setGettingSentences(true);
        setLoadError(null);
        loadPractice();

        async function loadPractice() {
            try {
                const words = await getDueVocabulary();
                const {sentences, words: orderedWords} = await fetchAndParseSentences(words, hskLevel);
                setWords(orderedWords);
                setSentences(sentences);
                setTranslations(Array(sentences.length).fill(""));
            } catch (e) {
                setLoadError('Failed to load practice sentences. Please try again.');
            } finally {
                setGettingSentences(false);
            }
        }
    }, [retryCount]);

    const handleInputChange = (index, value) => {
        setTranslations((prev) => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };

    const hasEmpty = Array.isArray(translations) && translations.some((t) => (t || "").trim() === "");

    const doSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = sentences.map((sentence, i) => ({
                word: words[i],
                sentence,
                translation: translations[i]
            }));
            const review = await submitTranslations({translations: payload});
            await submitReviews(review.map(r => ({word: r.targetWord, quality: r.score})));
            onReview(review);
        } catch (e) {
            toaster.create({
                title: 'Submission failed',
                description: 'Could not submit translations. Please try again.',
                type: 'error',
                closable: true,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = () => {
        if (hasEmpty) {
            setConfirmOpen(true);
        } else {
            doSubmit();
        }
    };

    if (gettingSentences) {
        return (
            <Box py={12} textAlign="center">
                <Spinner colorPalette="teal" size="lg" mb={3}/>
                <Text color="gray.500">Getting sentences for translation...</Text>
            </Box>
        );
    }

    if (loadError) {
        return (
            <Box py={12} textAlign="center">
                <Text color="red.500" mb={4}>{loadError}</Text>
                <Button colorPalette="teal" onClick={() => setRetryCount(c => c + 1)}>Try again</Button>
            </Box>
        );
    }

    return (
        <VStack gap={4} align="stretch">
            <Text color="gray.600" fontSize="sm">
                Translate the following sentences into Chinese using the correct translation of the <Text as="span" color="teal.600" fontWeight="bold">highlighted word</Text>.
            </Text>

            {sentences.map((sentence, index) => (
                <Box
                    key={index}
                    bg="white"
                    p={4}
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    boxShadow="sm"
                >
                    <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.500">
                        {index + 1}.
                    </Text>
                    <Text mb={3}>{renderSentence(sentence)}</Text>
                    <Input
                        placeholder="Your translation..."
                        value={translations[index]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                </Box>
            ))}

            <Box pt={2}>
                <Button colorPalette="teal" onClick={handleSubmit} disabled={submitting} w={{base: "full", md: "auto"}}>
                    {submitting ? <><Spinner size="sm" mr={2}/>Submitting...</> : "Submit"}
                </Button>
            </Box>

            <DialogRoot open={confirmOpen} onOpenChange={(e) => setConfirmOpen(e.open)}>
                <DialogBackdrop/>
                <DialogPositioner>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Incomplete translations</DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                            <Text>You've left some translations blank. Submit anyway?</Text>
                        </DialogBody>
                        <DialogFooter>
                            <DialogActionTrigger asChild>
                                <Button variant="outline">Go back</Button>
                            </DialogActionTrigger>
                            <Button colorPalette="teal" onClick={() => {
                                setConfirmOpen(false);
                                doSubmit();
                            }}>Submit</Button>
                        </DialogFooter>
                    </DialogContent>
                </DialogPositioner>
            </DialogRoot>
        </VStack>
    );
}
