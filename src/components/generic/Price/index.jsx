import React from 'react';
import styled from 'styled-components';

const Font = styled.span`
  font-weight: bolder;
`;

export default ({ price, className }) => (
  <div className={`d-flex align-items-center ${className}`}>
    <Font>{price}</Font>
    &#8201;&#8381;
  </div>
);
