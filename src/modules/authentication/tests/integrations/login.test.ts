import gql from "graphql-tag";
import request from "supertest-graphql";
import { TestManager } from "../../../../tests/TestManager";
import { defaultUser } from "../../../../tests/stubs/user.stub";
import { User } from "../../../user/models/user.model";
import { JwtTokens } from "../../types/jwtToken.type";

describe("[Authorization] Login User", () => {
  const testManager = new TestManager();

  beforeAll(() => testManager.beforeAll());

  afterAll(() => testManager.afterAll());

  describe("given that user already exists", () => {
    describe("when login mutation is executed", () => {
      let token: string;

      beforeAll(async () => {
        const response = await request<{ login: JwtTokens }>(
          testManager.httpServer
        )
          .mutate(
            gql(`
              mutation Login($input: LoginInput!) {
                login(input: $input) {
                  refreshToken
                  accessToken
                }
              }
          `)
          )
          .variables({
            input: defaultUser,
          })
          .expectNoErrors();

        token = response.data.login.accessToken;
      });

      test("should return exact user's profile using token from register mutation", async () => {
        const response = await request<{ userProfile: User }>(
          testManager.httpServer
        )
          .mutate(
            gql(`
              query UserProfile {
                  userProfile {
                    email
                    dateJoined
                    id
                    isActive
                  }
                }
            `)
          )
          .set({
            Authorization: `Bearer ${token}`,
          })
          .expectNoErrors();

        expect(response.data.userProfile.email).toBe(defaultUser.email);
      });
    });
  });
});
