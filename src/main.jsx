import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import {ChakraProvider, createSystem, defaultConfig} from "@chakra-ui/react";
import {BrowserRouter} from "react-router-dom";
import {Toaster} from "./components/ui/toaster";

const system = createSystem(defaultConfig, {
    theme: {
        tokens: {
            colors: {
                brand: {
                    50:  { value: "#f0f4ff" },
                    100: { value: "#dbe4ff" },
                    200: { value: "#aac0fe" },
                    300: { value: "#749efc" },
                    400: { value: "#447ef1" },
                    500: { value: "#3262e9" },
                    600: { value: "#254ad3" },
                    700: { value: "#1d36a7" },
                    800: { value: "#162580" },
                    900: { value: "#0f1756" },
                },
            },
        },
        semanticTokens: {
            colors: {
                "bg-canvas": { value: { _light: "#f8fafc", _dark: "#0f1127" } },
            },
        },
    },
});

createRoot(document.getElementById('root')).render(
    <ChakraProvider value={system}>
        <BrowserRouter>
            <App/>
            <Toaster/>
        </BrowserRouter>
    </ChakraProvider>
)
