import { StyleMap } from './types/CustomSlateTypes'

const defaultFontName = 'Courier'
const defaultFontSize = 15

export const ScriptStyles: StyleMap = {
  'primary-heading': {
    fontName: defaultFontName,
    fontSize: defaultFontSize,
    capsStyle: 'ALL_CAPS'
  },
  'action': {
    fontName: defaultFontName,
    fontSize: defaultFontSize,
    capsStyle: 'REGULAR'
  }
}
