import express from 'express';
import STATUS_ROUTE from './routes/status.route';
import USERS_ROUTE from './routes/users.route';

const APP = express();

//Configurações da aplicação
APP.use(express.json());
APP.use(express.urlencoded({ extended: true }))

//Configurações de Rotas
APP.use(USERS_ROUTE);
APP.use(STATUS_ROUTE);

//Inicialização do servidor
APP.listen(3000, () => {
    console.log("server running at port 3000!");
});