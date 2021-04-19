import React from 'react';
import styled from 'styled-components';

const Font = styled.span`
  font-weight: bolder;
`;

export default ({ price }) => (
  <div className="d-flex align-items-center">
    <Font>{price}</Font>
    &#8201;&#8381;
  </div>
);
