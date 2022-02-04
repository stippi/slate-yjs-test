/**
 * Based on withMarkdown from slate-yjs example.
 */

import { Editor, Element, Point, Range, Text, Transforms } from 'slate';

export function withScript(editor: Editor) {
  const { insertBreak } = editor;

  editor.insertBreak = () => {
    const { selection } = editor;

    if (selection) {
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n),
      });
      const [previous, path] = block ? [block[0], block[1]] : [{}, []];
      const end = Editor.end(editor, path);
      const wasSelectionAtEnd = Point.equals(end, Range.end(selection));

      Transforms.splitNodes(editor, { always: true });

      let nextStyleId = 'action'
      if (Editor.isBlock(editor, previous)) {
        console.log('previous: ' + JSON.stringify(previous))
        switch (previous.styleId) {
        case 'character':
          nextStyleId = 'dialog'
          break
        case 'parenthetical':
          nextStyleId = 'dialog'
          break
        case 'dialog':
          nextStyleId = 'character'
          break
        case 'primary-heading':
          nextStyleId = 'action'
          break
        }
      }

      if (wasSelectionAtEnd) {
        Transforms.unwrapNodes(editor, {
          match: (n) => Editor.isInline(editor, n),
          mode: 'all',
        });
        Transforms.setNodes(
          editor,
          { styleId: nextStyleId },
          { match: (n) => Editor.isBlock(editor, n) }
        );
        const marks = Editor.marks(editor) ?? {};
        Transforms.unsetNodes(editor, Object.keys(marks), {
          match: Text.isText,
        });
      }
    }
  };

  return editor;
}
