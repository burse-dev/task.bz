import Tasks from '../../models/tasks';
import { REMOVED_TASK_STATUS_ID } from '../../../src/constant/taskStatus';

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
