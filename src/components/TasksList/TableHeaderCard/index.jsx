import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: .2s;
  color: #333;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Col = styled.div`
  display: flex;
  justify-content: center;
`;

const NameCol = styled.div`
  width: 25%;
`;

const PriceCol = styled(Col)`
  width: 10%;
`;

const StatusCol = styled(Col)`
  width: 20%;
`;

const DoneCol = styled(Col)`
  width: 15%;
`;

const InWorkCol = styled(Col)`
  text-align: center;
  width: 15%;
`;

export default () => (
  <Wrapper>
    <NameCol>
      Задача
    </NameCol>
    <PriceCol>
      Стоимость
    </PriceCol>
    <StatusCol>
      Статус
    </StatusCol>
    <DoneCol>
      Выполнено
    </DoneCol>
    <InWorkCol>
      На проверке - В работе
    </InWorkCol>
    <div />
  </Wrapper>
);
