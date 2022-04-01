import { StyleMap } from './types/CustomSlateTypes'

export const defaultFontName = 'Courier'
export const defaultFontSize = 12

export const ScriptStyles: StyleMap = {
  'base': {
    fontName: defaultFontName,
    fontSize: defaultFontSize,
    lineHeight: '100%',
  },
  'primary heading': {
    parent: 'base',
    capsStyle: 'ALL_CAPS',
    spaceBefore: defaultFontSize * 2,
  },
  'action': {
    parent: 'base',
    spaceBefore: defaultFontSize,
  },
  'character': {
    parent: 'base',
    capsStyle: 'ALL_CAPS',
    spaceBefore: defaultFontSize,
    leftIndent: '2.0in',
  },
  'parenthetical': {
    parent: 'base',
    firstLineIndent: '-1ch', // for the leading parenthesis
    leftIndent: '1.5in',
    rightIndent: '2.1in',
  },
  'dialog': {
    parent: 'base',
    leftIndent: '1.0in',
    rightIndent: '1.6in',
  },
  'transition': {
    parent: 'base',
    alignment: 'RIGHT',
    capsStyle: 'ALL_CAPS',
    spaceBefore: defaultFontSize,
    leftIndent: '4.1in',
    rightIndent: '0.4in',
  }
}
