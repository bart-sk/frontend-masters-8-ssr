import { injectGlobal } from 'styled-components';

// eslint-disable-next-line
injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,500&subset=latin-ext');
  html, body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    background: #fff;
  }
  #root {
    height: 100%;
  }
  * {
    box-sizing: border-box;
  }
`;
