export interface ColumnsConfig {
  address1: ColumnConfig
  address2: ColumnConfig
  altForm: ColumnConfig
  altFormLeadType: ColumnConfig
  altFormPrimaryColor: ColumnConfig
  altFormTheme: ColumnConfig
  campaignId: ColumnConfig
  campaignUid: ColumnConfig
  checkbox: ColumnConfig
  companyName: ColumnConfig
  effectiveDate: ColumnConfig
  email: ColumnConfig
  emailInfo: ColumnConfig
  emailLegal: ColumnConfig
  facebookVerification: ColumnConfig
  favicon: ColumnConfig
  forms: ColumnConfig
  gtmKey: ColumnConfig
  host: ColumnConfig
  index: ColumnConfig
  lastModifiedTermsOfUse: ColumnConfig
  mainForm: ColumnConfig
  mainFormEs: ColumnConfig
  mainFormEsLeadType: ColumnConfig
  mainFormEsPrimaryColor: ColumnConfig
  mainFormEsTheme: ColumnConfig
  mainFormLeadType: ColumnConfig
  mainFormPrimaryColor: ColumnConfig
  mainFormTheme: ColumnConfig
  ocsDefaultRedirect: ColumnConfig
  ogImage: ColumnConfig
  owner: ColumnConfig
  pages: ColumnConfig
  phoneNumber: ColumnConfig
  rootRedirect: ColumnConfig
  tags: ColumnConfig
  template: ColumnConfig
  vmGroup: ColumnConfig
  website: ColumnConfig
}

export interface ColumnConfig {
  renderFilter: boolean
  renderColumn: boolean
  showColumn?: boolean
}

export type ColumnName = keyof ColumnsConfig
