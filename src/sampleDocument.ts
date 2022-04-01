import { Descendant } from 'slate'

export const sampleDocument: Descendant[] = [
  {
    styleId: 'primary heading',
    children: [
      {
        text: 'Int. Street - Day'
      },
    ],
  },
  {
    styleId: 'action',
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
  {
    styleId: 'character',
    children: [
      {
        text: 'Manfred'
      }
    ],
  },
  {
    styleId: 'parenthetical',
    children: [
      {
        text: '(wavering)'
      }
    ],
  },
  {
    styleId: 'dialog',
    children: [
      {
        text: 'Most real people don\'t come up with something original to say in situations like this.'
      }
    ],
  },
  {
    styleId: 'default',
    children: [
      {
        text: 'A line of text in a "default" paragraph.'
      }
    ],
  },
]
