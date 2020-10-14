import React from 'react';
import { css } from 'styled-components';
import Tooltip from 'react-simple-tooltip';

const customCss = css`
  width: fit-content;
  white-space: nowrap; 
`;

export default ({ children, ...rest }) => (
  <Tooltip
    customCss={customCss}
    radius={5}
    padding={8}
    fontSize="12px"
    {...rest}
  >
    {children}
  </Tooltip>
);
