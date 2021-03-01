/* eslint-disable no-param-reassign,no-restricted-globals */
import React from 'react';
import Form from 'react-bootstrap/Form';
import { Field } from 'redux-form';
import FormControl from '../generic/Form/FormControlRedux';
import DateTimePicker from '../generic/Form/DateTimePickerRedux';
import FormControlSelect from '../generic/Form/FormControlSelectRedux';
import executionType, { REPEATED_TYPE_ID } from '../../constant/taskExecutionType';
import executionIntervalType from '../../constant/taskExecutionIntervalType';

const executionIntervalsOptions = executionIntervalType.map(type => ({
  value: type.id,
  label: type.name,
}));

const executionTypeOptions = executionType.map(type => ({
  value: type.id,
  label: type.name,
}));

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

  if (values.executionType && isNaN(values.executionType)) {
    errors.executionType = true;
  }

  const outputErrorsCount = Object.keys(errors).length;

  if (outputErrorsCount !== inputErrorsCount) {
    // eslint-disable-next-line no-underscore-dangle
    errors._error = 'Ошибки в разделе "Ограничения"';
  }

  return errors;
};

export const RestrictionsFields = ({ executionType }) => (
  <>
    <Form.Group>
      <Form.Label>Время выполнения (часы)</Form.Label>
      <Field
        name="executionTimeLimit"
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
        name="executionType"
        component={FormControlSelect}
        options={executionTypeOptions}
      />
      <Form.Text className="text-muted">
        Сколько раз может выполнить задание каждый исполнитель
      </Form.Text>
    </Form.Group>

    {REPEATED_TYPE_ID === parseInt(executionType, 10) && (
      <Form.Group>
        <Form.Label>Интервалы многократных выполнений</Form.Label>
        <Field
          name="executionInterval"
          component={FormControlSelect}
          options={executionIntervalsOptions}
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
