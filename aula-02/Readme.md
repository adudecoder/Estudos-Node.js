# Conectar node com banco de dados Postgres

## Passos a serem seguidos
1. Baixar lib node-postgres
```
$ npm install --save pg
```
2. Conectar o @types com a lib pg
```
$ npm install --save-dev @types/pg
```
3. Abrir uma conexão com o banco de dados através de um pool de conexões
* Criar um file chamado ``` db.ts ``` dentro da pasta ``` src ```
File responsavel pela configuração do banco de dados
* Usar o [ElephantSQL](https://www.elephantsql.com/) para testar as requisições de usuário
* Criar a rota de conexão
```
import { Pool } from 'pg';

const connectionString = '';
const db = new Pool({ connectionString });

export default db;
```
4. Criar uma pasta ``` sql ``` na raiz do projeto, com um file chamado ``` init.sql ```
5. Criar um script no file ``` init.sql ``` para a tabela do db com duas extensões no file
```
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";                //Para poder usar a função v4()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";                 //Para poder usar senhas cryptografadas

CREATE TABLE IF NOT EXISTS application_user(
    uuid uuid DEFAULT uuid_generate_v4(),
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    PRIMARY KEY (uuid)
);

INSERT INTO application_user (username, password) VALUES ('renan', crypt('admin', 'my_salt'));
```
6. Dentro da pasta ``` src ``` criar uma pasta chamada repositories com files responsaveis por acessar o banco de dados
7. Criar o file chamado ``` user.repository.ts ``` dentro da pasta ``` repositories ```
```
import db from "../db";
import User from "../models/user.model";

class UserRepository {

    findAllUsers(): User[] {
        return [];
    }

}

export default new UserRepository();
```
8. Dentro de ``` src ``` criar uma pasta chamada ``` models ``` com um file chamado ``` user.model.ts ```
```
// Modelo de usuario
type User = {
    uuid?: string;
    username: string;
    password?: string;
}

export default User;
```
***Consulta de usuários***
1. Criar um script dentro de ``` user.repository.ts ``` para chamar os usuários no banco de dados
```
import db from '../db';
import User from '../models/user.model';

class UserRepository {

    async findAllUsers(): Promise<User[]> {
        const query = `                                           //Configurações do SQL
            SELECT uuid, username
            FROM application_user
        `;

        const { rows } = await db.query<User>(query);              //Executar o SQL
        return rows || [];
    }

}

export default new UserRepository();
```
2. Chamar o file ``` user.repository.ts ``` na rota do file ``` users.route.ts ```
```
USERS_ROUTE.get('/users', async (req: Request, res: Response, next: NextFunction) => {
    const USERS = await userRepository.findAllUsers();                    // <==== com await e async
    res.status(StatusCodes.OK).send({USERS});
});
```

***Desenvolvendo a consulta de usuários por id***
1. Criar o método fildById dentro do file ``` user.repository.ts ```
```
async findById(uuid: string): Promise<User> {
        const query = `
            SELECT uuid, username
            FROM application_user
            WHERE uuid = $1
        `;

        const values = [uuid];

        const { rows } = await db.query<User>(query, values);
        const [ user ] = rows;

        return user;
    }
```
2. Chamar o findById na rota de usuários no file ``` users.route.ts ```
```
USERS_ROUTE.get('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const UUID = req.params.uuid;
    const user = await userRepository.findById(UUID);                   // <=======
    res.status(StatusCodes.OK).send(user);
});
```
3. Testar a consulta do usuário enquanto roda o servidor
* Pegar o id do usuário no [ElephantSQL](https://www.elephantsql.com/)
* Passar o id na URL do localhost ``` http://localhost:3000/users/idDoUsuario ```

***Desenvolvendo a inserção de usuários***
1. Criar um método **Create**
```
async create(user: User): Promise<string> {
    const script = `
        INSERT INTO application_user (
            username,
            password
        )
        VALUES ($1, crypt($2, 'my_salt'))
        RETURNING uuid
    `;

    const values = [user.username, user.password];

    const { rows } = await db.query<{ uuid: string }>(script, values)
    const [newUser] = rows;
    return newUser.uuid;
}
```
2. Utilizar o método **create** na rota **post**
```
USERS_ROUTE.post('/users', async (req: Request, res: Response, next: NextFunction) => {
    const NEW_USER = req.body;
    const uuid = await userRepository.create(NEW_USER);            // <========

    res.status(StatusCodes.CREATED).send(uuid);

});
```
***Desenvolvendo os métodos update e o delete de usuários***
1. Criar o método ***Update***
```
async update(user: User): Promise<void> {
    const script = `
        UPDATE application_user
        SET
            username = $1,
            password = crypt($2, 'my_salt')
        WHERE uuid = $3
    `;

    const values = [user.username, user.password, user.uuid];

    await db.query(script, values);
}
```
2. Chamar o método **Update** na rota **put**
```
USERS_ROUTE.put('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const uuid = req.params.uuid;
    const modifiedUser = req.body;

    modifiedUser.uuid = uuid;

    await userRepository.update(modifiedUser);              // <=======

    res.status(StatusCodes.OK).send();
});
```
3. Criar o método **Remove**
```
async remove(uuid: string): Promise<void> {
    const script = `
        DELETE
        FROM application_user
        WHERE uuid = $1
    `;
        
    const values = [uuid];

    await db.query(script, values);
}
```
4. Chamar o método **Remove** na rota **Delete**
```
USERS_ROUTE.delete('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const uuid = req.params.uuid;
    await userRepository.remove(uuid);              // <=======
    res.sendStatus(StatusCodes.OK);
});
```

***Realizando tratamento de erros***
1. Criar um try catch no método **findById**
```
async findById(uuid: string): Promise<User> {
        try {

            const query = `
                SELECT uuid, username
                FROM application_user
                WHERE uuid = $1
            `;
    
            const values = [uuid];
    
            const { rows } = await db.query<User>(query, values);
            const [ user ] = rows;
    
            return user;

        } catch (error) {
            throw new DatabaseError(error);
        }
    }
```
2. Criar uma pasta de ``` errors ``` dentro da pasta ``` models ``` com um file chamado ``` database.error.model.ts ```
3. Criar o script de **Erro** dentro do file ``` database.error.model.ts ```
```
class DatabaseError extends Error {

    constructor(
        public message: string,
        public error?: any,
    ) {
        super(message);
    }

}

export default DatabaseError;
```
4. Importar o ``` database.error.model.ts ``` no ``` user.repository.ts ``` e criar o tratamento dele no catch
```
async findById(uuid: string): Promise<User> {
        try {

            const query = `
                SELECT uuid, username
                FROM application_user
                WHERE uuid = $1
            `;
    
            const values = [uuid];
    
            const { rows } = await db.query<User>(query, values);
            const [ user ] = rows;
    
            return user;

        } catch (error) {
            throw new DatabaseError('Erro na consulta por ID', error);          // <=====
        }
    }
```
5. Fazer o tratamento na rota get de ID
```
USERS_ROUTE.get('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {

        const UUID = req.params.uuid;
        const user = await userRepository.findById(UUID);
        res.status(StatusCodes.OK).send(user);

    } catch (error) {

        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);

    }
});
```
***Desenvolvendo um error handling***
1. Dentro da pasta ``` src ``` criar uma pasta chamada ``` middlewares ``` com um file chamado ``` error-handler.middleware.t ```
2. Criar o script de erro dentro do file ``` error-handler.middleware.t ```
```
import { StatusCodes } from 'http-status-codes';
import { DatabaseError } from 'pg';
import { Request, Response, NextFunction } from "express";

function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
    if (error instanceof DatabaseError) {

        res.sendStatus(StatusCodes.BAD_REQUEST);

    } else {

        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);

    }
}

export default errorHandler;
```
3. Chamar a função no ``` index.ts ```
```
//Configuração dos Handlers de Erro
APP.use(errorHandler);
```
4. Usar a função next para o tratamento de erro na rota get de id usuários
```
USERS_ROUTE.get('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {

        const UUID = req.params.uuid;
        const user = await userRepository.findById(UUID);
        res.status(StatusCodes.OK).send(user);

    } catch (error) {

        next(error);

    }
});
```