import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import {ChakraProvider} from "@chakra-ui/react";
import {system} from "./theme.js";
import {BrowserRouter} from "react-router-dom";
import {Toaster} from "./components/ui/toaster";

createRoot(document.getElementById('root')).render(
    <ChakraProvider value={system}>
        <BrowserRouter>
            <App/>
            <Toaster/>
        </BrowserRouter>
    </ChakraProvider>
)
