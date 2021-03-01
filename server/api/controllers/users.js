import moment from 'moment';
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import Users from '../../models/users';
import Tasks from '../../models/tasks';
import Requisites from '../../models/requisites';
import UserTasks from '../../models/userTasks';
import generateHash from '../../functions/generateHash';
import { IN_WORK_STATUS_ID, PENDING_STATUS_ID } from '../../../src/constant/taskExecutionStatus';
import Tickets from '../../models/tickets';
import { PENDING_TICKET_STATUS_ID } from '../../../src/constant/ticketStatus';
import Transactions from '../../models/transactions';
import { ADD_TYPE_ID } from '../../../src/constant/transactionType';
import { REPEATED_TYPE_ID } from '../../../src/constant/taskExecutionType';

const JWT = require('jsonwebtoken');

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];

const signToken = user => JWT.sign({
  iss: 'task.bz',
  sub: user.id,
  type: user.type,
  iat: new Date().getTime(),
  exp: new Date().setDate(new Date().getDate() + 1),
}, 'task.bz');

export const signIn = async (req, res) => {
  const token = signToken(req.user);
  res.status(200)
    .json({ token });
};

export const getOwnData = async (req, res) => {
  const data = await Users.findOne({
    include: [
      {
        model: Requisites,
      },
    ],
    where: {
      id: req.user.id,
    },
    attributes: [
      'email', 'login', 'gender', 'city', 'country', 'dob', 'balance', 'type',
    ],
  });

  res.json(data);
};

export const addRequisites = async (req, res) => {
  const User = req.user;

  const { value, type } = req.body;

  await Requisites.create({
    value,
    type,
    userId: User.id,
  });

  res.json(true);
};

export const getTickets = async (req, res) => {
  const User = req.user;

  const tickets = await Tickets.findAll({
    include: [{
      model: Requisites,
    }],
    where: {
      userId: User.id,
    },
  });

  res.json(tickets);
};

export const getAccruals = async (req, res) => {
  const User = req.user;

  const accruals = await Transactions.findAll({
    include: [{
      model: Tasks,
      attributes: ['id', 'title'],
    }],
    where: {
      userId: User.id,
      type: ADD_TYPE_ID,
    },
    attributes: ['createdAt', 'value'],
  });

  res.json(accruals);
};

export const addTicket = async (req, res) => {
  const User = req.user;

  const { paymentsMethod, sum } = req.body;

  await Tickets.create({
    requisiteId: paymentsMethod,
    value: sum,
    status: PENDING_TICKET_STATUS_ID,
    userId: User.id,
  });

  res.json(true);
};

export const save = async (req, res) => {
  const User = req.user;

  const { login, dob, gender, city, country, password } = req.body;

  let dobValid = true;
  if (!/\d{2}\.\d{2}\.\d{4}/.test(dob)) {
    dobValid = false;
  }

  await User.update({
    ...(dobValid && { dob: moment(dob, 'DD.MM.YYYY') }),
    login,
    gender,
    city,
    country,
    ...(password && { password: await generateHash(password) }),
  });

  res.json(req.user);
};

export const getTasks = async (req, res, next) => {
  try {
    const User = req.user;

    Tasks.findAndCountAll({
      include: [
        {
          model: UserTasks,
          where: { userId: User.id },
        },
      ],
    }).then((result) => {
      res.json({
        count: result.count,
        tasks: result.rows,
      });
    });
  } catch (e) {
    next(e);
  }
};

export const makeTask = async (req, res, next) => {
  try {
    const User = req.user;
    const userId = User.id;
    const { taskId } = req.body;

    const Task = await Tasks.findOne({
      where: { id: taskId },
    });

    const UserTask = await UserTasks.findOne({
      where: {
        taskId,
        userId,
      },
    });

    if (UserTask && Task.executionType !== REPEATED_TYPE_ID) {
      return res.json(false);
    }

    await UserTasks.create({
      taskId,
      userId,
      status: IN_WORK_STATUS_ID,
    });

    return res.json(true);
  } catch (e) {
    return next(e);
  }
};

const saveFile = async (originalFilename, tmpPath, userTaskId, userId, taskId) => {
  const ext = path.extname(originalFilename);

  const contentDirPath = `/uploads/tasks/${taskId}`;
  const dirPath = path.join(__dirname, '../../', contentDirPath);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  const DateTimeStr = moment(new Date()).format('HH_mm_DD_MM_YYYY');

  const fileName = `ut${userTaskId}_u${userId}_t${taskId}_${DateTimeStr}${ext}`;

  const filePath = path.join(dirPath, fileName);

  return new Promise(((resolve, reject) => {
    fs.copyFile(tmpPath, filePath, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(path.join(contentDirPath, fileName));
      }
    });
  }));
};

export const sendReport = async (req, res, next) => {
  try {
    const UserTask = await UserTasks.findOne({
      where: {
        id: req.body.userTaskId,
      },
    });

    if (!UserTask) {
      return res.json(false);
    }

    const file = req.files.screenshot;

    const screenshot = file ? await saveFile(
      file.originalFilename,
      file.path,
      UserTask.id,
      UserTask.userId,
      UserTask.taskId,
    ) : null;

    await UserTask.update({
      report: req.body.report,
      status: PENDING_STATUS_ID,
      ...(screenshot && { screenshot: `${config.host}${screenshot}` }),
      readyDate: Sequelize.fn('NOW'),
    });

    return res.json(true);
  } catch (e) {
    return next(e);
  }
};

export const editReport = async (req, res, next) => {
  try {
    const UserTask = await UserTasks.findOne({
      where: {
        id: req.body.userTaskId,
      },
    });

    if (!UserTask) {
      return res.json(false);
    }

    await UserTask.update({
      status: IN_WORK_STATUS_ID,
    });

    return res.json(true);
  } catch (e) {
    return next(e);
  }
};

export const checkUserTask = async (req, res, next) => {
  const User = req.user;

  try {
    const UserTask = await UserTasks.findOne({
      where: {
        taskId: req.body.taskId,
        userId: User.id,
      },
      order: [
        ['id', 'DESC'],
      ],
    });

    return res.json(UserTask);
  } catch (e) {
    return next(e);
  }
};

export const cancelTask = async (req, res, next) => {
  const User = req.user;

  try {
    const UserTask = await UserTasks.findOne({
      where: {
        taskId: req.body.taskId,
        userId: User.id,
      },
    });

    if (UserTask) {
      await UserTask.destroy();

      return res.json(true);
    }

    return res.json(true);
  } catch (e) {
    return next(e);
  }
};
