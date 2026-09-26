import pg from 'pg';
import {config} from './config.js' ;
export const pool = new pg.Pool(config.db);

export async function probarConexion() {
    const {rows} = await pool.query('SELECT NOW()');
    console.log('Conexión exitosa a la bd:', rows[0].now);

}