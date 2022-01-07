// These types are for an Editor with `ReactEditor` and `HistoryEditor` mixed in
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

type Document = {
  type: 'document'
  children: Paragraph[]
}

type Paragraph = {
  type: 'paragraph'
  children: CustomText[]
}

type CustomText = {
  text: string
  styleId: string
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: Paragraph
    Text: CustomText
  }
}
