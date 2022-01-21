// These types are for an Editor with `CursorEditor`, `YjsEditor` and `YHistoryEditor` mixed in
import { ReactEditor } from 'slate-react'
import { CursorEditor, YHistoryEditor, YjsEditor } from '@slate-yjs/core';
import { Map } from 'yjs'

type Paragraph = {
  styleId: string
  children: CustomText[]
}

type CustomText = {
  text: string
  styleId: string
}

export type CursorData = {
  name: string
  color: string
}

export type CharacterStyle = {
  font: string
  fontSize: number
}

export type StyleMap = Record<string, CharacterStyle>;

export type SharedStyleMap = Map<CharacterStyle>;

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
