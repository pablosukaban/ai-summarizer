import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://translo.p.rapidapi.com';

const rapidApiKey = import.meta.env.VITE_RAPID_API_KEY;

export type TranslateParamsType = {
    text: string;
    to: string;
    from?: string;
};

export interface TranslationResponse {
    ok: boolean;
    text_lang: string;
    translated_text: string;
}

export const translateApi = createApi({
    reducerPath: 'translationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        // headers могут содержать персональные ключи, поэтому рекомендуется помещать их в окружение (.env) и загружать их с помощью ENVIRONMENT VARIABLES
        prepareHeaders: (headers) => {
            // const state = getState() as RootState;
            headers.set('content-type', 'application/x-www-form-urlencoded');
            headers.set('X-RapidAPI-Key', rapidApiKey);
            headers.set('X-RapidAPI-Host', 'translo.p.rapidapi.com');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        translateText: builder.mutation<TranslationResponse, string>({
            query: (text) => ({
                url: '/api/v3/translate',
                method: 'POST',
                body: new URLSearchParams({
                    from: 'en',
                    to: 'ru',
                    text: text,
                }),
            }),
        }),
    }),
});
