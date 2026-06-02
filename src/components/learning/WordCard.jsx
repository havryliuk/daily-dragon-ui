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
            minH="320px"
        >
            <VStack gap={5} align="stretch">
                {/* Character */}
                <Text fontSize="6ql" fontWeight="bold" textAlign="center" lineHeight="1.2">
                    {card.word}
                </Text>

                {/* Pinyin */}
                <Text fontSize="xl" color="purple.500" textAlign="center">
                    {card.pinyin}
                </Text>

                {/* Meanings */}
                <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" mb={2}>
                        Meaning
                    </Text>
                    <VStack align="flex-start" gap={1}>
                        {card.meanings.map((meaning, i) => (
                            <Text key={i} fontSize="md">
                                {i + 1}. {meaning}
                            </Text>
                        ))}
                    </VStack>
                </Box>

                <Separator/>

                {/* Example sentences */}
                <Box>
                    <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" mb={2}>
                        Examples
                    </Text>
                    <VStack gap={3} align="stretch">
                        {card.examples.map((example, i) => (
                            <Box key={i}>
                                <Text fontSize="md">{example.chinese}</Text>
                                <Text fontSize="sm" color="gray.500" ml={4}>{example.english}</Text>
                            </Box>
                        ))}
                    </VStack>
                </Box>
            </VStack>
        </Box>
    );
}
