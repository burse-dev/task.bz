import router from '../user';
import Users from '../../models/users';
import Transactions from '../../models/transactions';

router.get('/transactions/refresh', async (req, res) => {
  const UsersList = await Users.findAll({
    include: [
      {
        model: Transactions,
      },
    ],
  });

  UsersList.reduce(
    (previousPromise, User) => previousPromise.then(() => User.recalculatePayments()),
    Promise.resolve(),
  );

  return res.json(true);
});

export default router;
