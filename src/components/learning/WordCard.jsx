import React from 'react';
import {Box, Separator, Text, VStack} from "@chakra-ui/react";

export default function WordCard({card}) {
    return (
        <Box
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            boxShadow="sm"
            p={8}
        >
            <VStack gap={6} align="stretch">
                <VStack gap={2} align="center" py={4}>
                    <Text fontSize="7xl" fontWeight="bold" lineHeight="1" textAlign="center">
                        {card.word}
                    </Text>
                    <Text fontSize="lg" color="gray.500" textAlign="center">
                        {card.pinyin}
                    </Text>
                </VStack>

                <Separator/>

                <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="gray.400" textTransform="uppercase" letterSpacing="wider" mb={2}>
                        Meaning
                    </Text>
                    <VStack align="flex-start" gap={1}>
                        {card.meanings.map((meaning, i) => (
                            <Text key={i} fontSize="md" color="gray.700">
                                {i + 1}. {meaning}
                            </Text>
                        ))}
                    </VStack>
                </Box>

                {card.examples?.length > 0 && (
                    <Box>
                        <Text fontSize="xs" fontWeight="semibold" color="gray.400" textTransform="uppercase" letterSpacing="wider" mb={2}>
                            Examples
                        </Text>
                        <VStack gap={3} align="stretch">
                            {card.examples.map((example, i) => (
                                <Box key={i}>
                                    <Text fontSize="md">{example.chinese}</Text>
                                    <Text fontSize="sm" color="gray.500" mt={1}>{example.english}</Text>
                                </Box>
                            ))}
                        </VStack>
                    </Box>
                )}
            </VStack>
        </Box>
    );
}
