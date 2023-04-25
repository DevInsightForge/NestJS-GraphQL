import { HttpServer, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { AuthenticationService } from "../modules/authentication/authentication.service";
import { defaultUser } from "./stubs/user.stub";

export class TestManager {
  public httpServer: HttpServer;

  private app: INestApplication;

  async beforeAll(): Promise<void> {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleRef.createNestApplication();

    await this.app.init();

    this.httpServer = this.app.getHttpServer() as HttpServer;

    // keep a default user for test purpose
    const authService = moduleRef.get<AuthenticationService>(
      AuthenticationService
    );
    await authService.userRegister(defaultUser);
  }

  async afterAll() {
    await this.app.close();
  }
}
