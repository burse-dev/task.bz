/* eslint-disable no-param-reassign,no-restricted-globals */
import React from 'react';
import Form from 'react-bootstrap/Form';
import { Field } from 'redux-form';
import FormControl from '../generic/Form/FormControlRedux';
import DateTimePicker from '../generic/Form/DateTimePickerRedux';

export const validateRestrictionsFields = (values, errors) => {
  const inputErrorsCount = Object.keys(errors).length;
  if (values.executionTime && isNaN(values.executionTime)) {
    errors.executionTime = true;
  }

  if (values.limitInDay && isNaN(values.limitInDay)) {
    errors.limitInDay = true;
  }

  if (values.limitInHour && isNaN(values.limitInHour)) {
    errors.limitInHour = true;
  }

  if (values.limitForUser && isNaN(values.limitForUser)) {
    errors.limitForUser = true;
  }

  const outputErrorsCount = Object.keys(errors).length;

  if (outputErrorsCount !== inputErrorsCount) {
    // eslint-disable-next-line no-underscore-dangle
    errors._error = 'Ошибки в разделе "Ограничения"';
  }

  return errors;
};

export const RestrictionsFields = () => (
  <>
    <Form.Group>
      <Form.Label>Время выполнения (часы)</Form.Label>
      <Field
        name="executionTimeForUserLimit"
        component={FormControl}
        type="number"
        min="0"
      />
      <Form.Text className="text-muted">
        Сколько часов дать исполнителю на выполнение задания
      </Form.Text>
    </Form.Group>

    <Form.Group>
      <Form.Label>Лимит в час</Form.Label>
      <Field
        name="limitInHour"
        component={FormControl}
        placeholder="Оставьте пустым, если не требуется"
        type="number"
        min="0"
      />
      <Form.Text className="text-muted">
        Задача становится недоступной при достижении лимита выполнений
      </Form.Text>
    </Form.Group>

    <Form.Group>
      <Form.Label>Лимит в сутки</Form.Label>
      <Field
        name="limitInDay"
        component={FormControl}
        placeholder="Оставьте пустым, если не требуется"
        type="number"
        min="0"
      />
      <Form.Text className="text-muted">
        Задача становится недоступной при достижении лимита выполнений
      </Form.Text>
    </Form.Group>

    <Form.Group>
      <Form.Label>Лимит от исполнителя</Form.Label>
      <Field
        name="limitForUser"
        component={FormControl}
        placeholder="Оставьте пустым, если не требуется"
        type="number"
        min="0"
      />
      <Form.Text className="text-muted">
        Сколько раз может выполнить задание каждый исполнитель
      </Form.Text>
    </Form.Group>

    <Form.Group>
      <Form.Label>Общий лимит выполнений</Form.Label>
      <Field
        name="limitTotal"
        component={FormControl}
        placeholder="Оставьте пустым, если не требуется"
        type="number"
        min="0"
      />
      <Form.Text className="text-muted">
        Задача становится недоступной при достижении лимита выполнений
      </Form.Text>
    </Form.Group>


    <Form.Group>
      <Form.Label>Время начала</Form.Label>
      <div>
        <Field
          name="startTime"
          // placeholder="Нажмите для изменения"
          component={DateTimePicker}
        />
      </div>
      <Form.Text className="text-muted">
        Оставьте пустым, если задача будет доступна после сохранения
      </Form.Text>
    </Form.Group>

    <Form.Group>
      <Form.Label>Время завершения</Form.Label>
      <div>
        <Field
          name="endTime"
          // placeholder="Нажмите для изменения"
          component={DateTimePicker}
        />
      </div>
      <Form.Text className="text-muted">
        Оставьте пустым, если будет закрыта в ручном режиме
      </Form.Text>
    </Form.Group>
  </>
);
