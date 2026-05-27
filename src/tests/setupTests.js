import '@testing-library/jest-dom';
import {TextEncoder, TextDecoder} from 'util';

if (typeof global.TextEncoder === "undefined") {
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
}

if (typeof global.structuredClone === "undefined") {
    global.structuredClone = (obj) =>
        obj === undefined ? undefined : JSON.parse(JSON.stringify(obj));
}
