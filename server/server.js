import express from 'express';
// import exphbs from 'express-handlebars';
// importhbsHelpers from 'handlebars-helpers';
// import hbsLayouts from 'handlebars-layouts';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import errorhandler from 'errorhandler';
import csrf from 'csurf';
import morgan from 'morgan';
import favicon from 'serve-favicon';
import fs from 'fs';
import path from 'path';
import router from './routes/router';
import database from './lib/database';
import seeder from './lib/dbSeeder';

const app = express();
const port = process.env.PORT || '3000';


class Server {

  constructor() {
    // this.initViewEngine(); We don't have a view engine
    this.initExpressMiddleWare();
    this.initCustomMiddleware();
    this.initDbSeeder();
    this.initRoutes();
    this.start();
  }

  start() {
    app.listen(port, (err) => {
      console.log('[%s] Listening on http://localhost:%d', process.env.NODE_ENV, port);
    });
  }

  // initViewEngine() {
  //     const hbs = exphbs.create({
  //         extname: '.hbs',
  //         defaultLayout: 'master'
  //     });
  //     app.engine('hbs', hbs.engine);
  //     app.set('view engine', 'hbs');
  //     hbsLayouts.register(hbs.handlebars, {});
  // }

  initExpressMiddleWare() {
    const faviconPath = __dirname + '/public/favicon.ico';
    if (fs.existsSync(faviconPath)) {
      app.use(favicon(faviconPath));
    }
    app.use(express.static(path.join(__dirname, '/public')));
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(errorhandler());
    app.use(cookieParser());
    app.use(csrf({cookie: true}));

    app.use((req, res, next) => {
      let csrfToken = req.csrfToken();
      res.locals._csrf = csrfToken;
      res.cookie('XSRF-TOKEN', csrfToken);
      next();
    });

    process.on('uncaughtException', (err) => {
      if (err) console.log(err, err.stack);
    });
  }

  initCustomMiddleware() {
    if (process.platform === "win32") {
      require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
      }).on("SIGINT", () => {
        console.log('SIGINT: Closing MongoDB connection');
        database.close();
      });
    }

    process.on('SIGINT', () => {
      console.log('SIGINT: Closing MongoDB connection');
      database.close();
    });
  }

  initDbSeeder() {
    database.open(() => {
      //Set NODE_ENV to 'development' and uncomment the following if to only run
      //the seeder when in dev mode
      //if (process.env.NODE_ENV === 'development') {
      //  seeder.init();
      //}
      seeder.init();
    });
  }

  initRoutes() {
    router.load(app, './controllers');

    // redirect all others to the index (HTML5 history)
    app.all('/*', (req, res) => {
      res.sendFile(__dirname + '/public/index.html');
    });
  }

}

let server = new Server();
