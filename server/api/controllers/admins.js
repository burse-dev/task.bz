import Tasks from '../../models/tasks';
import UserTasks from '../../models/userTasks';
import Users from '../../models/users';
import Files from '../../models/files';
import Transactions from '../../models/transactions';
import {
  REJECTED_STATUS_ID,
  REWORK_STATUS_ID,
  SUCCESS_STATUS_ID,
} from '../../../src/constant/taskExecutionStatus';
import Tickets from '../../models/tickets';
import Requisites from '../../models/requisites';
import {
  REJECTED_TICKET_STATUS_ID,
  SUCCESS_TICKET_STATUS_ID,
} from '../../../src/constant/ticketStatus';
import { ADD_TYPE_ID, DIFF_TYPE_ID } from '../../../src/constant/transactionType';
import mailer from '../../services/mailer';
import taskApprovedTemplate from '../../templates/taskApproved';

export const getReports = async (req, res, next) => {
  try {
    const statusId = req.query.status;
    UserTasks.findAndCountAll({
      where: {
        taskId: req.reportId,
        ...(statusId && { status: statusId }),
      },
      include: [
        {
          model: Tasks,
          attributes: ['title'],
        },
        {
          model: Files,
          attributes: ['url'],
        },
        {
          model: Users,
          attributes: ['login'],
        },
      ],
      order: [
        ['readyDate', 'DESC'],
      ],
    })
      .then((result) => {
        res.json({
          count: result.count,
          reports: result.rows,
        });
      });
  } catch (e) {
    next(e);
  }
};

export const approveReports = async (req, res, next) => {
  try {
    const idsStr = req.query.ids;
    const ids = idsStr ? idsStr.split(',') : [];

    const userTasks = await UserTasks.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          model: Tasks,
        },
      ],
    });

    const promises = userTasks.map(async (userTask) => {
      if (userTask.wasPaid !== true) {
        await Transactions.create({
          type: ADD_TYPE_ID,
          userId: userTask.userId,
          taskId: userTask.taskId,
          value: userTask.task.price,
        });
      }

      const User = await Users.findOne({
        include: [
          {
            model: Transactions,
          },
        ],
        where: {
          id: userTask.userId,
        },
      });

      await User.recalculatePayments();

      mailer(
        'Задание принято | task.bz',
        taskApprovedTemplate.replace('{{name}}', User.login).replace('{{reward}}', userTask.task.price).replace('{{balance}}', User.balance),
        null,
        User.email,
      );

      return userTask.update({
        status: SUCCESS_STATUS_ID,
        wasPaid: true,
      });
    });

    await Promise.all(promises);

    res.json(true);
  } catch (e) {
    next(e);
  }
};

export const declineReports = async (req, res, next) => {
  try {
    const idsStr = req.query.ids;
    const ids = idsStr ? idsStr.split(',') : [];

    await UserTasks.update({
      status: REJECTED_STATUS_ID,
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

export const reworkReport = async (req, res, next) => {
  try {
    const id = req.body.reportId;

    await UserTasks.update({
      status: REWORK_STATUS_ID,
      reply: req.body.reply,
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

export const getTickets = async (req, res, next) => {
  try {
    await Tickets.findAndCountAll({
      include: [
        {
          model: Requisites,
        },
        {
          model: Users,
          attributes: ['login', 'balance'],
        },
      ],
      order: [
        ['createdAt', 'DESC'],
      ],
    })
      .then((result) => {
        res.json({
          count: result.count,
          tickets: result.rows,
        });
      });
  } catch (e) {
    next(e);
  }
};

export const approveTicket = async (req, res, next) => {
  try {
    const { id } = req.body;

    const Ticket = await Tickets.findOne({
      where: {
        id,
      },
    });

    await Ticket.update({
      status: SUCCESS_TICKET_STATUS_ID,
    });

    await Transactions.create({
      userId: Ticket.userId,
      type: DIFF_TYPE_ID,
      value: -Ticket.value,
    });

    const User = await Users.findOne({
      include: [
        {
          model: Transactions,
        },
      ],
      where: {
        id: Ticket.userId,
      },
    });

    User.recalculatePayments();

    return res.json({});
  } catch (e) {
    return next(e);
  }
};

export const rejectTicket = async (req, res, next) => {
  try {
    const { id } = req.body;

    await Tickets.update({
      status: REJECTED_TICKET_STATUS_ID,
    }, {
      where: {
        id,
      },
    });

    return res.json({});
  } catch (e) {
    return next(e);
  }
};
