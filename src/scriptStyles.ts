import { StyleMap } from './types/CustomSlateTypes'

const defaultFontName = 'Courier'
const defaultFontSize = 12

export const ScriptStyles: StyleMap = {
  'primary-heading': {
    fontName: defaultFontName,
    fontSize: defaultFontSize,
    capsStyle: 'ALL_CAPS',
    spaceBefore: defaultFontSize * 2,
    lineHeight: '100%',
  },
  'action': {
    fontName: defaultFontName,
    fontSize: defaultFontSize,
    spaceBefore: defaultFontSize,
    lineHeight: '100%'
  },
  'character': {
    fontName: defaultFontName,
    fontSize: defaultFontSize,
    capsStyle: 'ALL_CAPS',
    spaceBefore: defaultFontSize,
    leftIndent: '2.0in',
    lineHeight: '100%',
  },
  'parenthetical': {
    fontName: defaultFontName,
    fontSize: defaultFontSize,
    firstLineIndent: '-1ch', // for the leading parenthesis
    leftIndent: '1.5in',
    rightIndent: '2.1in',
    lineHeight: '100%',
  },
  'dialog': {
    fontName: defaultFontName,
    fontSize: defaultFontSize,
    leftIndent: '1.0in',
    rightIndent: '1.6in',
    lineHeight: '100%',
  },
  'transition': {
    alignment: 'RIGHT',
    fontName: defaultFontName,
    fontSize: defaultFontSize,
    capsStyle: 'ALL_CAPS',
    spaceBefore: defaultFontSize,
    leftIndent: '4.1in',
    rightIndent: '0.4in',
    lineHeight: '100%',
  }
}
