// Import React dependencies.
import React, { useCallback, useEffect, useMemo, useState } from 'react'
// Import the Slate editor factory.
import { createEditor, Editor, Descendant, Transforms } from 'slate'
// Import the Slate components and React plugin.
import {Slate, Editable, RenderLeafProps, withReact } from 'slate-react'
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
import { Icon, IconButton } from './Components'
import {CursorData, StyleMap, SharedStyleMap, CustomEditor, Paper} from 'types/CustomSlateTypes'
import { CharacterStyle, ParagraphStyle, validateParagraphStyle } from 'types/StyleTypes'
import { AutoScaling } from './AutoScaling'
import { toDomMargins, toDomStyle } from './dqToDomStyle'
import { RemoteCursorOverlay } from 'RemoteCursorOverlay'
import { PaperProvider } from './PaperContext'
import { StylesProvider, useStyles } from './StylesContext'
import { ScriptStyles } from './scriptStyles'
import { sampleDocument } from './sampleDocument'
import { ToolBar } from './ToolBar'

const WEBSOCKET_ENDPOINT = 'ws://localhost:1234'

// Initial value when setting up the state
const initialValue = sampleDocument

const initialStyle: ParagraphStyle = {
  fontName: 'Courier',
  fontSize: 15,
  fgColor: { r: 0, g: 0, b: 0, a: 1 },
  bgColor: { r: 1, g: 1, b: 1, a: 1 },
  capsStyle: 'REGULAR'
}

const initialStyles: StyleMap = {
  'default': initialStyle
}

const usLetter: Paper = {
  width: 8.5,
  height: 11,
  margins: {
    left: 1.5,
    right: 1.0,
    top: 0.5,
    bottom: 0.5
  }
}

interface ClientProps {
  name: string;
  id: string;
  slug: string;
}

const App: React.FC<ClientProps> = ({ name, id, slug }) => {
  const [value, setValue] = useState<Descendant[]>([]);
  const [styles, setStyles] = useState<StyleMap>(initialStyles);
  const [paper, setPaper] = useState<Paper>(usLetter);
  console.log("Paper: " + JSON.stringify(paper))

  const color = useMemo(
    () =>
      randomColor({
        luminosity: "dark",
        format: "rgba",
        alpha: 0.8,
      }),
    []
  );

  // Create the Yjs doc and fetch if it's available from the server
  const [sharedTypeContent, sharedTypeStyles, sharedTypePaper, provider] = useMemo(() => {
    const doc = new Y.Doc();
    const sharedTypeContent = doc.get('content', Y.XmlText) as Y.XmlText;
    const sharedTypeStyles = doc.getMap('styles') as SharedStyleMap;
    const sharedTypePaper = doc.getMap('paper') as Y.Map<any>;
    const provider = new WebsocketProvider(WEBSOCKET_ENDPOINT, slug, doc, {
      connect: false,
    });

    return [sharedTypeContent, sharedTypeStyles, sharedTypePaper, provider];
  }, [slug]);

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

  useEffect(() => {
    const onStyleChange = function() {
      setStyles(sharedTypeStyles.toJSON() as StyleMap);
    };
    const onPaperChange = function() {
      setPaper(sharedTypePaper.toJSON() as Paper);
    };
    sharedTypeStyles.observe(onStyleChange);
    sharedTypePaper.observeDeep(onPaperChange);
    return () => {
      sharedTypeStyles.unobserve(onStyleChange);
      sharedTypePaper.unobserveDeep(onPaperChange);
    };
  }, [sharedTypeStyles, sharedTypePaper]);

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
      if (isSynced) {
        if (sharedTypeContent.length === 0) {
          const insertDelta = slateNodesToInsertDelta(initialValue);
          sharedTypeContent.applyDelta(insertDelta);
        }
        if (sharedTypeStyles.size === 0) {
          sharedTypeStyles.set('default', initialStyle);
          console.log("inserted default style into shared map: " + JSON.stringify(initialStyle));
        } else if (!validateParagraphStyle(sharedTypeStyles.get('default'))) {
          sharedTypeStyles.set('default', initialStyle);
          console.log("replaced invalid default style in shared map: " + JSON.stringify(initialStyle));
        } else {
          console.log("default style in shared map: " + JSON.stringify(sharedTypeStyles.get('default')));
        }
        if (sharedTypePaper.size === 0) {
          applyUsLetter(sharedTypePaper)
          console.log("inserted default paper into shared map: " + JSON.stringify(usLetter));
        }
      }
    });

    provider.connect();

    return () => {
      provider.disconnect();
    };
  }, [color, name, sharedTypeContent, sharedTypeStyles, provider]);

  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const renderElement = (props: any) => <Element {...props} />;

  // Convert 8.5 inch paper width to "reference pixels" assuming 96dpi.
  // See https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units
  const documentWidth = paper.width * 96

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={setValue}
    >
      <ToolBar />
      <StyleButton
        icon="+"
        sharedTypeStyles={sharedTypeStyles}
        onMouseDown={increaseFontSize}
      />
      <StyleButton
        icon="-"
        sharedTypeStyles={sharedTypeStyles}
        onMouseDown={decreaseFontSize}
      />
      <StyleButton
        icon="reset"
        sharedTypeStyles={sharedTypeStyles}
        onMouseDown={(event: React.MouseEvent) => {
          event.preventDefault()
          setScriptStyles(sharedTypeStyles)
          applyUsLetter(sharedTypePaper)
        }}
      />
      <AutoScaling
        childWidth={documentWidth}
        maxChildWidth={2 * documentWidth}
        margin={50}
      >
        <PaperProvider paper={paper}>
          <StylesProvider styles={styles}>
            <RemoteCursorOverlay>
              <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Write something ..."
                style={{
                  background: '#ffffff',
                  border: 'none',
                  width: `${documentWidth}px`,
                  paddingTop: `${paper.margins.top}in`,
                  paddingLeft: `${paper.margins.left}in`,
                  paddingRight: `${paper.margins.right}in`,
                }}
                onKeyDown={(event) => {handleKeyDown(event, editor)}}
              />
            </RemoteCursorOverlay>
          </StylesProvider>
        </PaperProvider>
      </AutoScaling>
    </Slate>
  )
}

