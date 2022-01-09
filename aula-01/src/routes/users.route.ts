import { Router, Request, Response, NextFunction } from "express"; // Router para criar configurações de rotas
import { StatusCodes } from "http-status-codes";

/*  rotas necessarias
    //
    Retornar uma lista de usuarios
*   get /users
    //
    Retornar um Id especifico
*   get /users/:uuid
    //
    Criar um novo registro
*   post /users
    //
    Alterar um usuário
*   put /users/:uuid
    //
    Deletar um usuário
*   delete /users/:uuid
*/

const USERS_ROUTE = Router();

USERS_ROUTE.get('/users', (req: Request, res: Response, next: NextFunction) => {
    const USERS = [{ userName: 'Victor' }];
    res.status(StatusCodes.OK).send({USERS});
});

USERS_ROUTE.get('/users/:uuid', (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const UUID = req.params.uuid;

    res.status(StatusCodes.OK).send({ UUID });
});

USERS_ROUTE.post('/users', (req: Request, res: Response, next: NextFunction) => {
    const NEW_USER = req.body;
    // console.log(req.body);
    res.status(StatusCodes.CREATED).send(NEW_USER);

});

USERS_ROUTE.put('/users/:uuid', (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const UUID = req.params.uuid;
    const MODIFIED_USER = req.body;

    MODIFIED_USER.UUID = UUID;

    res.status(StatusCodes.OK).send({ MODIFIED_USER });
});

USERS_ROUTE.delete('/users/:uuid', (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    res.sendStatus(StatusCodes.OK);
});

export default USERS_ROUTE;