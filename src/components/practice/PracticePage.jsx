import React from 'react';
import {
    Box, Button, Input, Spinner, Text, VStack,
    DialogRoot, DialogBackdrop, DialogPositioner, DialogContent, DialogHeader,
    DialogBody, DialogFooter, DialogTitle, DialogActionTrigger
} from "@chakra-ui/react";
import {getDueVocabulary, submitReviews} from "../../services/vocabularyService.js";
import {useState, useEffect} from "react";
import {getPracticeSentences, submitTranslations} from "../../services/ai/aiService.js";

function renderSentence(sentence) {
    return sentence.split(/(<[^>]+>)/).map((part, i) => {
        const match = part.match(/^<(.+)>$/);
        if (match) {
            return <Text as="span" key={i} color="teal.600" fontWeight="bold">{match[1]}</Text>;
        }
        return part;
    });
}

export function PracticePage({onReview}) {
    const [gettingSentences, setGettingSentences] = useState(true);
    const [words, setWords] = useState([]);
    const [sentences, setSentences] = useState([]);
    const [translations, setTranslations] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        (async () => {
            const words = await getDueVocabulary();
            setWords(words);

            let sentencesResult = await getPracticeSentences(words);

            if (typeof sentencesResult === 'string') {
                try {
                    sentencesResult = JSON.parse(sentencesResult);
                } catch (e) {
                    console.error('Failed to parse sentences response:', e);
                }
            }

            let sentencesArray = [];
            if (Array.isArray(sentencesResult)) {
                sentencesArray = sentencesResult;
            } else if (sentencesResult && Array.isArray(sentencesResult.sentences)) {
                sentencesArray = sentencesResult.sentences.map(s => s.sentence || s);

                const returnedWords = sentencesResult.sentences.map(s => s.word).filter(Boolean);
                if (returnedWords.length === sentencesArray.length) {
                    setWords(returnedWords);
                }
            }

            setSentences(sentencesArray);
            setTranslations(Array(sentencesArray.length).fill(""));
            setGettingSentences(false);
        })();
    }, []);

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
