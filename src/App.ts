import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import apiV1 from './apiV1';
import * as errorHandler from './helpers/errorHandler';

import customResponses from './helpers/customResponses';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setMiddlewares();
    this.setRoutes()
    this.catchErrors()
  }

  private setMiddlewares(): void {
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(helmet());
    this.express.use(customResponses);
  }

  private setRoutes(): void {
    this.express.use('/v1', apiV1);
    this.express.use(
      '/apidoc',
      express.static(`${process.cwd()}/public/apidoc`)
    );
  }

  private catchErrors(): void {
    this.express.use(errorHandler.notFound);
    this.express.use(errorHandler.internalServerError);
  }
}

declare global {
  namespace Express {
    interface Request {
      email?: string
    }
    interface Response {
      success: (data?: any) => any,
      error: (message?: any, status?: number) => any
    }
  }
}

export default new App().express