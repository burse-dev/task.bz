export const PENDING_TICKET_STATUS_ID = 1;
export const REJECTED_TICKET_STATUS_ID = 2;
export const SUCCESS_TICKET_STATUS_ID = 3;

export default [
  {
    id: PENDING_TICKET_STATUS_ID,
    name: 'В обработке',
  },
  {
    id: REJECTED_TICKET_STATUS_ID,
    name: 'Отклонено',
  },
  {
    id: SUCCESS_TICKET_STATUS_ID,
    name: 'Исполнено',
  },
];
