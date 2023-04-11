import { APP_GUARD } from "@nestjs/core";
import { AuthGuardService } from "../service/authGuard.service";

export const AuthGuardProvider = {
  provide: APP_GUARD,
  useClass: AuthGuardService,
};
