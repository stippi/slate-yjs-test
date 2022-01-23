import { StyleMap } from './types/CustomSlateTypes'

const defaultFontName = 'Courier'
const defaultFontSize = 12

export const ScriptStyles: StyleMap = {
  'primary-heading': {
    fontName: defaultFontName,
    fontSize: defaultFontSize,
    capsStyle: 'ALL_CAPS',
    spaceBefore: defaultFontSize * 2,
  },
  'action': {
    fontName: defaultFontName,
    fontSize: defaultFontSize,
    spaceBefore: defaultFontSize,
  },
  'character': {
    fontName: defaultFontName,
    fontSize: defaultFontSize,
    capsStyle: 'ALL_CAPS',
    spaceBefore: defaultFontSize,
    leftIndent: '2.0in',
  },
  'parenthetical': {
    fontName: defaultFontName,
    fontSize: defaultFontSize,
    firstLineIndent: '-0.1in', // for the leading parenthesis
    leftIndent: '1.5in',
    rightIndent: '2.1in',
  },
  'dialog': {
    fontName: defaultFontName,
    fontSize: defaultFontSize,
    leftIndent: '1.0in',
    rightIndent: '1.6in',
  }
}
