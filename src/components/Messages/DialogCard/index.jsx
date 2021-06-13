import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import moment from 'moment';

const StyledLink = styled(Link)`
  display: block;
  width: 100%;
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

const Date = styled.div`
  font-size: 12px;
  color: #888;
`;

export default ({
  id,
  subject,
  lastMessage,
  time,
}) => (
  <StyledLink
    to={`/messages/dialog/${id}`}
    className="mt-1 rounded"
  >
    <div className="d-flex justify-content-between">
      <div>
        <div>
          <b>{subject}</b>
        </div>
        <div>
          {lastMessage}
        </div>
      </div>
      <Date>
        {moment(time).format('DD.MM.YYYY H:mm')}
      </Date>
    </div>
  </StyledLink>
);
