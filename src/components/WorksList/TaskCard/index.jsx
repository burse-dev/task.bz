import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Price from '../../generic/Price';
import TaskExecutionStatusBadge from '../../generic/TaskExecutionStatusBadge';
import categories from '../../../constant/category';
import { REPEATED_TYPE_ID } from '../../../constant/taskExecutionType';

const Wrapper = styled.div` 
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
    background: #f7f7f7 !important;   
  }
`;

const Title = styled.div`
  font-size: 16px;
  color: #333;
  &:hover {
    text-decoration: none;
  }
`;

const Category = styled.div`
  font-size: 12px;
  color: #888;
`;

const getCategoryById = id => categories.find(category => category.id === id);

export default ({ to, title, statusId, category, price, executionType }) => (
  <Wrapper
    as={Link}
    to={to}
    className="d-block d-md-flex justify-content-between mt-1 rounded"
  >

    <div className="d-md-flex align-items-center">
      <Title className="pr-2">
        {title}
      </Title>

      <div className="d-flex align-items-center">
        <Price price={price} className="pr-2" />
        <TaskExecutionStatusBadge statusId={statusId} />
      </div>
    </div>

    <div className="d-flex">
      <Category className="pr-2">
        {getCategoryById(category).name}
      </Category>
      <Category>
        {executionType === REPEATED_TYPE_ID ? 'Многоразовое' : 'Одноразовое' }
      </Category>
    </div>
  </Wrapper>
);
