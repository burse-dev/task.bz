import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import getTypeNameById from '../functions/getTypeNameById';
import CardWrapper from './CardWrapper';
import categories from '../../constant/category';
import Pre from '../generic/Pre';
import Price from '../generic/Price';
import minutesCountEnding from '../functions/minutesCountEnding';
import { REPEATED_TYPE_ID } from '../../constant/taskExecutionType';
import taskExecutionIntervalType from '../../constant/taskExecutionIntervalType';
import addLinks from '../functions/addLinksToText';

const Title = styled.h1`
  font-size: 28px;
  padding-bottom: 10px;
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export default ({
  title,
  category,
  description,
  price,
  reportRules,
  executionTimeLimit,
  endTime,
  executionType,
  executionInterval,
}) => (
  <div className="pt-3 pt-lg-3">
    <CardWrapper className="p-3 p-lg-4 rounded">
      <Title>{title}</Title>
      <section>
        <b>Категория: </b>
        {getTypeNameById(category, categories)}
      </section>
      <section>
        <h5 className="pt-2">Задание</h5>
        <p>
          <Pre>
            <div dangerouslySetInnerHTML={{ __html: addLinks(description) }} />
          </Pre>
        </p>
      </section>

      <section>
        <h5 className="pt-2">Оплата</h5>
        <Price price={price} />
      </section>

      <br />

      <section>
        <h5 className="pt-2">Отчет</h5>
        <p>
          <Pre>
            {reportRules}
          </Pre>
        </p>
      </section>

      <section>
        <b>Время на выполнение: </b>
        {executionTimeLimit ? `${executionTimeLimit} ${minutesCountEnding(executionTimeLimit)}` : '-'}
      </section>

      {executionType === REPEATED_TYPE_ID && (
        <section>
          <b>Повторное выполнение: </b>
          {getTypeNameById(executionInterval, taskExecutionIntervalType)}
        </section>
      )}

      {endTime && (
        <section className="pt-2">
          <b>Задание доступно до: </b>
          {moment(endTime).format('DD.MM.YYYY H:m')}
        </section>
      )}

    </CardWrapper>
  </div>
);
