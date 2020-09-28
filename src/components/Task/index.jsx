import React, { Component } from 'react';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Header from '../Header';
import Price from '../generic/Price';
import Pre from '../generic/Pre';

const Title = styled.h1`
  font-size: 28px;
  padding-bottom: 10px;
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const TasWrapper = styled.div`
  border: 1px solid rgba(0,0,0,.125);
  box-shadow: 0 0 4px 0 rgba(1,1,1,0.1);
`;

// eslint-disable-next-line react/prefer-stateless-function
class Task extends Component {
  render() {
    return (
      <>
        <Header />

        {/* <Container> */}
        {/*  <Breadcrumb className="pt-3"> */}
        {/*    <Link to="/feed"> */}
        {/*      <Breadcrumb.Item href="/3">Задания /</Breadcrumb.Item> */}
        {/*    </Link> */}
        {/*    <Breadcrumb.Item active> */}
        {/*      Переход на сайт из Яндекса */}
        {/*    </Breadcrumb.Item> */}
        {/*  </Breadcrumb> */}
        {/* </Container> */}

        <Container>
          <div className="pt-3 pt-lg-3 pb-5">
            <TasWrapper className="p-3 p-lg-4 rounded">
              <Title>Переход на сайт из Яндекса</Title>
              <section>
                <b>Категория:</b>
                {' Регистрация в сервисе'}
              </section>
              <section>
                <h5 className="pt-2">Задание</h5>
                <p>
                  <Pre>
                    {'Для получения оплаты необходимо выполнить все пункты задания.\n'
                    + '\n'
                    + '1. Иметь в друзьях и подписчиках (суммарно) не менее 1000 человек.\n'
                    + '2. Вступить в группу (https://vk.com/v888sz53) и не удаляться.\n'
                    + '3. Сделать репост 3-х первых постов (тех, что сверху, а не тех, что снизу).\n'
                    + '\n'
                    + 'Для повторного получения оплаты повторите *все действия снова.\n'
                    + '\n'
                    + '*кроме 2-го пункта (при условии, если Вы не выходили из группы, в которую вступили при первом выполнении задания)\n'
                    + '\n'
                    + 'Желаю удачи!'}
                  </Pre>
                </p>
              </section>

              <section>
                <h5 className="pt-2">Оплата</h5>
                <Price price="20" />
              </section>

              <br />

              <section>
                <h5 className="pt-2">Отчет</h5>
                <p>
                  {/* eslint-disable-next-line max-len */}
                  <Pre>
                    {'Ваш логин с которым прошли регистрацию на сайте и скрин баланса с заработанными 150р\n'
                    + 'у меня в статистике все видно, не пытайтесь обмануть, всем кто выполнил добросовестно задание оплачу быстро!\n'
                    + 'Если не успели собрать за 12 часов, подавайте в отчет, буду выделять вам сколько нужно времени,\n'
                    + 'только подавайте с логином с instagram777,\n'
                    + 'подали без логина сразу буду отклонять, это нужно для того чтобы отсеять халявщиков. Приятного и легкого заработка!'}
                  </Pre>
                </p>
              </section>

              <section>
                <b>Время на выполнение:</b>
                {' 2 часа'}
              </section>

              <section className="pt-2">
                <b>Задание доступно до:</b>
                {' 30 сентября'}
              </section>

              <Button variant="primary" className="mt-4">Выполнить задание</Button>
            </TasWrapper>
          </div>
        </Container>
      </>
    );
  }
}

export default Task;
