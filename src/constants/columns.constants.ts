export const COLUMNS_CONSTANTS = {
  QUERY_PARAMS: {
    VISIBLE_COLUMNS: 'visibleColumns',
  },
  PRESETS: {
    ALL: 'all',
    NONE: 'none',
  },
} as const

export type ColumnPreset =
  (typeof COLUMNS_CONSTANTS.PRESETS)[keyof typeof COLUMNS_CONSTANTS.PRESETS]
