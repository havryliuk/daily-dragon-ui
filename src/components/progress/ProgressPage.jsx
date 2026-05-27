import React from 'react';
import {Box, Button, Heading, HStack, Spinner, Text, VStack, Badge} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";
import {getHskProgress} from "../../services/hskService.js";

const HSK_LEVEL_NAMES = {
    1: "Beginner",
    2: "Elementary",
    3: "Pre-intermediate",
    4: "Intermediate",
    5: "Upper-intermediate",
    6: "Advanced",
    7: "Mastery",
};

function ProgressBar({mastered, inProgress, newCount, total}) {
    const masteredPct = total > 0 ? (mastered / total) * 100 : 0;
    const inProgressPct = total > 0 ? (inProgress / total) * 100 : 0;
    const newPct = total > 0 ? (newCount / total) * 100 : 0;
    return (
        <Box w="full" bg="gray.100" borderRadius="full" h="8px" overflow="hidden" display="flex">
            <Box h="full" bg="teal.400" w={`${masteredPct}%`} transition="width 0.4s ease" flexShrink={0}/>
            <Box h="full" bg="orange.300" w={`${inProgressPct}%`} transition="width 0.4s ease" flexShrink={0}/>
            <Box h="full" bg="gray.300" w={`${newPct}%`} transition="width 0.4s ease" flexShrink={0}/>
        </Box>
    );
}

function LevelCard({level, progress, isCurrent}) {
    const {total, mastered, in_progress, new: newCount} = progress;
    const masteredPct = total > 0 ? Math.round((mastered / total) * 100) : 0;

    return (
        <Box
            bg="white"
            borderWidth="1px"
            borderColor={isCurrent ? "teal.400" : "gray.200"}
            borderRadius="xl"
            p={5}
            boxShadow={isCurrent ? "md" : "sm"}
            position="relative"
        >
            <HStack justify="space-between" mb={3}>
                <HStack gap={2}>
                    <Text fontWeight="bold" fontSize="md">HSK {level}</Text>
                    <Text fontSize="sm" color="gray.500">{HSK_LEVEL_NAMES[level]}</Text>
                </HStack>
                <HStack gap={2}>
                    {isCurrent && (
                        <Badge colorPalette="teal" variant="solid" size="sm">Current</Badge>
                    )}
                    <Text fontSize="sm" fontWeight="semibold" color="teal.600">{masteredPct}%</Text>
                </HStack>
            </HStack>

            <ProgressBar mastered={mastered} inProgress={in_progress} newCount={newCount} total={total}/>

            <HStack gap={4} mt={3} fontSize="xs" color="gray.500">
                <Text><Text as="span" fontWeight="semibold" color="teal.700">{mastered}</Text> mastered</Text>
                <Text><Text as="span" fontWeight="semibold" color="orange.500">{in_progress}</Text> in progress</Text>
                <Text><Text as="span" fontWeight="semibold" color="gray.400">{newCount}</Text> new</Text>
                <Text color="gray.300">/ {total} total</Text>
            </HStack>
        </Box>
    );
}

export default function ProgressPage() {
    const navigate = useNavigate();
    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getHskProgress()
            .then(setProgressData)
            .catch(() => setError("Failed to load progress."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Box py={12} textAlign="center">
                <Spinner colorPalette="teal" size="lg" mb={3}/>
                <Text color="gray.500">Loading your progress...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Box py={12} textAlign="center">
                <Text color="red.500">{error}</Text>
            </Box>
        );
    }

    const {current_level, levels} = progressData;
    const levelEntries = Object.entries(levels)
        .map(([lvl, data]) => ({level: parseInt(lvl), ...data}))
        .sort((a, b) => a.level - b.level);

    return (
        <>
        <Button variant="ghost" size="sm" colorPalette="teal" mb={4} onClick={() => navigate("/")}>
            <FiArrowLeft/> Home
        </Button>
        <VStack gap={6} align="stretch">
            <Heading fontSize="lg" fontWeight="semibold" color="gray.500" textAlign="center">
                HSK Progress
            </Heading>
            <VStack gap={3} align="stretch">
                {levelEntries.map(({level, ...progress}) => (
                    <LevelCard
                        key={level}
                        level={level}
                        progress={progress}
                        isCurrent={level === current_level}
                    />
                ))}
            </VStack>
        </VStack>
        </>
    );
}
