export const IN_WORK_STATUS_ID = 1;
export const PENDING_STATUS_ID = 2;
export const OVERDUE_STATUS_ID = 3;
export const REJECTED_STATUS_ID = 4;
export const REWORK_STATUS_ID = 5;
export const SUCCESS_STATUS_ID = 6;

export default [
  {
    id: IN_WORK_STATUS_ID,
    name: 'В работе',
  },
  {
    id: PENDING_STATUS_ID,
    name: 'На проверке',
  },
  {
    id: OVERDUE_STATUS_ID,
    name: 'Не выполненно',
  },
  {
    id: REJECTED_STATUS_ID,
    name: 'Отклонено',
  },
  {
    id: REWORK_STATUS_ID,
    name: 'Требует доработки',
  },
  {
    id: SUCCESS_STATUS_ID,
    name: 'Принято',
  },
];
