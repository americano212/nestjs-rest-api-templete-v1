import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { configuration } from '../src/config';

dotenv.config();
const ormconfig = async (): Promise<DataSource> => {
  const config = <{ db: DataSourceOptions }>await configuration();

  return new DataSource({
    ...config.db,
    entities: [`${__dirname}/../src/entity/**/*.{js,ts}`],
    migrations: [`${__dirname}/../src/seeds/**/*.{js,ts}`],
  });
};

export default ormconfig();
