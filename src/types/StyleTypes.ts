
export type Color = {
  r: number
  g: number
  b: number
  a: number
}

export type ScriptLevel = 'NORMAL' | 'SUBSCRIPT' | 'SUPERSCRIPT' | 'LOW_SUPERSCRIPT' | 'HIGH_SUBSCRIPT'

export type UnderlineStyle = {
  color: Color
  lineStyle: 'SINGLE' | 'DOUBLE' | 'ERROR' | 'SQUIGGLE'
}

export type StrikeThroughStyle = {
  color: Color
}

// A CharacterStyle can override individual properties of a ParagraphStyle
export type CharacterStyle = {
  fontName?: string
  fontSize?: number
  bold?: boolean
  italic?: boolean
  scriptLevel?: ScriptLevel
  fgColor?: Color
  bgColor?: Color
  underlineStyle?: UnderlineStyle
  strikeThroughStyle?: StrikeThroughStyle
  capsStyle?: 'REGULAR' | 'ALL_CAPS' | 'SMALL_CAPS'
  language?: string
}

export type ParagraphStyle = CharacterStyle & {
  parent?: string

  alignment?: 'LEFT' | 'RIGHT' | 'CENTER' | 'JUSTIFY'

  leftIndent?: number | string
  firstLineIndent?: number | string
  rightIndent?: number | string
  spaceBefore?: number | string
  lineHeight?: number | string
}

export function styleContains(style: CharacterStyle | undefined, test: CharacterStyle): boolean {
  if (!style) {
    return false;
  }
  if (test.fontName && (test.fontName !== style.fontName)) {
    return false
  }
  if (test.fontSize && (test.fontSize !== style.fontSize)) {
    return false
  }
  if (test.bold && (test.bold !== style.bold)) {
    return false
  }
  if (test.italic && (test.italic !== style.italic)) {
    return false
  }
  if (test.scriptLevel && (test.scriptLevel !== style.scriptLevel)) {
    return false
  }
  if (test.fgColor && (test.fgColor !== style.fgColor)) {
    return false
  }
  if (test.bgColor && (test.bgColor !== style.bgColor)) {
    return false
  }
  if (test.underlineStyle && (test.underlineStyle !== style.underlineStyle)) {
    return false
  }
  if (test.strikeThroughStyle && (test.strikeThroughStyle !== style.strikeThroughStyle)) {
    return false
  }
  if (test.capsStyle && (test.capsStyle !== style.capsStyle)) {
    return false
  }
  if (test.language && (test.language !== style.language)) {
    return false
  }

  return true
}

export function subtractStyle(style: CharacterStyle, from: CharacterStyle): CharacterStyle | undefined {
  const result: CharacterStyle = {}
  if (style.fontName === undefined && from.fontName !== undefined) {
    result.fontName = from.fontName
  }
  if (style.fontSize === undefined && from.fontSize !== undefined) {
    result.fontSize = from.fontSize
  }
  if (style.bold === undefined && from.bold !== undefined) {
    result.bold = from.bold
  }
  if (style.italic === undefined && from.italic !== undefined) {
    result.italic = from.italic
  }
  if (style.scriptLevel === undefined && from.scriptLevel !== undefined) {
    result.scriptLevel = from.scriptLevel
  }
  if (style.fgColor === undefined && from.fgColor !== undefined) {
    result.fgColor = from.fgColor
  }
  if (style.bgColor === undefined && from.bgColor !== undefined) {
    result.bgColor = from.bgColor
  }
  if (style.underlineStyle === undefined && from.underlineStyle !== undefined) {
    result.underlineStyle = from.underlineStyle
  }
  if (style.strikeThroughStyle === undefined && from.strikeThroughStyle !== undefined) {
    result.strikeThroughStyle = from.strikeThroughStyle
  }
  if (style.capsStyle === undefined && from.capsStyle !== undefined) {
    result.capsStyle = from.capsStyle
  }
  if (style.language === undefined && from.language !== undefined) {
    result.language = from.language
  }

  if (result === {}) {
    return undefined
  }
  return result
}

export function validateParagraphStyle(style: any): boolean {
  // Currently, styles may be completely empty objects again.
  return true
}
