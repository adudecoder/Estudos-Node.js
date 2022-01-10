import { Router, Request, Response, NextFunction } from "express"; // Router para criar configurações de rotas
import { StatusCodes } from "http-status-codes";
import { DatabaseError } from "pg";
import userRepository from "../repositories/user.repository";

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

USERS_ROUTE.get('/users', async (req: Request, res: Response, next: NextFunction) => {
    const USERS = await userRepository.findAllUsers();
    res.status(StatusCodes.OK).send({USERS});
});

USERS_ROUTE.get('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {

        const UUID = req.params.uuid;
        const user = await userRepository.findById(UUID);
        res.status(StatusCodes.OK).send(user);

    } catch (error) {

        next(error);

    }
});

USERS_ROUTE.post('/users', async (req: Request, res: Response, next: NextFunction) => {
    const NEW_USER = req.body;
    const uuid = await userRepository.create(NEW_USER);
    // console.log(req.body);
    res.status(StatusCodes.CREATED).send(uuid);

});

USERS_ROUTE.put('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const uuid = req.params.uuid;
    const modifiedUser = req.body;

    modifiedUser.uuid = uuid;

    await userRepository.update(modifiedUser);

    res.status(StatusCodes.OK).send();
});

USERS_ROUTE.delete('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const uuid = req.params.uuid;
    await userRepository.remove(uuid);
    res.sendStatus(StatusCodes.OK);
});

export default USERS_ROUTE;