import { createGlobalStyle, DefaultTheme } from 'styled-components';
import reset from 'styled-reset';
import { breakpoints } from './system/breakpoints';
import { fonts } from './system/fonts';

export const GlobalStyle = createGlobalStyle`
  ${reset}

  body {
    font-family: -apple-system,Roboto,Helvetica Neue,Arial,sans-serif;
  }

  a {
    text-decoration: none;

    &:focus,
    &:hover {
      text-decoration: none;
    }
  }
`;

export const theme: DefaultTheme & {
  fonts: typeof fonts,
} = {
  ...breakpoints,
  fonts,
};