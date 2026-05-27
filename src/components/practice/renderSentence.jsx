import React from 'react';
import {Text} from "@chakra-ui/react";

export function renderSentence(sentence) {
    return sentence.split(/(<[^>]+>)/).map((part, i) => {
        const match = part.match(/^<(.+)>$/);
        if (match) {
            return <Text as="span" key={i} color="teal.600" fontWeight="bold">{match[1]}</Text>;
        }
        return part;
    });
}
