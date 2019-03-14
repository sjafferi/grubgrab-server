import Error from "@platform/common/errors";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import * as http from "http";
import authHandler from "middleware/auth";
import errorHandler from "middleware/errors";
import logger from "morgan";

import Routes from "./routes";

class Server {
  app: any;

  constructor() {
    this.app = express();

    this.init();
    this.setupServer();
    this.listen();
  }

  init = () => {
    // Middleware
    this.app.use(logger("dev"));
    this.app.use(bodyParser.json({ limit: "20mb" }));
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.use(cors());
    this.app.options('*', cors());

    this.app.use(authHandler());

    this.app.use(fileUpload());

    // ===== Register Routes =====
    this.app.use("/", Routes);

    // ===== 404 Handler =====
    this.app.all(
      "*",
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        next(new Error.NotFoundError("404"));
      }
    );

    this.app.use(errorHandler);
  };

  setupServer = () => {
    const httpServer = http.createServer(this.app);
    this.app.listen = (args: any) => httpServer.listen(args);
  };

  listen = () => {
    this.app.listen(process.env.PORT || 9010);
    console.info(`Listening on port ${process.env.PORT || 9010}`);
  };
}

const server = new Server();
Object.freeze(server);

export default server;
