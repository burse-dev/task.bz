import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { reduxForm } from 'redux-form';

const TicketsForm = ({ handleSubmit }) => (
  <>
    <Form onSubmit={handleSubmit}>
      <Button variant="outline-danger" type="submit">
        Отменить запрос
      </Button>
    </Form>
  </>
);

export default reduxForm({
  form: 'cancelTicketForm',
  enableReinitialize: true,
})(TicketsForm);
