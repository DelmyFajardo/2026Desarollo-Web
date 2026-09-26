import {Sequileze} from 'sequileze'
import {config} from './config.js' ;
export const sequelize = new Sequileze(config.db.database, config.db.user, config.db.password, {
    host: config.db.host,
    dialect: 'postgres',
    logging: false
});
