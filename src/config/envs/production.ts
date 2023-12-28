export const config = {
  db: {
    type: process.env['DB_TYPE'] || 'mysql',
    synchronize: false,
    logging: false,
    host: process.env['DB_HOST'],
    port: process.env['DB_PORT'],
    username: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_NAME'],
    autoLoadEntities: true,
  },
  jwt: {
    accessSecret: process.env['JWT_ACCESS_SECRET'],
    refreshSecret: process.env['JWT_REFRESH_SECRET'],
    accessTokenExpire: process.env['ACCESS_TOKEN_EXPIRE'] || '1d',
    refreshTokenExpire: process.env['REFRESH_TOKEN_EXPIRE'] || '30d',
  },
  api: {
    port: process.env['PORT'],
  },
  aws: {
    accessKey: process.env['AWS_ACCESS_KEY_ID'],
    secretKey: process.env['AWS_SECRET_ACCESS_KEY'],
    region: process.env['AWS_REGION'],
    s3: {
      bucketName: process.env['AWS_S3_BUCKET_NAME'],
    },
    sms: {
      account: process.env['MAIL_AWS_ACCOUNT'],
      password: process.env['MAIL_AWS_PASSWORD'],
      serever: process.env['MAIL_SERVER'],
    },
  },
  slack: {
    webhookUrl: process.env['SLACK_WEBHOOK_URL'] || '',
  },
  oauth: {
    kakao: {
      clientID: process.env['KAKAO_CLIENT_ID'],
      clientSecret: process.env['KAKAO_CLIENT_SECRET'],
      callbackURL: process.env['KAKAO_CALLBACK_URL'],
    },
  },
};
