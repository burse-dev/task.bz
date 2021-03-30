import passport from 'passport';
import { sendMailing } from '../controllers/mailing';
import router from '../user';

router.post('/mailing/send', passport.authenticate('jwt', { session: false }), sendMailing);

export default router;
