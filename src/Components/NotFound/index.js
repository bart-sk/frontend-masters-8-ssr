import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

const Wrapper = styled.div`
  width: 100%;
  padding: ${rem(50)};
  color: #242531;
  text-align: center;
  font-weight: bold;
  font-size: ${rem(32)};
`;

const NotFound = () => {
  return <Wrapper>Obsah sa nenašiel</Wrapper>;
};

export default NotFound;
