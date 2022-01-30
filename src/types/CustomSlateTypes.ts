// These types are for an Editor with `CursorEditor`, `YjsEditor` and `YHistoryEditor` mixed in
import { ReactEditor } from 'slate-react'
import { CursorEditor, YHistoryEditor, YjsEditor } from '@slate-yjs/core'
import { Map } from 'yjs'
import { CharacterStyle, ParagraphStyle } from './StyleTypes'

export type Paragraph = {
  styleId: string
  children: CustomText[]
}

type CustomText = {
  text: string
  style?: CharacterStyle
}

export type CursorData = {
  name: string
  color: string
}

export type StyleMap = Record<string, ParagraphStyle>;

export type SharedStyleMap = Map<ParagraphStyle>;

export type Margins = {
  left: number
  right: number
  top: number
  bottom: number
}

export type Paper = {
  width: number
  height: number
  margins: Margins
}

export type CustomEditor = ReactEditor &
  YjsEditor &
  YHistoryEditor &
  CursorEditor<CursorData>;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: Paragraph
    Text: CustomText
  }
}
