"use client"

import { Button } from "@/app/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { useTranslations } from 'next-intl'
import { Languages, Check } from "lucide-react"

const languages = [
{ code: "en" as const, name: "English", flag: "🇺🇸" },
{ code: "pt" as const, name: "Português (Brasil)", flag: "🇧🇷" },
]

export function LanguageSwitcher() {
const { i18n } = useTranslation();
const locale = i18n.language
const currentLanguage = languages.find((lang) => lang.code === locale)

const setLocale = (newLocale: string) => {
  i18n.changeLanguage(newLocale);
};

return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
        <Languages className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">{currentLanguage?.flag}</span>
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
        <DropdownMenuItem
            key={language.code}
            onClick={() => setLocale(language.code)}
            className="flex items-center justify-between cursor-pointer"
        >
            <div className="flex items-center">
            <span className="mr-2">{language.flag}</span>
            <span>{language.name}</span>
            </div>
            {locale === language.code && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        ))}
    </DropdownMenuContent>
    </DropdownMenu>
)
}
