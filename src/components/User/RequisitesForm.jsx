import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Field, reduxForm } from 'redux-form';
import Table from 'react-bootstrap/Table';
import moment from 'moment';
import FormControl from '../generic/Form/FormControlRedux';
import FormControlSelect from '../generic/Form/FormControlSelectRedux';
import getTypeNameById from '../functions/getTypeNameById';
import requisitesType from '../../constant/requisitesType';

const requisitesTypeOptions = requisitesType.map(requisitesType => ({
  value: requisitesType.id,
  label: requisitesType.name,
}));

requisitesTypeOptions.unshift({
  label: 'Выберите',
  value: '',
});

const validate = (values) => {
  const errors = {};

  if (!values.type) {
    errors.type = true;
  }

  if (!values.value) {
    errors.value = true;
  }

  return errors;
};

const filterAvailableRequisitesTypes = (
  requisitesTypeOptions, requisites,
) => requisitesTypeOptions.filter((requisitesType) => {
  for (let i = 0; requisites.length > i; i += 1) {
    if (requisitesType.value === requisites[i].type) {
      return false;
    }
  }

  return true;
});

const RequisitesForm = ({ handleSubmit, onSubmit, reset, requisites }) => {
  const submitForm = values => onSubmit(values).then(() => {
    reset();
  });

  const filteredRequisitesTypeOptions = filterAvailableRequisitesTypes(
    requisitesTypeOptions, requisites,
  );

  return (
    <>
      <Form onSubmit={handleSubmit(submitForm)}>
        <Form.Group>
          <Form.Label>Способ выплат</Form.Label>
          <Field
            name="type"
            options={filteredRequisitesTypeOptions}
            component={FormControlSelect}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Реквизиты для выплаты</Form.Label>
          <Field
            name="value"
            component={FormControl}
          />
          <Form.Text className="text-muted">
            Номер кошелька или карты
          </Form.Text>
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
        >
          Добавить
        </Button>
      </Form>

      {requisites && !!requisites.length && (
        <Table className="mt-4" striped bordered hover>
          <thead>
            <tr>
              <th>Дата добавления</th>
              <th>Реквизиты</th>
              <th>Способ выплат</th>
            </tr>
          </thead>

          <tbody>

            {requisites.map(requisites => (
              <tr>
                <td>{moment(requisites.createdAt).format('HH:mm DD.MM.YY')}</td>
                <td>{requisites.value}</td>
                <td>{getTypeNameById(requisites.type, requisitesType)}</td>
              </tr>
            ))}

          </tbody>
        </Table>
      )}
    </>
  );
};

export default reduxForm({
  form: 'requisitesForm',
  validate,
})(RequisitesForm);
