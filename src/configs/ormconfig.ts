import { DataSource, DataSourceOptions } from 'typeorm';

import { databaseConfig } from './index';

export default new DataSource(databaseConfig() as DataSourceOptions);
