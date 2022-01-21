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
import { Icon, IconButton } from './Components'
import { CursorData, StyleMap, SharedStyleMap } from 'types/CustomSlateTypes'
import { CharacterStyle, ParagraphStyle, validateParagraphStyle } from 'types/StyleTypes'
import { RemoteCursorOverlay } from 'RemoteCursorOverlay'
import { StylesProvider, useStyles } from './StylesContext';

const WEBSOCKET_ENDPOINT = 'ws://localhost:1234'

// Initial value when setting up the state
const initialValue: Descendant[] = [
  {
    styleId: 'default',
    children: [
      {
        text: 'A line of text in a paragraph. '
      },
      {
        text: 'Another line with some styling.',
        style: {
          bold: true,
          italic: true
        }
      }
    ],
  },
]

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

interface ClientProps {
  name: string;
  id: string;
  slug: string;
}

const App: React.FC<ClientProps> = ({ name, id, slug }) => {
  const [value, setValue] = useState<Descendant[]>([]);
  const [styles, setStyles] = useState<StyleMap>(initialStyles);

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
  const [sharedTypeContent, sharedTypeStyles, provider] = useMemo(() => {
    const doc = new Y.Doc();
    const sharedTypeContent = doc.get('content', Y.XmlText) as Y.XmlText;
    const sharedTypeStyles = doc.getMap('styles') as SharedStyleMap;
    const provider = new WebsocketProvider(WEBSOCKET_ENDPOINT, slug, doc, {
      connect: false,
    });

    return [sharedTypeContent, sharedTypeStyles, provider];
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
    sharedTypeStyles.observe(onStyleChange);
    return () => {
      sharedTypeStyles.unobserve(onStyleChange);
    };
  }, [sharedTypeStyles]);

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
      }
    });

    provider.connect();

    return () => {
      provider.disconnect();
    };
  }, [color, name, sharedTypeContent, sharedTypeStyles, provider]);

  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const renderElement = (props: any) => <Element {...props} />;

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={setValue}
    >
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
      <StylesProvider styles={styles}>
        <RemoteCursorOverlay className="flex justify-center my-32 mx-10">
          <Editable
            className="max-w-4xl w-full flex-col break-words"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Write something ..."
          />
        </RemoteCursorOverlay>
      </StylesProvider>
    </Slate>
  )
}

const Element: React.FC<any> = ({ attributes, children, element }) => {
  const styles = useStyles();
  const style = toDomStyle(styles[element.styleId] || initialStyle);
  switch (element.type) {
    default:
      return (
        <p {...attributes} style={style}>
          {children}
        </p>
      );
  }
};

const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  // console.log("leaf: " + JSON.stringify(leaf) + ", attributes: " + JSON.stringify(attributes));
  const style = toDomStyle(leaf.style as CharacterStyle);
  style.position = "relative";
  return (
    <span
      {...attributes}
      style={style}
    >
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

function toDomStyle(style: CharacterStyle | ParagraphStyle): any {
  // see https://www.w3schools.com/jsref/dom_obj_style.asp
  let domStyle: any = {};
  if (!style) {
    return domStyle;
  }
  if (style.fontName) {
    domStyle.fontFamily = style.fontName
  }
  if (style.fontSize) {
    domStyle.fontSize = style.fontSize
  }
  if (style.fgColor) {
    domStyle.color = style.fgColor
  }
  if (style.bgColor) {
    domStyle.backgroundColor = style.bgColor;
  }
  if (style.bold) {
    domStyle.fontWeight = 'bold';
  }
  if (style.italic) {
    domStyle.fontStyle = 'italic'
  }
  if (style.underlineStyle) {
    domStyle.textDecoration = 'underline'
    if (style.underlineStyle.color) {
      domStyle.textDecorationColor = style.underlineStyle.color;
    }
    switch (style.underlineStyle.lineStyle) {
      case 'SINGLE':
        domStyle.textDecorationColor = 'solid';
        break;
      case 'DOUBLE':
        domStyle.textDecorationColor = 'double';
        break;
      case 'ERROR':
        domStyle.textDecorationColor = 'dashed';
        break;
      case 'SQUIGGLE':
        domStyle.textDecorationColor = 'wavy';
        break;
    }
  } else if (style.strikeThroughStyle) {
    domStyle.textDecoration = 'line-through'
    if (style.strikeThroughStyle.color) {
      domStyle.textDecorationColor = style.strikeThroughStyle.color;
    }
  }
  return domStyle;
}

export default App;
