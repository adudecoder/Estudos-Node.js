// Responsavel pela configuração do banco de dados.

import { Pool } from 'pg';

const connectionString = 'postgres://tuuigfiu:qK1qc7bUNw09BQ6dB0A_PT9-EYUm-Sxb@motty.db.elephantsql.com/tuuigfiu';
const db = new Pool({ connectionString });

export default db;