import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import vkLogo from './vk-logo.svg';

const Icon = styled.img`
  width: 35px;
  margin-left: 30px;
`;

export default () => (
  <div className="container">
    <footer className="pt-4 my-md-5 pt-md-5 border-top">
      <div className="row">
        <div className="col-12 col-md">
          <div className="d-flex mb-3 align-items-center">
            <div>
              Task.bz
              <small className="d-block text-muted">
                © 2015-
                {new Date().getFullYear()}
              </small>
            </div>
            <a href="https://vk.com/taskbz" rel="noreferrer nofollow noopener" target="_blank">
              <Icon src={vkLogo} />
            </a>
          </div>
        </div>
        <div className="col-6 col-md">
          <h5>Информация</h5>
          <ul className="list-unstyled text-small">
            <li><a className="text-muted" href="/">Политика конфиденциальности</a></li>
            <li><a className="text-muted" href="/">Правила пользования</a></li>
            <li><a className="text-muted" href="/">Правила выплат</a></li>
            <li><Link className="text-muted" to="/offer">Оферта</Link></li>
          </ul>
        </div>
        <div className="col-6 col-md">
          <h5>Помощь</h5>
          <ul className="list-unstyled text-small">
            <li><Link className="text-muted" to="/help">Служба поддержки</Link></li>
            <li><a className="text-muted" href="/">База знаний</a></li>
          </ul>
        </div>
        <div className="col-6 col-md">
          <h5>О нас</h5>
          <ul className="list-unstyled text-small">
            <li><Link className="text-muted" to="/about">О проекте</Link></li>
            <li><Link className="text-muted" to="/help">Контакты</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
);
