import React from 'react';
import styled from 'styled-components';
import coinsIcon from './coinsIcon.svg';

const CoinsIcon = styled.img`
  width: 20px;
`;

export default ({ price }) => (
  <div className="d-flex align-items-center">
    {price}
    <CoinsIcon src={coinsIcon} className="pl-1" />
  </div>
);
