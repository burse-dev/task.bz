import bcrypt from 'bcrypt';

export default string => new Promise((resolve, reject) => {
  bcrypt.hash(string, 10, (hashError, hash) => {
    if (hashError) {
      return reject(hashError);
    }

    return resolve(hash);
  });
});
