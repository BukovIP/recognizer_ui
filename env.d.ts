/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly BASE_URL: string
    // добавьте другие переменные окружения, которые вы используете
    readonly VITE_API_URL?: string
    readonly VITE_APP_TITLE?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
