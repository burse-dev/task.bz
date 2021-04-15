import React from 'react';
import styled from 'styled-components';
import rubleIcon from './ruble-icon.svg';

const CoinsIcon = styled.img`
  width: 16px;
`;

export default ({ price }) => (
  <div className="d-flex align-items-center">
    {price}
    <CoinsIcon src={rubleIcon} className="pl-1" />
  </div>
);
