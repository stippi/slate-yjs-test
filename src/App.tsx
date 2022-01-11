// Import React dependencies.
import React, { useMemo, useState } from 'react'
// Import the Slate editor factory.
import { createEditor, Descendant } from 'slate'
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'
// Import the core Slate-Yjs binding
import { withYjs, slateNodesToInsertDelta, YjsEditor } from '@slate-yjs/core'
// Import Yjs
import * as Y from 'yjs'

// Initial value when setting up the state
const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.', styleId: 'default' }],
  },
]

const App: React.FC = () => {
  // Create a Yjs document and get the shared type
  const sharedType = useMemo(() => {
    const yDoc = new Y.Doc()
    const sharedType = yDoc.get('content', Y.XmlText)

    sharedType.applyDelta(slateNodesToInsertDelta(initialValue))

    return sharedType
  }, [])

  const editor = useMemo(() => withReact(createEditor()), [])

  const [value, setValue] = useState<Descendant[]>(initialValue)

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={setValue}
    >
      <Editable />
    </Slate>
  )
}

export default App;
