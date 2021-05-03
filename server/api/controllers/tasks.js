import { Op } from 'sequelize';
import moment from 'moment';
import { IN_WORK_TASK_STATUS_ID, REMOVED_TASK_STATUS_ID } from '../../../src/constant/taskStatus';
import Tasks from '../../models/tasks';
import UserTasks from '../../models/userTasks';
import TaskPacks from '../../models/taskPack';
import {
  IN_WORK_STATUS_ID,
  PENDING_STATUS_ID,
  REWORK_STATUS_ID, SUCCESS_STATUS_ID,
} from '../../../src/constant/taskExecutionStatus';
import { ONE_TIME_TYPE_ID, REPEATED_TYPE_ID } from '../../../src/constant/taskExecutionType';
import {
  AFTER_CHECKING_TASK_EXECUTION_INTERVAL_TYPE_ID,
  EXECUTION_INTERVALS_VALUES_IN_HOURS,
} from '../../../src/constant/taskExecutionIntervalType';

export const save = async (req, res) => {
  const {
    title,
    category,
    description,
    reportRules,
    price,
    status,
    executionTimeLimit,
    limitInHour,
    limitInDay,
    executionType,
    executionInterval,
    limitTotal,
    startTime,
    endTime,
  } = req.body;

  await Tasks.create({
    status,
    title,
    category,
    description,
    reportRules,
    price,
    executionTimeLimit,
    limitInHour,
    limitInDay,
    executionType,
    executionInterval,
    limitTotal,
    startTime,
    endTime,
  })
    .then(result => res.json({
      id: result.id,
    }));
};

export const update = async (req, res) => {
  const {
    id,
    title,
    category,
    description,
    reportRules,
    price,
    status,
    executionTimeLimit,
    limitInHour,
    limitInDay,
    executionType,
    executionInterval,
    limitTotal,
    startTime,
    endTime,
  } = req.body;

  await Tasks.update({
    id,
    title,
    category,
    description,
    reportRules,
    price,
    status,
    executionTimeLimit,
    limitInHour,
    limitInDay,
    executionType,
    executionInterval,
    limitTotal,
    startTime,
    endTime,
  },
  {
    where: {
      id,
    },
  })
    .then(result => res.json({
      id: result.id,
    }));
};

export const remove = async (req, res) => {
  const Task = await Tasks.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!Task) {
    return res.json(false);
  }

  if (Task) {
    await Task.update({
      status: REMOVED_TASK_STATUS_ID,
    }, {
      where: {
        id: req.params.id,
      },
    });

    return res.json(true);
  }

  return res.json(false);
};

export const checkTaskAvailability = async (taskId, userId) => {
  const Task = await Tasks.findOne({
    where: {
      [Op.and]: {
        id: taskId,
        startTime: {
          [Op.or]: {
            [Op.lte]: new Date(),
            [Op.eq]: null,
          },
        },
        endTime: {
          [Op.or]: {
            [Op.gte]: new Date(),
            [Op.eq]: null,
          },
        },
        status: IN_WORK_TASK_STATUS_ID,
      },
    },
    include: [{
      model: UserTasks,
      attributes: [
        'id',
      ],
      where: {
        status: [IN_WORK_STATUS_ID, PENDING_STATUS_ID, REWORK_STATUS_ID, SUCCESS_STATUS_ID],
      },
      required: false,
    }],
  });

  // задача не найдена (более не доступна)
  if (!Task) {
    return {
      availability: false,
      reason: 'no_task',
    };
  }

  // Достигнут лимит выполнений
  if (Task.userTasks.length >= Task.limitTotal && Task.limitTotal) {
    return {
      availability: false,
      reason: 'execution_limit',
    };
  }

  const UserTask = await UserTasks.findOne({
    where: {
      taskId,
      userId,
    },
    order: [
      ['id', 'DESC'],
    ],
  });

  // если отклика еще не было
  if (!UserTask) {
    return {
      availability: true,
    };
  }

  // если отклик на задачу уже был и задача одноразовая
  if (UserTask && Task.executionType === ONE_TIME_TYPE_ID) {
    return {
      availability: false,
      reason: 'one_time',
    };
  }

  if (Task.executionType === REPEATED_TYPE_ID) {
    // если многоразовое выполнение + предыдущее задание принято
    if (
      Task.executionInterval === AFTER_CHECKING_TASK_EXECUTION_INTERVAL_TYPE_ID
      && UserTask.status === SUCCESS_STATUS_ID
    ) {
      return {
        availability: true,
      };
    }

    if (UserTask.readyDate) {
      // если многоразовое выполнение + отчет отправлен + прошел интервал полсе пред. отчета
      const hours = EXECUTION_INTERVALS_VALUES_IN_HOURS[Task.executionInterval];
      const dateInterval = moment(UserTask.readyDate)
        .add(hours, 'hours')
        .toDate();

      if (
        Task.executionInterval > AFTER_CHECKING_TASK_EXECUTION_INTERVAL_TYPE_ID
        && (new Date() > dateInterval)
      ) {
        return {
          availability: true,
        };
      }
    }

    return {
      availability: false,
      reason: 'interval',
    };
  }

  return {
    availability: false,
    reason: 'default',
  };
};

export const setPriority = async (req, res) => {
  const Task = await Tasks.findOne({
    where: {
      id: req.params.id,
    },
  });

  await Task.update({
    inPriority: !Task.inPriority,
  });

  return res.json(true);
};

export const addPack = async (req, res, next) => {
  try {
    const idsStr = req.query.ids;
    const ids = idsStr ? idsStr.split(',') : [];

    const TaskPack = await TaskPacks.create({});

    await Tasks.update({
      taskPackId: TaskPack.id,
    }, {
      where: {
        id: ids,
      },
    });

    res.json(true);
  } catch (e) {
    next(e);
  }
};

export const deleteFromPack = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Tasks.update({
      taskPackId: null,
    }, {
      where: {
        id,
      },
    });

    res.json(true);
  } catch (e) {
    next(e);
  }
};
