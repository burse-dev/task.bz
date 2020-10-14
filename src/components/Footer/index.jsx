import React from 'react';

export default () => (
  <div className="container">
    <footer className="pt-4 my-md-5 pt-md-5 border-top">
      <div className="row">
        <div className="col-12 col-md">
          Task.bz
          <small className="d-block mb-3 text-muted">© 2015-2020</small>
        </div>
        <div className="col-6 col-md">
          <h5>Информация</h5>
          <ul className="list-unstyled text-small">
            <li><a className="text-muted" href="/">Политика конфиденциальности</a></li>
            <li><a className="text-muted" href="/">Правила пользования</a></li>
            <li><a className="text-muted" href="/">Правила выплат</a></li>
          </ul>
        </div>
        <div className="col-6 col-md">
          <h5>Помощь</h5>
          <ul className="list-unstyled text-small">
            <li><a className="text-muted" href="/">Служба поддержки</a></li>
            <li><a className="text-muted" href="/">База знаний</a></li>
          </ul>
        </div>
        <div className="col-6 col-md">
          <h5>О нас</h5>
          <ul className="list-unstyled text-small">
            <li><a className="text-muted" href="/">О проекте</a></li>
            <li><a className="text-muted" href="/">Контакты</a></li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
);