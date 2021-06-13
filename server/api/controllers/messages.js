import Users from '../../models/users';
import Dialogs from '../../models/dialogs';
import Messages from '../../models/messages';
import { ADMIN_TYPE_ID } from '../../../src/constant/userType';
import { ACTIVE_DIALOG_STATUS_ID } from '../../../src/constant/dialogStatus';

export const getDialogs = async (req, res) => {
  const User = req.user;

  const dialogs = await Dialogs.findAll({
    attributes: [
      'id',
      'subject',
      'lastMessageText',
      'lastMessageDate',
    ],
    where: {
      ...(User.type === ADMIN_TYPE_ID ? { adminId: User.id } : { userId: User.id }),
    },
    order: [
      ['createdAt', 'DESC'],
    ],
  });

  return res.json(dialogs);
};

export const getDialogMessages = async (req, res) => {
  const User = req.user;

  const Dialog = await Dialogs.findOne({
    attributes: [
      'id', 'subject', 'userId',
    ],
    include: [{
      model: Messages,
      attributes: [
        'createdAt', 'text', 'wasRead', 'sentFromAdmin',
      ],
    }],
    where: {
      ...((User.type === ADMIN_TYPE_ID) ? { adminId: User.id } : { userId: User.id }),
      id: req.params.id,
    },
    order: [
      ['createdAt', 'DESC'],
      ['messages', 'createdAt', 'ASC'],
    ],
  });

  if (!Dialog) {
    return res.json(false);
  }

  // make messages read
  await Messages.update({
    wasRead: true,
  }, {
    where: {
      recipientId: User.id,
      dialogId: req.params.id,
    },
  });

  let userLogin = User.login;
  if (User.type === ADMIN_TYPE_ID) {
    const Recipient = await Users.findOne({
      where: {
        id: Dialog.userId,
      },
    });
    userLogin = Recipient.login;
  }

  return res.json({
    userLogin,
    ...Dialog.dataValues,
  });
};

export const sendMessage = async (req, res) => {
  const User = req.user;

  const { dialogId, text } = req.body;

  const Dialog = await Dialogs.findOne({
    where: {
      id: dialogId,
      ...((User.type === ADMIN_TYPE_ID) ? { adminId: User.id } : { userId: User.id }),
    },
  });

  const recipientId = (User.type === ADMIN_TYPE_ID) ? Dialog.userId : Dialog.adminId;

  if (Dialog) {
    res.json(false);
  }

  await Messages.create({
    senderId: User.id,
    recipientId,
    dialogId,
    text,
    sentFromAdmin: User.type === ADMIN_TYPE_ID,
  });

  Dialog.update({
    lastMessageText: text,
    lastMessageDate: new Date(),
  });

  return res.json(true);
};

export const createDialog = async (req, res) => {
  const User = req.user;

  const { subject, text } = req.body;

  const Dialog = await Dialogs.create({
    subject,
    status: ACTIVE_DIALOG_STATUS_ID,
    lastMessageText: text,
    lastMessageDate: new Date(),
    userId: User.id,
    adminId: 2,
  });

  await Messages.create({
    senderId: User.id,
    recipientId: 2,
    dialogId: Dialog.id,
    text,
    sentFromAdmin: User.type === ADMIN_TYPE_ID,
  });

  return res.json(Dialog.id);
};
