import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Price from '../../generic/Price';
import TaskExecutionStatusBadge from '../../generic/TaskExecutionStatusBadge';
import categories from '../../../constant/category';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(0,0,0,.125);
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
  font-size: 14px;
  color: #888;
`;

const getCategoryById = id => categories.find(category => category.id === id);


export default ({ to, title, statusId, category, price }) => (
  <Wrapper
    as={Link}
    to={to}
    className="mt-1 rounded"
  >
    <div className="w-25">
      <Title
        className="d-flex align-items-center"
      >
        <div className="pr-2">
          {title}
        </div>
      </Title>
      <Category>
        Категория:
        {' '}
        {getCategoryById(category).name}
      </Category>
    </div>
    <div className="mr-4 ml-3">
      <Price price={price} />
    </div>
    <div className="w-25">
      <TaskExecutionStatusBadge statusId={statusId} />
    </div>
  </Wrapper>
);
