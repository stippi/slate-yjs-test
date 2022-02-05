import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { CharacterStyle } from './types/StyleTypes';

test('renders learn react link', () => {
  render(<App/>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('compare objects', () => {
  const a: CharacterStyle = { bold: true }
  const b: CharacterStyle = { bold: true, italic: true }
  console.log(a == b)
});
