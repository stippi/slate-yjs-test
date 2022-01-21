
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

// All style properties of a paragraph must be defined.
export type ParagraphStyle = {
  fontName: string
  fontSize: number
  bold?: boolean
  italic?: boolean
  scriptLevel?: ScriptLevel
  fgColor?: Color
  bgColor?: Color
  underlineStyle?: UnderlineStyle
  strikeThroughStyle?: StrikeThroughStyle
  capsStyle: 'REGULAR' | 'ALL_CAPS' | 'SMALL_CAPS'
  language?: string
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

export function validateParagraphStyle(style: any): boolean {
  return style.fontName && style.fontSize
}
