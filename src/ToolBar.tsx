import React, { PropsWithChildren } from 'react'
import { useSlate } from 'slate-react'
import { Icon, IconButton } from './Components'
import { CharacterStyle } from './types/StyleTypes'
import { toggleMark, isMarkActive } from './plugins/mark'
import { setBlock, isBlockActive } from './plugins/block'

type MarkButtonProps = {
  style: CharacterStyle
  icon: string
}

export const MarkButton: React.FC<MarkButtonProps> = ({ style, icon }) => {
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

type BlockButtonProps = {
  styleId: string
  icon: string
}

export const BlockButton: React.FC<BlockButtonProps> = ({ styleId, icon }) => {
  const editor = useSlate();
  return (
    <IconButton
      active={isBlockActive(editor, styleId)}
      onMouseDown={(event: React.MouseEvent) => {
        event.preventDefault();
        setBlock(editor, styleId);
      }}
    >
      <Icon className="material-icons">{icon}</Icon>
    </IconButton>
  );
};

type ToolBarProps = PropsWithChildren<{
}>;

export const ToolBar = ({children}: ToolBarProps) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        flexWrap: 'wrap'
      }}
    >
      {children}
    </div>
  )
}
