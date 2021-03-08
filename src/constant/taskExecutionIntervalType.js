export const AFTER_CHECKING_TASK_EXECUTION_INTERVAL_TYPE_ID = 1;

export const EXECUTION_INTERVALS_VALUES_IN_HOURS = [
  0, 0, 1, 3, 6, 12, 24, 48, 72,
];

export default [
  {
    id: AFTER_CHECKING_TASK_EXECUTION_INTERVAL_TYPE_ID,
    name: 'Можно выполнять сразу после проверки',
  },
  {
    id: 2,
    name: 'Через 1 час поле подачи предыдущего отчета',
  },
  {
    id: 3,
    name: 'Через 3 часа после подачи предыдущего отчета',
  },
  {
    id: 4,
    name: 'Через 6 часов после подачи предыдущего отчета',
  },
  {
    id: 5,
    name: 'Через 12 часов после подачи предыдущего отчета',
  },
  {
    id: 6,
    name: 'Через 1 сутки после подачи предыдущего отчета',
  },
  {
    id: 7,
    name: 'Через 2 сутки после подачи предыдущего отчета',
  },
  {
    id: 8,
    name: 'Через 3 суток после подачи предыдущего отчета',
  },
];