const Element: React.FC<any> = ({ attributes, children, element }) => {
  const styles = useStyles()
  const pStyle = styles[element.styleId] || initialStyle
  const style = { ...toDomStyle(pStyle), ...toDomMargins(pStyle) }
  switch (element.type) {
    default:
      return (
        <p {...attributes} style={style}>
          {children}
        </p>
      )
  }
};

const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  // console.log("leaf: " + JSON.stringify(leaf) + ", attributes: " + JSON.stringify(attributes));
  const style = toDomStyle(leaf.style as CharacterStyle);
  style.position = "relative";
  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};

const StyleButton: React.FC<any> = ({ icon, sharedTypeStyles, onMouseDown }) => {
  return (
    <IconButton
      onMouseDown={(event: React.MouseEvent) => {onMouseDown(event, sharedTypeStyles)}}
    >
      <Icon className="material-icons">{icon}</Icon>
    </IconButton>
  );
};

const increaseFontSize = function(event: React.MouseEvent, sharedTypeStyles: SharedStyleMap) {
  event.preventDefault();
  const style = sharedTypeStyles.get('default');
  if (style) {
    sharedTypeStyles.set('default', {
      ...style,
      fontSize: style.fontSize + 1
    });
  }
}

const decreaseFontSize = function(event: React.MouseEvent, sharedTypeStyles: SharedStyleMap) {
  event.preventDefault();
  const style = sharedTypeStyles.get('default');
  if (style) {
    sharedTypeStyles.set('default', {
      ...style,
      fontSize: style.fontSize - 1
    });
  }
}

const setScriptStyles = function(sharedTypeStyles: SharedStyleMap) {
  console.log("applying script styles");
  if (sharedTypeStyles.doc instanceof Y.Doc) {
    Y.transact(sharedTypeStyles.doc, function () {
      for (const key in ScriptStyles) {
        console.log("adding " + key + ": " + JSON.stringify(ScriptStyles[key]));
        sharedTypeStyles.set(key, ScriptStyles[key]);
      }
    })
  }
}

const applyUsLetter = function(sharedTypePaper: Y.Map<any>) {
  if (sharedTypePaper.doc instanceof Y.Doc) {
    Y.transact(sharedTypePaper.doc, function () {
      sharedTypePaper.set('width', usLetter.width);
      sharedTypePaper.set('height', usLetter.height);
      const margins = new Y.Map<any>()
      margins.set('left', usLetter.margins.left)
      margins.set('right', usLetter.margins.right)
      margins.set('top', usLetter.margins.top)
      margins.set('bottom', usLetter.margins.bottom)
      sharedTypePaper.set('margins', margins);
    })
  }
}

const handleKeyDown = function(event: React.KeyboardEvent, editor: CustomEditor) {
  if (event.key === 'd' && event.ctrlKey) {
    event.preventDefault()
    Transforms.setNodes(
      editor,
      { styleId: 'dialog' },
      { match: n => Editor.isBlock(editor, n) }
    )
  }
}


export default App;
