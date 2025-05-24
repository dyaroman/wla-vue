import type { ColumnsConfig } from '@/types/columns.types.ts'

export interface WebsitesData {
  columns: ColumnsConfig
  commit: string
  env: string
  repoPath: string
  timestamp: string
  websites: Website[]
}

export interface Website {
  address1: string | 'no_data'
  address2: string | 'no_data'
  altForm: string | 'no_data'
  altFormLeadType: number | string | 'no_data'
  altFormPrimaryColor: string | 'no_data'
  altFormTheme: string | 'no_data'
  campaignId: number | 'no_data'
  campaignUid: string | 'no_data'
  checkbox: string | 'no_data' // todo: why is returns?
  companyName: string | 'no_data'
  effectiveDate: string | 'no_data'
  email: string | 'no_data'
  emailInfo: string | 'no_data'
  emailLegal: string | 'no_data'
  facebookVerification: string | 'no_data'
  favicon: string | 'no_data'
  forms: { [key: string]: Pages }
  gtmKey: string | 'no_data'
  host: string | 'no_data'
  index: string | 'no_data' // todo why is returns?
  lastModifiedTermsOfUse: string | 'no_data'
  mainForm: string | 'no_data'
  mainFormEs: string | 'no_data'
  mainFormEsLeadType: number | 'no_data'
  mainFormEsPrimaryColor: string | 'no_data'
  mainFormEsTheme: string | 'no_data'
  mainFormLeadType: number | 'no_data'
  mainFormPrimaryColor: string | 'no_data'
  mainFormTheme: string | 'no_data'
  ogImage: string[]
  owner: string | 'no_data'
  pages: string[]
  phoneNumber: string | 'no_data'
  rootRedirect: string | 'no_data'
  template: string | 'no_data'
  vmGroup: string | 'no_data'
  website: string
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
