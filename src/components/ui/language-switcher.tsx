'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { parseCookies, setCookie } from 'nookies'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

type GoogleTranslationConfig = {
    defaultLanguage: string
    languages: { name: string; title: string; icon?: string }[]
}

declare global {
    interface Window {
        __GOOGLE_TRANSLATION_CONFIG__?: GoogleTranslationConfig
    }
}

const COOKIE_NAME = 'googtrans'

const LanguageSwitcher = () => {
    const [currentLang, setCurrentLang] = useState('en')
    const [config, setConfig] = useState<GoogleTranslationConfig | null>(null)

    useEffect(() => {
        const handleConfig = () => {
            const translationConfig = window.__GOOGLE_TRANSLATION_CONFIG__
            if (!translationConfig) return

            setConfig(translationConfig)
            const cookie = parseCookies()[COOKIE_NAME]
            const lang = cookie?.split('/')?.[2] || translationConfig.defaultLanguage
            setCurrentLang(lang)
        }

        if (window.__GOOGLE_TRANSLATION_CONFIG__) {
            handleConfig()
        }

        window.addEventListener('translationConfigReady', handleConfig)

        return () => {
            window.removeEventListener('translationConfigReady', handleConfig)
        }
    }, [])

    const switchLang = (lang: string) => {
        setCookie(undefined, COOKIE_NAME, `/auto/${lang}`, { path: '/' })
        window.location.reload()
    }

    if (!config) return null

    return (
        <Select value={currentLang} onValueChange={switchLang}>
            <SelectTrigger className="w-[140px] bg-white text-[#00253E] border-none rounded-full h-10 px-4 font-semibold focus:ring-0">
                <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-white border-none shadow-lg rounded-[12px]">
                {config.languages.map((lang) => (
                    <SelectItem
                        key={lang.name}
                        value={lang.name}
                        className="text-[#00253E] hover:bg-primary/10 cursor-pointer focus:bg-primary/20"
                    >
                        <div className="flex items-center gap-2">
                            <span>{lang.title}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default LanguageSwitcher
