import React from 'react';
import ticketStatus, {
  PENDING_TICKET_STATUS_ID,
  REJECTED_TICKET_STATUS_ID,
  SUCCESS_TICKET_STATUS_ID,
} from '../../constant/ticketStatus';

import getTypeNameById from '../functions/getTypeNameById';

export default ({ statusId }) => {
  let statusClass;
  switch (statusId) {
    case REJECTED_TICKET_STATUS_ID:
      statusClass = 'badge-danger'; break;
    case PENDING_TICKET_STATUS_ID:
      statusClass = 'badge-warning'; break;
    case SUCCESS_TICKET_STATUS_ID:
      statusClass = 'badge-success'; break;
    default:
      statusClass = 'badge-primary';
  }

  const className = `badge ${statusClass} badge-primary`;

  return (
    <span className={className}>{getTypeNameById(statusId, ticketStatus)}</span>
  );
};
