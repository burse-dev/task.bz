/* eslint-disable no-param-reassign,no-restricted-globals */
import React from 'react';
import Form from 'react-bootstrap/Form';
import { Field } from 'redux-form';
import FormControl from '../generic/Form/FormControlRedux';
import DateTimePicker from '../generic/Form/DateTimePickerRedux';
import FormControlSelect from '../generic/Form/FormControlSelectRedux';

const ONE_TIME_EXECUTION_TYPE_ID = 1;
const REPEATED_EXECUTION_TYPE_ID = 2;

const repeatedExecutionIntervalsOptions = [
  { label: 'Можно выполнять сразу после прверки', value: 0 },
  { label: 'Через 1 час поле подачи предыдущего отчета', value: 1 },
  { label: 'Через 3 часа после подачи предыдущего отчета', value: 2 },
  { label: 'Через 6 часов после подачи предыдущего отчета', value: 3 },
  { label: 'Через 12 часов после подачи предыдущего отчета', value: 4 },
  { label: 'Через 1 сутки после подачи предыдущего отчета', value: 5 },
  { label: 'Через 2 сутки после подачи предыдущего отчета', value: 6 },
  { label: 'Через 3 суток после подачи предыдущего отчета', value: 7 },
  { label: 'Через 5 суток после подачи предыдущего отчета', value: 8 },
  { label: 'Через 10 суток после подачи предыдущего отчета', value: 9 },
];

const limitOptions = [{
  label: 'Один пользователь - одно исполнение', value: ONE_TIME_EXECUTION_TYPE_ID,
}, {
  label: 'Можно выполнять многократно', value: REPEATED_EXECUTION_TYPE_ID,
}];

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

export const RestrictionsFields = ({ limitForUser }) => (
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
      <Form.Label>Технология выполнения</Form.Label>
      <Field
        name="limitForUser"
        component={FormControlSelect}
        options={limitOptions}
      />
      <Form.Text className="text-muted">
        Сколько раз может выполнить задание каждый исполнитель
      </Form.Text>
    </Form.Group>

    {REPEATED_EXECUTION_TYPE_ID === parseInt(limitForUser, 10) && (
      <Form.Group>
        <Form.Label>Интервалы многократных выполнений</Form.Label>
        <Field
          name="repeatedExecutionInterval"
          component={FormControlSelect}
          options={repeatedExecutionIntervalsOptions}
        />
      </Form.Group>
    )}

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
