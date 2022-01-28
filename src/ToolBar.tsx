import React, { PropsWithChildren } from 'react'
import { useSlate } from 'slate-react'
import { useStyles } from './StylesContext'
import { Icon, IconButton } from './Components'
import { CharacterStyle } from './types/StyleTypes'
import { toggleMark, isMarkActive } from './plugins/mark'

type MarkButtonProps = {
  style: CharacterStyle
  icon: string
}

const MarkButton: React.FC<MarkButtonProps> = ({ style, icon }) => {
  const editor = useSlate();
  return (
    <IconButton
      active={isMarkActive(editor, style)}
      onMouseDown={(event: React.MouseEvent) => {
        event.preventDefault();
        toggleMark(editor, style);
      }}
    >
      <Icon className="material-icons">{icon}</Icon>
    </IconButton>
  );
};

type ToolBarProps = PropsWithChildren<{
}>;

export const ToolBar = ({}: ToolBarProps) => {
  return (
    <div
      style={{

      }}
    >
      <MarkButton style={{bold: true}} icon="format_bold" />
      <MarkButton style={{italic: true}} icon="format_italic" />
      <MarkButton style={{underlineStyle: {color: {r: 0, g: 0, b: 0, a: 1}, lineStyle: 'SINGLE'}}} icon="format_underlined" />
    </div>
  )
}
