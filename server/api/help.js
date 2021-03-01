import express from 'express';
import mailer from '../services/mailer';
import help from '../templates/help';

const router = express.Router();

router.post('/help/save', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    const { file } = req.files;
    mailer(
      'Обращение в службу поддержки | task.bz',
      help.replace('{{name}}', name).replace('{{email}}', email).replace('{{message}}', message),
      file,
      'info@task.bz',
    );

    return res.json(true);
  } catch (e) {
    return next(e);
  }
});

export default router;
