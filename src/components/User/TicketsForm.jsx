import React from 'react';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { Field, reduxForm } from 'redux-form';
import FormControl from '../generic/Form/FormControlRedux';
import FormControlSelect from '../generic/Form/FormControlSelectRedux';
import requisitesType from '../../constant/requisitesType';
import getTypeNameById from '../functions/getTypeNameById';
import TicketStatusBadge from '../generic/TicketStatusBadge';

const getRequisitesOptions = (requisites) => {
  const requisitesOptions = requisites.map(item => ({
    label: item.value,
    value: item.id,
  }));

  requisitesOptions.unshift({
    label: 'Выберите реквизиты',
    value: '',
  });

  return requisitesOptions;
};

const validate = (values, props) => {
  const errors = {};
  if (!values.paymentsMethod) {
    errors.paymentsMethod = true;
  }

  if (!values.sum || values.sum <= 0) {
    errors.sum = 'Некорректная сумма';
  }

  if (values.sum > props.balance) {
    errors.sum = 'Сумма должна быть меньше или равна доступной';
  }

  return errors;
};

// eslint-disable-next-line no-unused-vars
const TicketsForm = ({ handleSubmit, requisites, balance, tickets }) => (
  <>
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Выберите реквизиты</Form.Label>
        <Field
          name="paymentsMethod"
          options={getRequisitesOptions(requisites)}
          component={FormControlSelect}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Сумма выплаты в рублях</Form.Label>
        <Field
          name="sum"
          component={FormControl}
        />
        <Form.Text className="text-muted">
          Доступно:
          {' '}
          {balance}
        </Form.Text>
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
      >
        Выплатить
      </Button>
    </Form>

    <Table className="mt-4" striped bordered hover>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Реквизиты</th>
          <th>Сумма</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map(ticket => (
          <tr>
            <td>{moment(ticket.createdAt).format('HH:mm DD.MM.YY')}</td>
            <td>{getTypeNameById(ticket.requisite.type, requisitesType)}</td>
            <td>{ticket.value}</td>
            <td>
              <TicketStatusBadge statusId={ticket.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </>
);

export default reduxForm({
  form: 'ticketsForm',
  validate,
  enableReinitialize: true,
})(TicketsForm);
