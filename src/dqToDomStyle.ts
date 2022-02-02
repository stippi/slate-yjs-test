import { CharacterStyle, ParagraphStyle } from 'types/StyleTypes'

function toLength(length: string | number): string {
    if (typeof length === 'string') {
      return length
    } else {
      return `${length}pt`
    }
}

export function toDomMargins(style: ParagraphStyle): any {
  // see https://www.w3schools.com/jsref/dom_obj_style.asp
  let domStyle: any = {}
  if (!style) {
    return domStyle
  }
  if (style.leftIndent) {
    domStyle.paddingLeft = toLength(style.leftIndent)
  }
  if (style.firstLineIndent) {
    domStyle.textIndent = toLength(style.firstLineIndent)
  }
  if (style.rightIndent) {
    domStyle.paddingRight = toLength(style.rightIndent)
  }
  if (style.spaceBefore) {
    domStyle.paddingTop = toLength(style.spaceBefore)
  }
  if (style.lineHeight) {
    domStyle.lineHeight = toLength(style.lineHeight)
  }
  return domStyle
}

export function toDomStyle(style: CharacterStyle | ParagraphStyle): any {
  // see https://www.w3schools.com/jsref/dom_obj_style.asp
  let domStyle: any = {}
  if (!style) {
    return domStyle
  }
  if (style.fontName) {
    domStyle.fontFamily = style.fontName
  }
  if (style.fontSize) {
    domStyle.fontSize = toLength(style.fontSize)
  }
  if (style.fgColor) {
    domStyle.color = style.fgColor
  }
  if (style.bgColor) {
    domStyle.backgroundColor = style.bgColor;
  }
  if (style.bold) {
    domStyle.fontWeight = 'bold';
  }
  if (style.italic) {
    domStyle.fontStyle = 'italic'
  }
  if (style.capsStyle) {
    switch (style.capsStyle) {
      case 'REGULAR':
        domStyle.textTransform = 'none'
        break
      case 'ALL_CAPS':
        domStyle.textTransform = 'uppercase'
        break
      case 'SMALL_CAPS':
        domStyle.fontVariant = 'small-caps'
        break
    }
  }
  if (style.underlineStyle) {
    domStyle.textDecoration = 'underline'
    if (style.underlineStyle.color) {
      domStyle.textDecorationColor = style.underlineStyle.color;
    }
    switch (style.underlineStyle.lineStyle) {
      case 'SINGLE':
        domStyle.textDecorationStyle = 'solid'
        break
      case 'DOUBLE':
        domStyle.textDecorationStyle = 'double'
        break
      case 'ERROR':
        domStyle.textDecorationStyle = 'dashed'
        break
      case 'SQUIGGLE':
        domStyle.textDecorationStyle = 'wavy'
        break
    }
  } else if (style.strikeThroughStyle) {
    domStyle.textDecoration = 'line-through'
    if (style.strikeThroughStyle.color) {
      domStyle.textDecorationColor = style.strikeThroughStyle.color
    }
  }
  return domStyle
}
