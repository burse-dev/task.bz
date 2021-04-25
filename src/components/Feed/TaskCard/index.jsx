import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Price from '../../generic/Price';
import Pre from '../../generic/Pre';
import categories from '../../../constant/category';
import { REPEATED_TYPE_ID } from '../../../constant/taskExecutionType';
import Tooltip from '../../generic/Tooltip';

const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(0,0,0,.125);
  box-shadow: 0 0 4px 0 rgba(1,1,1,0.1);
  cursor: pointer;
  ${({ inPriority }) => inPriority && 'background: #fbf8e3;'} 
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
  padding-right: 10px;
  font-size: 12px;
  color: #888;
`;

const RejectionRate = styled(Category)``;

const DoneCount = styled(Category)``;

const getCategoryById = id => categories.find(category => category.id === id);

export default ({
  title,
  id,
  description,
  category,
  price,
  inPriority,
  executionType,
  doneCount,
  rejectedCount,
}) => {
  const [open, setOpen] = useState(false);

  const rate = parseInt(doneCount, 10)
    ? Math.floor((+doneCount / (+doneCount + +rejectedCount)) * 100)
    : 0;

  return (
    <Wrapper
      inPriority={inPriority}
      className="mt-1 rounded"
      onClick={() => setOpen(!open)}
      aria-controls="example-collapse-text"
      aria-expanded={open}
    >
      <div className="d-md-flex align-items-center justify-content-md-between">
        <Title className="d-flex align-items-center">
          <div className="pr-2">
            {title}
          </div>

          <Price price={price} />
        </Title>

        <div className="d-flex">
          <Category>
            Категория:
            {' '}
            {getCategoryById(category).name}
          </Category>

          <Category>
            {executionType === REPEATED_TYPE_ID ? 'Многоразовое' : 'Одноразовое' }
          </Category>

          {!!rate && (
            <RejectionRate>
              <Tooltip
                content="Процент принятых заданий"
              >
                {rate}
                %
              </Tooltip>
            </RejectionRate>
          )}

          {!!+doneCount && (
            <DoneCount>
              <Tooltip
                content="Всего сделано заданий"
              >
                {doneCount}
              </Tooltip>
            </DoneCount>
          )}
        </div>
      </div>

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
