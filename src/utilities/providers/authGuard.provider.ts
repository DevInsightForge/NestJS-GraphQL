import { APP_GUARD } from "@nestjs/core";
import AuthGuardService from "../service/authGuard.service";

const AuthGuardProvider = {
  provide: APP_GUARD,
  useClass: AuthGuardService,
};

export default AuthGuardProvider;
