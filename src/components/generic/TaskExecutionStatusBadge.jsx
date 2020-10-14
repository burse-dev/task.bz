import React from 'react';
import taskStatus, {
  IN_WORK_STATUS_ID,
  PENDING_STATUS_ID,
  OVERDUE_STATUS_ID,
  REJECTED_STATUS_ID,
  REWORK_STATUS_ID,
  SUCCESS_STATUS_ID,
} from '../../constant/taskExecutionStatus';

import getTypeNameById from '../functions/getTypeNameById';

export default ({ statusId }) => {
  let statusClass;
  switch (statusId) {
    case IN_WORK_STATUS_ID:
      statusClass = 'badge-primary'; break;
    case PENDING_STATUS_ID:
      statusClass = 'badge-warning'; break;
    case OVERDUE_STATUS_ID:
      statusClass = 'badge-secondary'; break;
    case REJECTED_STATUS_ID:
      statusClass = 'badge-danger'; break;
    case REWORK_STATUS_ID:
      statusClass = 'badge-info'; break;
    case SUCCESS_STATUS_ID:
      statusClass = 'badge-success'; break;
    default:
      statusClass = 'badge-primary'; break;
  }

  const className = `badge ${statusClass} badge-primary`;

  return (
    <span className={className}>{getTypeNameById(statusId, taskStatus)}</span>
  );
};
