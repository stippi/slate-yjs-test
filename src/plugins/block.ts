import { Editor, Element, Transforms } from "slate";

export function setBlock(editor: Editor, styleId: Element['styleId']) {
  Transforms.setNodes(editor, { styleId });
}

export const isBlockActive = (editor: Editor, styleId: Element['styleId']): boolean => {
  const [match] = Editor.nodes(editor, {
    match: (n) => Editor.isBlock(editor, n) && n.styleId === styleId,
  });

  return !!match;
};
