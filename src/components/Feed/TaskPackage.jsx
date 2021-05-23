import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Price from '../generic/Price';

const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  border: 1px solid #dfdfdf;
  cursor: pointer;
  box-shadow: none;
  background: #edfdff;
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

const Parameter = styled.div`
  padding-right: 10px;
  font-size: 12px;
  color: #888;
`;

export default ({
  bonusPercentage,
  totalPrice,
  title,
  tasks,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Wrapper
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

          <Price price={totalPrice} />
        </Title>

        <div className="d-flex">
          <Parameter>
            {`Задач в пакете: ${tasks.length}`}
          </Parameter>
          <Parameter>
            {`Бонус за выполнение: ${bonusPercentage}%`}
          </Parameter>
        </div>
      </div>

      <Collapse in={open}>
        <Description id="example-collapse-text">
          <div className="p-2 p-lg-3">
            <div className="mb-3">
              {tasks.map(({ title, price }, index) => (
                <div className="d-flex">
                  {`${index + 1}. ${title} `}
                  <Price price={price} />
                </div>
              ))}
            </div>
            <Link to={`task/${tasks[0].id}`}>
              <Button variant="outline-success">Приступить</Button>
            </Link>
          </div>
        </Description>
      </Collapse>
    </Wrapper>
  );
};
