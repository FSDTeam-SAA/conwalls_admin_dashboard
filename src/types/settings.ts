export interface LanguageValues {
    de: string
    en: string
}

export interface HelpText {
    name: string
    values: LanguageValues
}

export interface TypeItem {
    _id?: string
    name: string
    labels?: LanguageValues
}

export interface MeasureType {
    _id?: string
    name: string
    labels?: LanguageValues
    values: LanguageValues
}

export interface CategoryType extends TypeItem {
    measureTypes: MeasureType[]
}

export interface SystemSettings {
    _id: string
    helpTexts: HelpText[]
    stakeholderHelpTexts: HelpText[]
    roleTypes: TypeItem[]
    categoryTypes: CategoryType[]
    measureTypes: MeasureType[]
    triggerAiPrompt: MeasureType[]
    createdAt?: string
    updatedAt?: string
    __v?: number
}

export interface SystemSettingsResponse {
    status: boolean
    message: string
    data: {
        items: SystemSettings[]
        pagination?: {
            page: number
            limit: number
            totalItems: number
            totalPages: number
            hasNext: boolean
            hasPrev: boolean
        }
    }
}

export interface CreateSystemSettingsResponse {
    status: boolean
    message: string
    data: SystemSettings
}
