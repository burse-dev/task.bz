import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Field, reduxForm } from 'redux-form';
import FormControl from '../../generic/Form/FormControlRedux';

const validate = (values) => {
  const errors = {};

  if (!values.title) {
    errors.title = true;
  }

  if (!values.bonus) {
    errors.bonus = true;
  }

  return errors;
};

const AddTaskPackForm = ({ handleSubmit }) => (
  <>
    <Form onSubmit={handleSubmit}>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Название пакета</Form.Label>
          <Field
            name="title"
            component={FormControl}
          />
          <Form.Text className="text-muted">
            Например: «10 заданий на написание отзывов»
          </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label>Бонус за выполнение всех заданий в %</Form.Label>
          <Field
            name="bonus"
            component={FormControl}
            type="number"
            min="0"
          />
          <Form.Text className="text-muted">
            Например: 20
          </Form.Text>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button type="submit" variant="primary">
          Сохранить
        </Button>
      </Modal.Footer>
    </Form>
  </>
);

const AddTaskPackFormRedux = reduxForm({
  form: 'addTaskPackForm',
  enableReinitialize: true,
  validate,
})(AddTaskPackForm);

export default ({ isOpen, handleClose, handleSave }) => (
  <>
    <Modal show={isOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Объединение задач в пакет</Modal.Title>
      </Modal.Header>

      <AddTaskPackFormRedux
        onSubmit={handleSave}
      />
    </Modal>
  </>
);
