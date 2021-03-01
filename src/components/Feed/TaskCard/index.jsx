import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Price from '../../generic/Price';
import Pre from '../../generic/Pre';
import categories from '../../../constant/category';
import { REPEATED_TYPE_ID } from '../../../constant/taskExecutionType';

const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(0,0,0,.125);
  box-shadow: 0 0 4px 0 rgba(1,1,1,0.1);
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 16px;
  
  &:hover {
    text-decoration: none;
  }
`;

const Description = styled.div`
  font-size: 14px;
  white-space: pre-wrap;
`;

const Category = styled.div`
  font-size: 12px;
  color: #888;
`;

const getCategoryById = id => categories.find(category => category.id === id);

export default ({ title, id, description, category, price, executionType }) => {
  const [open, setOpen] = useState(false);
  return (
    <Wrapper
      className="mt-1 rounded"
      onClick={() => setOpen(!open)}
      aria-controls="example-collapse-text"
      aria-expanded={open}
    >
      <Title
        className="d-flex align-items-center"
      >
        <div className="pr-2">
          {title}
        </div>
        <Price price={price} />
      </Title>
      <Category>
        Категория:
        {' '}
        {getCategoryById(category).name}
      </Category>
      <Category>
        {executionType === REPEATED_TYPE_ID ? 'Многоразовое' : 'Одноразове' }
      </Category>
      <Collapse in={open}>
        <Description id="example-collapse-text">
          <div className="p-2 p-lg-3">
            <Pre>
              {description}
            </Pre>
            <Link to={`task/${id}`}>
              <Button variant="outline-success">Подробнее</Button>
            </Link>
          </div>
        </Description>
      </Collapse>
    </Wrapper>
  );
};
