export const config = {
  db: {
    type: process.env['DB_TYPE'] || 'mysql',
    synchronize: process.env['DB_SYNC'] || false,
    logging: true,
    host: process.env['DB_HOST'] || 'testHost',
    port: process.env['DB_PORT'] || 3306,
    username: process.env['DB_USER'] || 'username',
    password: process.env['DB_PASSWORD'] || 'password',
    database: process.env['DB_NAME'] || 'dbname',
    autoLoadEntities: true,
  },
  jwt: {
    secret: process.env['DEV_JWT_SECRET'],
    refreshSecret: process.env['DEV_JWT_REFRESH_SECRET'],
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
    webhookUrl: process.env['SLACK_WEBHOOK_URL'],
  },
};
