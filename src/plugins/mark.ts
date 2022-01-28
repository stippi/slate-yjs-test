import { Editor } from "slate";
import { CharacterStyle, styleContains, subtractStyle } from "types/StyleTypes";

/**
 * Toggles a given CharacterStyle as a mark for the currently selected range in the passed editor.
 *
 * @param editor The editor to work on
 * @param style The CharacterStyle to activate or deactivate.
 *              If the properties of this style are all included in the current style, they will be removed.
 *              If they are not included, or only partially included, they will be added.
 */
export const toggleMark = (
  editor: Editor,
  style: CharacterStyle
): void => {
  const marks = Editor.marks(editor);
  if (!marks || !marks.style) {
    Editor.addMark(editor, 'style', style)
    return
  }

  if (styleContains(marks.style, style)) {
    const newStyle = subtractStyle(marks.style, style)
    if (newStyle === undefined) {
      Editor.removeMark(editor, 'style')
    } else {
      Editor.addMark(editor, 'style', newStyle)
    }
  } else {
    Editor.addMark(editor, 'style', { ...marks.style, ...style })
  }
}

/**
 * Returns whether a given CharacterStyle is active for the currently selected range in the passed editor.
 *
 * @param editor The editor to work on
 * @param style A CharacterStyle to compare with the active style properties.
 */
export const isMarkActive = (
  editor: Editor,
  style: CharacterStyle
): boolean => {
  const marks = Editor.marks(editor);
  return styleContains(marks?.style, style);
};

/**
 * Toggles a given format type as a mark for the given range in the passed editor.
 *
 * @param editor The editor to work on
 * @param range The range to select
 * @param format The format to apply
 
export const setMarkForRange = (
  editor: Editor,
  range: Range,
  characterStyleId: number
): void => {
  Transforms.select(editor, range);
  toggleMark(editor, characterStyleId);
  // TODO: Clarify if the initial range should be reconstructed
};*/
