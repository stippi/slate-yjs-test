// Import React dependencies.
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
// Import the Slate editor factory.
import {createEditor, Editor, Descendant, Node, Transforms, Range} from 'slate'
// Import the Slate components and React plugin.
import {Slate, Editable, RenderLeafProps, withReact, ReactEditor} from 'slate-react'
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
import {Icon, IconButton, Portal} from './Components'
import {CursorData, StyleMap, SharedStyleMap, CustomEditor, Paper, Paragraph} from 'types/CustomSlateTypes'
import { CharacterStyle, ParagraphStyle, validateParagraphStyle } from 'types/StyleTypes'
import { AutoScaling } from './AutoScaling'
import { toDomMargins, toDomStyle } from './dqToDomStyle'
import { RemoteCursorOverlay } from 'RemoteCursorOverlay'
import { PaperProvider } from './PaperContext'
import { StylesProvider, useStyles } from './StylesContext'
import { ScriptStyles } from './scriptStyles'
import { sampleDocument } from './sampleDocument'
import { BlockButton, MarkButton, ToolBar } from './ToolBar'
import { withScript } from './plugins/withScript'
import { withSmartType } from './plugins/withSmartType'

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
    bottom: 1.0
  }
}

interface ClientProps {
  name: string;
  id: string;
  slug: string;
}

const App: React.FC<ClientProps> = ({ name, id, slug }) => {
  const ref = useRef<HTMLDivElement | null>()
  const [value, setValue] = useState<Descendant[]>([]);
  const [styles, setStyles] = useState<StyleMap>(initialStyles);
  const [paper, setPaper] = useState<Paper>(usLetter);

  // state for handling suggestions (smart-type)
  const [target, setTarget] = useState<Range | null>()
  const [index, setIndex] = useState(0)
  const [search, setSearch] = useState('')

  // TODO: Dynamic
  const SUGGESTIONS = ['Hans', 'Manfred', 'Henrike']
  const suggestions = SUGGESTIONS.filter(c => {
    const cLower = c.toLowerCase()
    const searchLower = search.toLowerCase()
    return cLower.startsWith(searchLower) && cLower !== searchLower
  }).slice(0, 10)

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
        withCursors(
          withSmartType(
            withScript(
              withYjs(createEditor(), sharedTypeContent)
            )
          ), provider.awareness, {
            data: cursorData,
          }
        )
      )
    );
  }, [provider.awareness, sharedTypeContent]);

  const onKeyDown = useCallback(
    event => {
      const styleId = 'character'

      if (target && suggestions.length) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault()
            const prevIndex = index >= suggestions.length - 1 ? 0 : index + 1
            setIndex(prevIndex)
            break
          case 'ArrowUp':
            event.preventDefault()
            const nextIndex = index <= 0 ? suggestions.length - 1 : index - 1
            setIndex(nextIndex)
            break
          case 'Tab':
          case 'Enter':
            event.preventDefault()
            let range = target
            const {anchor, focus} = target
            const before = Editor.before(editor, anchor)
            if (before) {
              range = {anchor: before, focus}
            }
            insertSmartType(editor, range, styleId, suggestions[index])
            setTarget(null)
            break
          case 'Escape':
            event.preventDefault()
            setTarget(null)
            break
          }
        }
      },
      [index, search, target]
    )

  useEffect(() => {
    if (target) {
      const element = ref.current
      if (element) {
        const domRange = ReactEditor.toDOMRange(editor, target)
        const rect = domRange.getBoundingClientRect()
        element.style.top = `${rect.top + window.scrollY + 24}px`
        element.style.left = `${rect.left + window.scrollX}px`
      }
    }
  }, [editor, index, search, target])

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
  const toolBarHeight = '50px'

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={value => {
        setValue(value)
        const { selection } = editor

        if (selection && Range.isCollapsed(selection)) {
          const [match] = Editor.nodes(editor, {
            match: (n) => Editor.isBlock(editor, n) && n.styleId === 'character',
          });

          if (!!match) {
            const path = match[1]
            const range = Editor.range(editor, path)
            setTarget(range)
            setSearch(Node.string(match[0]))
            setIndex(0)
            return
          }
        }

        setTarget(null)
      }}
    >
      <ToolBar height={toolBarHeight}>
        <StyleButton
          icon="refresh"
          sharedTypeStyles={sharedTypeStyles}
          onMouseDown={(event: React.MouseEvent) => {
            event.preventDefault()
            setScriptStyles(sharedTypeStyles)
            applyUsLetter(sharedTypeStyles)
          }}
        />
        <BlockButton styleId="primary-heading" icon="movie_creation" />
        <BlockButton styleId="action" icon="format_align_left" />
        <BlockButton styleId="character" icon="person" />
        <BlockButton styleId="parenthetical" icon="chair" />
        <BlockButton styleId="dialog" icon="chat" />

        <MarkButton style={{bold: true}} icon="format_bold" />
        <MarkButton style={{italic: true}} icon="format_italic" />
        <MarkButton style={{underlineStyle: {color: {r: 0, g: 0, b: 0, a: 1}, lineStyle: 'SINGLE'}}} icon="format_underlined" />
      </ToolBar>
      <AutoScaling
        style={{
          marginTop: toolBarHeight,
        }}
        childWidth={documentWidth}
        maxChildWidth={1.5 * documentWidth}
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
                  borderLeft: '1px solid darkgray',
                  borderRight: '1px solid darkgray',
                  borderBottom: '1px solid darkgray',
                  boxShadow: '0 1px 3px rgba(0,0,0,.1)',
                  width: `${documentWidth}px`,
                  boxSizing: 'border-box',
                  paddingTop: `${paper.margins.top}in`,
                  paddingLeft: `${paper.margins.left}in`,
                  paddingRight: `${paper.margins.right}in`,
                  paddingBottom: `${paper.margins.bottom}in`,
                }}
                onKeyDown={onKeyDown}
              />
            </RemoteCursorOverlay>
          </StylesProvider>
        </PaperProvider>
      </AutoScaling>
      {target && suggestions.length > 0 && (
        <Portal>
          <div
            // @ts-ignore
            ref={ref}
            style={{
              top: '-9999px',
              left: '-9999px',
              position: 'absolute',
              zIndex: 1,
              padding: '3px',
              background: 'white',
              borderRadius: '4px',
              boxShadow: '0 1px 5px rgba(0,0,0,.2)',
            }}
            data-cy="smart-type-portal"
          >
            {suggestions.map((suggestion, i) => (
              <div
                key={suggestion}
                style={{
                  padding: '1px 3px',
                  borderRadius: '3px',
                  background: i === index ? '#B4D5FF' : 'transparent',
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </Portal>
      )}
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

const insertSmartType = (editor: Editor, range: Range, styleId: string, text: string) => {
  Transforms.select(editor, range)
  const paragraphs = [
    {
      styleId: styleId,
      children: [{ text: text }],
    }
  ]
  let distance = 1
  const after = Editor.after(editor, range.focus)
  const nodeAfter = after && Editor.node(editor, after, {depth: 1})
  if (!nodeAfter || !Editor.isBlock(editor, nodeAfter[0]) || nodeAfter[0].styleId !== 'dialog') {
    paragraphs.push({
      styleId: 'dialog',
      children: [{ text: '' }],
    })
    distance = -1
  }
  Transforms.insertNodes(editor, paragraphs)
  Transforms.move(editor, { distance })
}

export default App;
