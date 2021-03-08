import React from 'react';
import taskStatus, {
  IN_WORK_TASK_STATUS_ID,
  SUSPENDED_TASK_STATUS_ID,
  REMOVED_TASK_STATUS_ID,
  FINISHED_TASK_STATUS_ID,
} from '../../constant/taskStatus';

import getTypeNameById from '../functions/getTypeNameById';

export default ({ statusId }) => {
  let statusClass;
  switch (statusId) {
    case IN_WORK_TASK_STATUS_ID:
      statusClass = 'badge-primary'; break;
    case SUSPENDED_TASK_STATUS_ID:
      statusClass = 'badge-warning'; break;
    case REMOVED_TASK_STATUS_ID:
      statusClass = 'badge-secondary'; break;
    case FINISHED_TASK_STATUS_ID:
      statusClass = 'badge-success'; break;
    default: statusClass = 'badge-primary';
  }

  const className = `badge ${statusClass} badge-primary`;

  return (
    <span className={className}>{getTypeNameById(statusId, taskStatus)}</span>
  );
};
