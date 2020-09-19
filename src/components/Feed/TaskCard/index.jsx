import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

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
`;

export default ({ title, description }) => {
  const [open, setOpen] = useState(false);
  return (
    <Wrapper className="mt-1 rounded">
      <Title
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
      >
        {title}
      </Title>
      <Collapse in={open}>
        <Description id="example-collapse-text">
          <br />
          <pre>
            {description}
          </pre>
          <Link to="task/1">
            <Button variant="outline-success">Подробнее</Button>
          </Link>
        </Description>
      </Collapse>
    </Wrapper>
  );
};
