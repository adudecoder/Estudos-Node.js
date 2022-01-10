# Executando um projeto com Node.js, TypeScript e Express

## Passo a serem seguidos

***Iniciar o projeto***
1. Criar uma pasta para o projeto
2. Criar o package.json
```
$ npm init
```
**Configurações necessarias no Package.json**
```
{
  "name": "ms-authentication",
  "version": "1.0.0",
  "description": "Microservice",
  "main": "./dist/index.js",                                    //ARQUIVO RAIS PRA DA START NO PROJETO
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node ./",                                         //SCRIPT PARA RODAR O PROJETO
    "build": "tsc -p ."                                         //BUILD PARA GERAR O FILE INDEX.JS
  },
  "author": "Victor Martins",
  "license": "ISC",
  "devDependencies": {                                          //DEPENDENCIAS DO TYPESCRIPT
    "@types/express": "^4.17.13",
    "@types/node": "^17.0.8",
    "typescript": "^4.5.4"
  },
  "dependencies": {
    "express": "^4.17.2"                                        //DEPENDENCIA DO EXPRESS
  }
}
```

3. Installar o TypeScript
```
$ npm install -g typescript
```
4. Criar um file tsconfig.json
```
$ tsc --init
```
**Configurações necessarias dentro do tsconfig.json**
```
{
  "compilerOptions": {
    "target": "es2019",
    "module": "commonjs",
    "moduleResolution": "node",
    "rootDir": "src",
    "typeRoots": [
      "./src/@types",                         //Arquivos de definição do typescript para estender libs
      "./node_modules/@types"
    ],
    "outDir": "./dist",                       //Arquivo do JS gerado pelo typescript
    "removeComments": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

5. Criar uma pasta chamada src e outra pasta dentro de src chamda de @types
6. Criar uma pasta chamda dist
7. Criar uma pasta chamda routes

***Para Instalar o Express***
```
$ npm install --save express
```
***Para Instalar as Dependencias do Express Com o TypeScript***
```
$ npm install --save-dev @types/express
```
***Para Conectar o Express***
1. Criar a rota de configuração do express no index.ts
```
import express, { Request, Response, NextFunction } from 'express';

const APP = express();

APP.get('/status', (req: Request, res: Response, net: NextFunction) => {
    res.status(200).send({ foo: 'bar' });
});

APP.listen(3000, () => {
    console.log("Aplicação sendo executada!");
});
```

***Instalar Lib Para Atualizar o Código Automaticamente***
```
$ npm install --save-dev ts-node-dev
```
Logo Após Instalar a Lib Você Precisa Colocar Um Novo Script Dentro Do File Package.json
```
"dev": "ts-node-dev --respawn --transpile-only --ignore-watch node_modules --no-notify src/index.ts"
```

***Criar Uma Pasta De Rotas Dentro Da Pasta src Chamada De routes e Criar Um Arquivo Dentro Da Pasta routes***
Chamado De users.route.ts Tudo Isso Para Configurar Os Usuários
1. Criar a Rota De Usuarios
```
const USERS_ROUTE = Router();
USERS_ROUTE.get('/users', (req: Request, res: Response, next: NextFunction) => {
    const USERS = [{ userName: 'Victor' }];
    res.status(200).send({USERS});
});

2. Importar o Router Para Configurar As Rotas
import { Router, Request, Response, NextFunction } from "express";

3. Exportar a Rota get
export default USERS_ROUTE;

** O CÓDIGO DEVE FICAR ASSIM **
import { Router, Request, Response, NextFunction } from "express";

const USERS_ROUTE = Router();

USERS_ROUTE.get('/users', (req: Request, res: Response, next: NextFunction) => {
    const USERS = [{ userName: 'Victor' }];
    res.status(200).send({USERS});
});

export default USERS_ROUTE;
```
4. Importar a Rota USERS_ROUTE No File index.ts
```
import USERS_ROUTE from './routes/users.route';
```
5. Utilizar a Rota Na Aplicação
```
APP.use(USERS_ROUTE);
```
**Agora a Aplicação Consegue Entender e Executar a Rota ursers.route.ts**

**Implementar Rota Por Id De Usuário**
**Criar a Rota**
```
// Passando o tipo de requisição <{ uuid: string }>
USERS_ROUTE.get('/users/:uuid', (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => { 
    const UUID = req.params.uuid;                       // Pegando o Parametro :uuid

    res.status(200).send({ UUID });                     // Retornando o uuid
});
```
***Facilitando o uso de statusCode no seu código***
```
$ npm install --save http-status-codes
```
**Importe o statusCodes dentro do file users.route.ts**
```
import { StatusCodes } from "http-status-codes";

USERS_ROUTE.get('/users', (req: Request, res: Response, next: NextFunction) => {
    const USERS = [{ userName: 'Victor' }];
    res.status(StatusCodes.OK).send({USERS});                   // Coloque ele no res das duas rotas get com .OK
});
```
***Desenvolvendo o método post***
1. Criando a rota post
```
USERS_ROUTE.post('/users', (req: Request, res: Response, next: NextFunction) => {
    const NEW_USER = req.body;

    console.log(req.body);                          //Console para saber de onde vem o body

    res.status(StatusCodes.CREATED).send(NEW_USER);

});
```
2. Como enterpretar json
**Dentro do file index.ts**
```
APP.use(express.json());
APP.use(express.urlencoded({ extended: true }))        //Para entender queryStrings e outras questões da URL
```
3. Usar um tester de rotas como por exemplo o Postman

***Desenvolvendo e testando o método put e delete***
1. Criar o método put
```
USERS_ROUTE.put('/users/:uuid', (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const UUID = req.params.uuid;
    const MODIFIED_USER = req.body;

    MODIFIED_USER.UUID = UUID;

    res.status(StatusCodes.OK).send({ MODIFIED_USER });
});
```
2. Criar o método delete
```
USERS_ROUTE.delete('/users/:uuid', (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    res.sendStatus(StatusCodes.OK);
});
```
***Refatorando a rota de status***
1. Criar um file status.route.ts dentro da pasta routes
2. Criar uma rota de status importar e exportar ela
```
import { StatusCodes } from 'http-status-codes';
import { Router, Request, Response, NextFunction } from "express";

const STATUS_ROUTE = Router();

STATUS_ROUTE.get('/status', (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(StatusCodes.OK);
});

export default STATUS_ROUTE;
```
3. Apagar o APP de status do file index.ts e chamar
```
APP.use(STATUS_ROUTE);
```
e importar ele
```
import STATUS_ROUTE from './routes/status.route';
```
Alt + Shift + O para organizar os importes
Alt + Shift + F para formatar o arquivo
