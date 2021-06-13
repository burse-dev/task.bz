import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

const StyledLink = styled.div`
  padding: 10px;
  border: 1px solid #dfdfdf;
  box-shadow: 0 0 4px 0 rgba(1,1,1,0.1);
  cursor: pointer;
  transition: .2s;
  color: #333;
  &:hover {
    color: #333;   
  }
  &:hover {
    background: #f7f7f7;   
  }
`;

const Name = styled('b')`
  color: ${({ sentFromAdmin }) => (!sentFromAdmin && '#888')};
`;

const Date = styled.div`
  font-size: 12px;
  color: #888;
`;

export default ({
  message,
  time,
  name,
  sentFromAdmin,
}) => (
  <StyledLink className="mt-1 rounded">
    <div className="d-flex justify-content-between">
      <div>
        <Name sentFromAdmin={sentFromAdmin}>
          {sentFromAdmin ? 'admin' : name }
          {': '}
        </Name>
        {message}
      </div>
      <Date>
        {moment(time).format('HH:mm DD.MM.YY')}
      </Date>
    </div>
  </StyledLink>
);
