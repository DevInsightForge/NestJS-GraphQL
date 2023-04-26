import { HttpServer, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { AuthenticationService } from "../modules/authentication/authentication.service";
import { defaultUser } from "./stubs/user.stub";

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var moduleRef: TestingModule;
  // eslint-disable-next-line vars-on-top, no-var
  var nestApp: INestApplication;
  // eslint-disable-next-line vars-on-top, no-var
  var httpServer: HttpServer;
}

const setup = async () => {
  global.moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  global.nestApp = moduleRef.createNestApplication();
  await nestApp.init();

  global.httpServer = nestApp.getHttpServer() as HttpServer;

  // keep a default user for test purpose
  const authService = moduleRef.get<AuthenticationService>(
    AuthenticationService
  );
  await authService.userRegister(defaultUser);
};

export default setup;
