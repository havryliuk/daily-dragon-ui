import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
    theme: {
        tokens: {
            fonts: {
                body:    { value: "Inter, system-ui, -apple-system, sans-serif" },
                heading: { value: "Inter, system-ui, -apple-system, sans-serif" },
            },
        },
    },
})

export const system = createSystem(defaultConfig, config)
