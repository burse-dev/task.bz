/* eslint-disable no-param-reassign */
import React from 'react';
import Form from 'react-bootstrap/Form';
import { Field } from 'redux-form';
import FormControl from '../generic/Form/FormControlRedux';
import FormControlSelect from '../generic/Form/FormControlSelectRedux';
import category from '../../constant/category';
import taskStatus from '../../constant/taskStatus';

const categoryOptions = category.map(category => ({
  value: category.id,
  label: category.name,
}));

const taskStatusOptions = taskStatus.map(taskStatus => ({
  value: taskStatus.id,
  label: taskStatus.name,
}));

taskStatusOptions.unshift({
  label: '',
  value: '',
});

categoryOptions.unshift({
  label: 'Выберите категорию',
  value: '',
});

export const validateMainFields = (values, errors) => {
  const inputErrorsCount = Object.keys(errors).length;

  if (!values.title || (values.title.length < 10 || values.title.length > 100)) {
    errors.title = 'от 10 до 100 символов';
  }

  if (!values.status) {
    errors.status = true;
  }

  if (!values.category) {
    errors.category = 'Выберите категорию';
  }

  if (
    !values.description || (values.description.length < 100 || values.description.length > 3000)
  ) {
    errors.description = 'от 100 до 3000 символов';
  }

  if (
    !values.reportRules || (values.reportRules.length < 100 || values.reportRules.length > 3000)
  ) {
    errors.reportRules = 'от 100 до 3000 символов';
  }

  if (!values.price || values.price <= 0) {
    errors.price = 'Обязательное поле, должно быть больше 0';
  }

  const outputErrorsCount = Object.keys(errors).length;

  if (outputErrorsCount !== inputErrorsCount) {
    // eslint-disable-next-line no-underscore-dangle
    errors._error = 'Ошибки в разделе "Основное"';
  }

  return errors;
};

export const MainFields = () => (
  <>
    <Form.Group>
      <Form.Label>Название задачи</Form.Label>
      <Field
        name="title"
        component={FormControl}
      />
      <Form.Text className="text-muted">
        Например: «Посмотреть видео и оставить комментарии»
      </Form.Text>
    </Form.Group>

    <Form.Group>
      <Form.Label>Статус</Form.Label>
      <Field
        name="status"
        options={taskStatusOptions}
        component={FormControlSelect}
      />
    </Form.Group>

    <Form.Group controlId="forCategory">
      <Form.Label>Категория</Form.Label>
      <Field
        name="category"
        component={FormControlSelect}
        options={categoryOptions}
      />
    </Form.Group>

    <Form.Group>
      <Form.Label>Задание</Form.Label>
      <Field
        name="description"
        placeholder="Подробно и понятно опишите что и где именно должен сделать исполнитель"
        as="textarea"
        rows="6"
        component={FormControl}
      />
      <Form.Text className="text-muted">
        До 3000 символов
      </Form.Text>
    </Form.Group>

    <Form.Group>
      <Form.Label>Что нужно для отчёта</Form.Label>
      <Field
        name="reportRules"
        placeholder="Опишите что нужно указать исполнителю в отчёте"
        as="textarea"
        rows="6"
        component={FormControl}
      />
    </Form.Group>

    <Form.Group>
      <Form.Label>Вознаграждение за выполнения в рублях</Form.Label>
      <Field
        name="price"
        type="number"
        component={FormControl}
      />
      <Form.Text className="text-muted">
        Сколько вы готовы платить за одно выполнение задания
      </Form.Text>
    </Form.Group>
  </>
);
