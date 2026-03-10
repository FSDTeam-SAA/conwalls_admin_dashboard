'use client'

import * as React from 'react'
import { useLocale } from 'next-intl'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useRouter, usePathname } from '@/i18n/routing'

const LanguageSwitcher = () => {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const languages = [
        { title: 'English', name: 'en' },
        { title: 'Deutsch', name: 'de' },
    ]

    const switchLang = (nextLocale: string) => {
        router.replace(pathname, { locale: nextLocale })
    }

    return (
        <Select value={locale} onValueChange={switchLang}>
            <SelectTrigger className="w-[140px] bg-white text-[#00253E] border-none rounded-full h-10 px-4 font-semibold focus:ring-0">
                <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-white border-none shadow-lg rounded-[12px]">
                {languages.map((lang) => (
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
