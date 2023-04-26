import loginTest from "./integrations/login.test";
import registerTest from "./integrations/register.test";
import tokenRefreshTest from "./integrations/tokenRefresh.test";

describe("[Authorization] Register User", registerTest);
describe("[Authorization] Login User", loginTest);
describe("[Authorization] Refresh Access Token", tokenRefreshTest);
