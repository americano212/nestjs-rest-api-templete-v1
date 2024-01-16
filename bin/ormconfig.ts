import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { configuration } from '../src/config';
import SnakeNamingStrategy from 'typeorm-naming-strategy';
import { DatabaseConnectionException } from 'src/common/exceptions';

dotenv.config();

const wait = (timeToDelay: number) => new Promise((resolve) => setTimeout(resolve, timeToDelay));

const ormconfig = async (): Promise<DataSource> => {
  const config = <{ db: DataSourceOptions }>await configuration();

  const dataSource = new DataSource({
    ...config.db,
    logging: false,
    logger: 'file',
    namingStrategy: new SnakeNamingStrategy(),
    entities: [`src/**/*.entity{.ts,.js}`],
    migrations: [`src/seeds/**/*.{js,ts}`],
  });

  async function connectionCheck() {
    await dataSource
      .initialize()
      .then(() => {
        console.log('[SUCCESS] Data Source has been initialized!');
      })
      .catch(async (err: DatabaseConnectionException) => {
        console.error('[FAILED] Error during Data Source initialization');
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.log('[RECONNECT] Retrying connection');
          await wait(2000);
          await connectionCheck();
        } else {
          throw err;
        }
      });
    return dataSource;
  }
  await connectionCheck();
  await dataSource.destroy();
  return dataSource;
};

export default ormconfig();
