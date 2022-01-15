// Import React dependencies.
import React, { useCallback, useEffect, useMemo, useState } from 'react'
// Import the Slate editor factory.
import { createEditor, Descendant } from 'slate'
// Import the Slate components and React plugin.
import { Slate, Editable, RenderLeafProps, withReact } from 'slate-react'
// Import the core Slate-Yjs binding
import {
  withCursors,
  withYjs,
  withYHistory,
  slateNodesToInsertDelta,
  YjsEditor
} from '@slate-yjs/core'
// Import Yjs
import * as Y from 'yjs'
// Import web socket stuff
import { WebsocketProvider } from 'y-websocket'
// Random utils
import randomColor from 'randomcolor'
// Import local types
import { CursorData } from 'types/CustomSlateTypes'
import { RemoteCursorOverlay } from 'RemoteCursorOverlay'

const WEBSOCKET_ENDPOINT = 'ws://localhost:1234'

// Initial value when setting up the state
const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.', styleId: 'default' }],
  },
]

interface ClientProps {
  name: string;
  id: string;
  slug: string;
}

const App: React.FC<ClientProps> = ({ name, id, slug }) => {
  const [value, setValue] = useState<Descendant[]>([]);
  const color = useMemo(
    () =>
      randomColor({
        luminosity: "dark",
        format: "rgba",
        alpha: 1,
      }),
    []
  );

  // Create the Yjs doc and fetch if it's available from the server
  const [sharedTypeContent, sharedTypeStyles, provider] = useMemo(() => {
    const doc = new Y.Doc();
    const sharedTypeContent = doc.get('content', Y.XmlText) as Y.XmlText;
    const sharedTypeStyles = doc.getMap('styles');
    const provider = new WebsocketProvider(WEBSOCKET_ENDPOINT, slug, doc, {
      connect: false,
    });

    return [sharedTypeContent, sharedTypeStyles, provider];
  }, [id]);

  // Setup the binding
  const editor = useMemo(() => {
    const cursorData: CursorData = {
      color: color,
      name: name,
    };

    return withReact(
      withYHistory(
        withCursors(withYjs(createEditor(), sharedTypeContent), provider.awareness, {
          data: cursorData,
        })
      )
    );
  }, [provider.awareness, sharedTypeContent]);

  // Disconnect the binding on component unmount in order to free up resources
  useEffect(() => () => YjsEditor.disconnect(editor), [editor]);
  useEffect(() => {
    /*provider.on("status", ({ status }: { status: string }) => {
      setOnlineState(status === "connected");
    });*/

    provider.awareness.setLocalState({
      alphaColor: color.slice(0, -2) + "0.2)",
      color,
      name,
    });

    provider.on("sync", (isSynced: boolean) => {
      if (isSynced && sharedTypeContent.length === 0) {
        const insertDelta = slateNodesToInsertDelta(initialValue);
        sharedTypeContent.applyDelta(insertDelta);
      }
    });

    provider.connect();

    return () => {
      provider.disconnect();
    };
  }, [provider]);

  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const renderElement = (props: any) => <Element {...props} />;

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={setValue}
    >
      <RemoteCursorOverlay className="flex justify-center my-32 mx-10">
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
      </RemoteCursorOverlay>
    </Slate>
  )
}

const Element: React.FC<any> = ({ attributes, children, element }) => {
  switch (element.type) {
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  return (
    <span
      {...attributes}
/*      style={
        {
          position: "relative",
          //backgroundColor: data?.alphaColor,
        } as any
      }*/
    >
      {children}
    </span>
  );
};

export default App;
