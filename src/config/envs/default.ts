export const config = {
  db: {
    entities: ['dist/**/*.entity.{ts,js}'],
  },
  bcrypt: {
    salt: Number(process.env['BCRYPT_SALT']) || 10,
  },
};
