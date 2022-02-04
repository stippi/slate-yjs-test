// Import React dependencies.
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import { v4 as uuid } from 'uuid';
import { name } from 'faker'
import Client from './Client'

const id = uuid()

const App: React.FC = () => {
  const [slug, setSlug] = useState('');
  const [slugSubmitted, submitSlug] = useState('');

  if (slugSubmitted) {
    return (
      <Client
        id={id}
        name={`${name.firstName()} ${name.lastName()}`}
        slug={slugSubmitted}/>
    )
  } else {
    return (
      <div>
        <div>Enter document slug: </div>
        <input
          type="text"
          value={slug}
          onChange={(event) => {setSlug(event.target.value)}}
        ></input>
        <button onClick={() => {submitSlug(slug)}}>Open</button>
      </div>
    )
  }
}

export default App;
