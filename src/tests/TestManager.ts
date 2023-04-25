import { HttpServer, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../app.module";

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
  }

  async afterAll() {
    await this.app.close();
  }

  //   getAccessToken(): string {
  //     return this.accessToken;
  //   }
}
