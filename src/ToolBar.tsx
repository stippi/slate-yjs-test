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
  height: string
}>;

export const ToolBar = ({height, children}: ToolBarProps) => {
  return (
    <div
      style={{
        paddingLeft: '50px',
        paddingRight: '50px',
        paddingTop: '10px',
        paddingBottom: '10px',
        display: 'flex',
        width: '100%',
        height: height,
        alignItems: 'center',
        flexWrap: 'wrap',
        position: 'fixed',
        background: '#e1e1e1',
        zIndex: 1,
        top: 0,
        left: 0,
        borderBottom: '1px solid gray',
        boxShadow: '0 1px 5px rgba(0,0,0,.2)',
      }}
    >
      {children}
    </div>
  )
}
