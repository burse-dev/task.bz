import React from 'react';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import wayBg from './wayBg.svg';
import stepsList from './stepsList';

const Wrapper = styled.div`
  position: relative;
  padding: 53px 0 50px 0;
  box-sizing: border-box;
  @media screen and (max-width: 991px) {
    padding: 36px 0 0 0;
    background: transparent;
    overflow: hidden;
  }
`;

const Steps = styled.div`
  position: relative;
  display: flex;
  width: 70%;
  margin-left: 146px;
  justify-content: space-around;
  &::before {
    content: '';
    position: absolute;
    top: -101px;
    height: 479px;
    width: 100%;
    background: url(${wayBg}) no-repeat;
    background-size: contain;
    background-position: center center;
  }
  @media screen and (max-width: 991px) {
    width: 100%;
    margin-left: 0;
    margin-top: 20px;
    flex-wrap: wrap;
    &::before {
      content: none;
    }
  }
`;

const Step = styled.div`
  margin-top: 82px;
  width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 991px) {
    margin: 15px 0;  
  }
`;

const IconWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 108px;
  height: 108px;
  border: 1px solid #999;
  border-radius: 50%;
`;

const Icon = styled.img`
  width: 50px;
`;

const Count = styled.span`
  margin-top: 36px;
  display: inline-block;
  width: 30px;
  background: #fff;
  border-radius: 50%;
  font-size: 14px;
  line-height: 28px;
  text-align: center;
  z-index: 1;
  border: 1px solid #333;
  @media screen and (max-width: 991px) {
    margin-top: 20px;
  }
`;

const Text = styled.span`
  margin-top: 24px;
  font-size: 14px;
  text-align: center;
  line-height: 130%;
  white-space: pre-line;
  @media screen and (max-width: 991px) {
    margin-top: 14px;
  }
`;

export default () => (
  <Wrapper>
    <Container>
      <h2>Как это работает</h2>
      <Steps>
        {stepsList.map(step => (
          <Step>
            <IconWrap>
              <Icon src={step.icon} />
            </IconWrap>
            <Count>{step.count}</Count>
            <Text>{step.text}</Text>
          </Step>
        ))}
      </Steps>
    </Container>
  </Wrapper>
);
