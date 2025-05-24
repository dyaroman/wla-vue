import type { ColumnsConfig } from '@/types/columns.types.ts'

export interface WebsitesData {
  columns: ColumnsConfig
  commit: string
  env: string
  repoPath: string
  timestamp: string
  websites: Website[]
}

type WebsiteColumnValue = string | number | 'no_data' | string[]

export interface Website extends Omit<Record<keyof ColumnsConfig, WebsiteColumnValue>, 'forms'> {
  website: string
  forms: { [key: string]: Pages }
}

export interface Pages {
  [key: string]: FormOptions
}

export interface FormOptions {
  
  campaignid?: string
  leadtypeid?: number

  // lp
  campaignUid?: string
  leadTypeId?: number

  theme?: string
  primaryColor?: string
  jsfLightenPercent?: number
  jsfDarkenPercent?: number
  enablePhoneLogin?: boolean
  noClicklisting?: boolean
  noDebt?: boolean
  ccpaPopup?: boolean
  enableOCS?: boolean
  instantSubmitOCS?: boolean
  zipCodeOCS?: boolean
  singleButtonOCS?: boolean
  hybridOCS?: boolean
  noCaptchaOCS?: boolean
  loanAmounts?: [value: string, key: string][]
  processingFlowId?: number
  enableEmailLogin?: boolean
  autoLogin?: boolean
  lang?: string
  declinedURL?: string
  env?: string
}
