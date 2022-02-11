// Import React dependencies.
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import { v4 as uuid } from 'uuid';
import { name } from 'faker'
import { Button, Input } from './Components'
import Client from './Client'

const id = uuid()

const App: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const slug = urlParams.get('document-slug')

  if (slug) {
    return (
      <Client
        id={id}
        name={`${name.firstName()} ${name.lastName()}`}
        slug={slug}/>
    )
  } else {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          placeContent: 'center',
          gap: '10px',
        }}
      >
        <span>Enter document slug: </span>
        <Input
          id="slug-input"
          type="text"
        ></Input>
        <Button onClick={openSlug}>Open</Button>
      </div>
    )
  }
}

function openSlug() {
  const input = document.getElementById('slug-input') as HTMLInputElement
  if (input && input.value) {
    window.location.href = `/?document-slug=${input.value}`
  }
}

export default App;
