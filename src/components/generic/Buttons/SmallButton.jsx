import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.button`
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 4px 4px;
  color: #f035a5;
  font-family: 'Roboto-Light', sans-serif;
  font-size: 14px;
  border-radius: 5px;
  border: none;
  background: ${'rgb(238,238,238)'};
  ${({ disabled }) => (disabled && 'opacity: 0.5; cursor: auto;')}
  transition: .2s;
  :hover {
    ${({ disabled }) => (!disabled && 'background: #C8C8C8;')}
  }
  @media screen and (max-width: 991px) {
    padding: 12px;
  }
`;

const Icon = styled.img`
  width: 14px;
`;

export default ({ className, onClick, icon, disabled }) => (
  <Wrapper className={className} disabled={disabled} onClick={onClick}>
    <Icon src={icon} />
  </Wrapper>
);
