import React from 'react';
import {
    Box, Button, Input, List, Spinner, Text, VStack, HStack, Heading,
    DialogRoot, DialogContent, DialogHeader,
    DialogBody, DialogFooter, DialogTitle, DialogActionTrigger
} from "@chakra-ui/react";
import {getDueVocabulary, submitReviews} from "../../services/vocabularyService.js";
import {useState, useEffect} from "react";
import {getPracticeSentences, submitTranslations} from "../../services/ai/aiService.js";
import {FiZap} from "react-icons/fi";

export function PracticePage({onReview}) {
    const [gettingSentences, setGettingSentences] = useState(true);
    const [words, setWords] = useState([]);
    const [sentences, setSentences] = useState([]);
    const [translations, sendTranslations] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        (async () => {
            const words = await getDueVocabulary();
            setWords(words);

            let sentencesResult = await getPracticeSentences(words);

            if (typeof sentencesResult === 'string') {
                try { sentencesResult = JSON.parse(sentencesResult); }
                catch (e) { console.error('Failed to parse sentences response:', e); }
            }

            let sentencesArray = [];
            if (Array.isArray(sentencesResult)) {
                sentencesArray = sentencesResult;
            } else if (sentencesResult && Array.isArray(sentencesResult.sentences)) {
                sentencesArray = sentencesResult.sentences.map(s => s.sentence || s);
                const returnedWords = sentencesResult.sentences.map(s => s.word).filter(Boolean);
                if (returnedWords.length === sentencesArray.length) setWords(returnedWords);
            }

            setSentences(sentencesArray);
            sendTranslations(Array(sentencesArray.length).fill(""));
            setGettingSentences(false);
        })();
    }, []);

    const handleInputChange = (index, value) => {
        sendTranslations((prev) => {
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
                word: words[i], sentence, translation: translations[i]
            }));
            const review = await submitTranslations({translations: payload});
            await submitReviews(review.map(r => ({word: r.targetWord, quality: r.score})));
            onReview(review);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = () => {
        if (hasEmpty) setConfirmOpen(true);
        else doSubmit();
    };

    if (gettingSentences) {
        return (
            <VStack
                align="center"
                py={16}
                bg="white"
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.100"
                gap={4}
            >
                <Spinner size="xl" color="blue.500"/>
                <Text color="gray.500">Getting sentences for translation...</Text>
            </VStack>
        );
    }

    return (
        <VStack gap={5} align="stretch">
            <HStack gap={2} align="center">
                <FiZap/>
                <Heading size="lg">Practice</Heading>
            </HStack>

            <Text color="gray.500" fontSize="sm">
                Translate the following sentences into Chinese using the correct translation of the underlined word.
            </Text>

            <VStack gap={3}>
                {sentences.map((sentence, index) => (
                    <Box
                        key={index}
                        bg="white"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="gray.100"
                        p={4}
                    >
                        <Text fontSize="md" mb={2} color="gray.700">
                            <Text as="span" fontWeight="semibold" color="blue.600" mr={1}>
                                {index + 1}.
                            </Text>
                            {sentence}
                        </Text>
                        <Input
                            placeholder="Your Chinese translation..."
                            value={translations[index]}
                            onChange={(e} => handleInputChange(index, e.target.value)}
                            size="md"
                            mt={1}
                        />
                    </Box>
                ))}
            </VStack>

            <HStack justify="flex-end">
                <Button
                    colorPalette="blue"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={submitting}
                    loading={submitting}
                    loadingText="Submitting..."
                >
                    Submit
                </Button>
            </HStack>

            <DialogRoot open={confirmOpen} onOpenChange={(e) => setConfirmOpen(e.open)}>
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
                        <Button colorPalette="blue" onClick={() => { setConfirmOpen(false); doSubmit(); }}>Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </DialogRoot>
        </VStack>
    );
}
