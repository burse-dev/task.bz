import moment from 'moment';
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import Users from '../../models/users';
import Tasks from '../../models/tasks';
import Files from '../../models/files';
import Requisites from '../../models/requisites';
import UserTasks from '../../models/userTasks';
import Messages from '../../models/messages';
import UserAchievements from '../../models/userAchievements';
import generateHash from '../../functions/generateHash';
import {
  IN_WORK_STATUS_ID,
  PENDING_STATUS_ID,
} from '../../../src/constant/taskExecutionStatus';
import Tickets from '../../models/tickets';
import { PENDING_TICKET_STATUS_ID } from '../../../src/constant/ticketStatus';
import Transactions from '../../models/transactions';
import { ADD_TYPE_ID } from '../../../src/constant/transactionType';
import { checkTaskAvailability } from './tasks';
import { MIN_WITHDRAWAL } from '../../../src/constant/generic';

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
  const User = await Users.findOne({
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

  const unreadMessagesCount = await Messages.count({
    where: {
      recipientId: req.user.id,
      wasRead: false,
    },
  });

  await Users.update({
    lastIp: req.headers['x-real-ip'],
  }, {
    where: {
      id: req.user.id,
    },
  });

  res.json({
    unreadMessagesCount,
    ...User.dataValues,
  });
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
    attributes: ['createdAt', 'value', 'description'],
    order: [
      ['createdAt', 'DESC'],
    ],
  });

  res.json(accruals);
};

export const getAchievements = async (req, res) => {
  const User = req.user;

  const achievements = await UserAchievements.findAll({
    where: {
      userId: User.id,
    },
    attributes: ['value'],
  });

  res.json(achievements);
};

export const addTicket = async (req, res) => {
  const User = req.user;
  const { paymentsMethod, sum } = req.body;

  if (sum < MIN_WITHDRAWAL) {
    res.json(false);
  }

  await Tickets.create({
    requisiteId: paymentsMethod,
    value: sum,
    status: PENDING_TICKET_STATUS_ID,
    userId: User.id,
  });

  res.json(true);
};

export const cancelTicket = async (req, res) => {
  const User = req.user;

  const Ticket = await Tickets.findOne({
    where: {
      userId: User.id,
      status: PENDING_TICKET_STATUS_ID,
    },
  });

  if (Ticket) {
    await Ticket.destroy();
  }

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

export const getWorks = async (req, res, next) => {
  try {
    const User = req.user;
    const { status } = req.query;

    UserTasks.findAndCountAll({
      include: [
        {
          model: Tasks,
        },
      ],
      where: {
        ...(status && { status }),
        userId: User.id,
      },
    }).then((result) => {
      res.json({
        count: result.count,
        works: result.rows,
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

    const result = await checkTaskAvailability(taskId, userId);

    if (!result.availability) {
      return res.json(false);
    }

    await UserTasks.create({
      taskId,
      userId,
      status: IN_WORK_STATUS_ID,
    }).then(result => res.json(result.id));

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

  const rand = Math.floor(Math.random() * 10000);
  const fileName = `ut${userTaskId}_u${userId}_t${taskId}_${DateTimeStr}_${rand}${ext}`;

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

const deleteFile = async (filePath) => {
  const absFilePath = path.join(__dirname, '../../', filePath);
  if (fs.existsSync(absFilePath)) {
    fs.unlinkSync(absFilePath);
  }
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

    if (req.files && req.files.screenshots) {
      const oldFiles = await Files.findAll({
        where: {
          userTaskId: UserTask.id,
        },
      });

      if (oldFiles) {
        oldFiles.map(oldFile => deleteFile(oldFile.path));
      }

      Files.destroy({
        where: {
          userTaskId: UserTask.id,
        },
      });

      const tmpArr = req.files.screenshots.length
        ? req.files.screenshots : [req.files.screenshots];

      tmpArr.reduce((prevPromise, file) => prevPromise
        .then(() => saveFile(
          file.originalFilename,
          file.path,
          UserTask.id,
          UserTask.userId,
          UserTask.taskId,
        ))
        .then(fileName => Files.create({
          userTaskId: UserTask.id,
          path: fileName,
          url: `${config.host}${fileName}`,
        })), Promise.resolve());
    }

    await UserTask.update({
      report: req.body.report,
      status: PENDING_STATUS_ID,
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
  const { userTaskId } = req.body;
  try {
    const UserTask = await UserTasks.findOne({
      include: [{
        model: Tasks,
      }, {
        model: Files,
        required: false,
      }],
      where: {
        id: userTaskId,
        userId: User.id,
      },
    });

    let nextTaskId;
    if (UserTask.task.taskPackId) {
      const tasks = await Tasks.findAll({
        attributes: [
          'id',
        ],
        where: {
          taskPackId: UserTask.task.taskPackId,
        },
        order: [
          ['createdAt', 'ASC'],
        ],
      });

      const currentTaskIndex = tasks.findIndex(task => (task.id === UserTask.taskId));

      if (currentTaskIndex !== -1 && currentTaskIndex !== tasks.length - 1) {
        nextTaskId = tasks[currentTaskIndex + 1].id;
      }
    }

    const result = {
      ...UserTask.dataValues,
      nextTaskId,
    };

    return res.json(result);
  } catch (e) {
    return next(e);
  }
};

export const cancelTask = async (req, res, next) => {
  const User = req.user;
  const { userTaskId } = req.body;
  try {
    const UserTask = await UserTasks.findOne({
      where: {
        id: userTaskId,
        userId: User.id,
      },
    });

    if (UserTask) {
      await UserTask.destroy();
    }

    return res.json(true);
  } catch (e) {
    return next(e);
  }
};
