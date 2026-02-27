/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect } from 'react'

const config = {
    languages: [
        { title: 'English', name: 'en' },
        { title: 'German', name: 'de' },
    ],
    defaultLanguage: 'en',
}

export default function LangConfig() {
    useEffect(() => {
        if (typeof window === 'undefined') return

            // Set configuration immediately
            ; (window as any).__GOOGLE_TRANSLATION_CONFIG__ = config

        // Create a custom event to notify components that config is ready
        const event = new Event('translationConfigReady')
        window.dispatchEvent(event)

        // Load Google Translate script
        const script = document.createElement('script')
        script.src =
            '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        script.async = true
        document.body.appendChild(script)

            ; (window as any).googleTranslateElementInit = () => {
                new (window as any).google.translate.TranslateElement(
                    {
                        pageLanguage: config.defaultLanguage,
                        includedLanguages: config.languages.map((l) => l.name).join(','),
                        layout: (window as any).google.translate.TranslateElement.InlineLayout
                            .SIMPLE,
                        autoDisplay: false,
                    },
                    'google_translate_element',
                )
            }
    }, [])

    return <div id="google_translate_element" style={{ display: 'none' }} />
}
