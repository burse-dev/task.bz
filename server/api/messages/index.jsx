import passport from 'passport';
import { getDialogMessages, getDialogs, sendMessage, createDialog } from '../controllers/messages';
import router from '../user';

router.get('/messages', passport.authenticate('jwt', { session: false }), getDialogs);

router.get('/messages/dialog/:id', passport.authenticate('jwt', { session: false }), getDialogMessages);

router.post('/messages/send', passport.authenticate('jwt', { session: false }), sendMessage);

router.post('/messages/new', passport.authenticate('jwt', { session: false }), createDialog);

export default router;
