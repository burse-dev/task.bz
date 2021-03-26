import passport from 'passport';
import { getList } from '../controllers/usersList';
import router from '../user';

router.get('/users', passport.authenticate('jwt', { session: false }), getList);

export default router;
