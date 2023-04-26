import gql from "graphql-tag";
import request from "supertest-graphql";
import { defaultUser } from "../../../../tests/stubs/user.stub";
import { User } from "../../../user/models/user.model";
import { JwtTokens } from "../../types/jwtToken.type";

export default function tokenRefreshTest() {
  describe("given that user already exists", () => {
    describe("when login mutation is executed", () => {
      let refreshToken: string;
      let token: string;

      beforeAll(async () => {
        const response = await request<{ login: JwtTokens }>(global.httpServer)
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

        expect(response?.data?.login?.refreshToken).toBeDefined();
        refreshToken = response?.data?.login?.refreshToken;
      });

      test("should return new access token by using refresh token from login mutation", async () => {
        const response = await request<{ refreshAccessToken: string }>(
          global.httpServer
        )
          .mutate(
            gql(`
              mutation RefreshAccessToken($refreshToken: String!) {
                refreshAccessToken(refreshToken: $refreshToken)
              }
            `)
          )
          .variables({ refreshToken })
          .expectNoErrors();

        expect(response.data.refreshAccessToken).toBeDefined();
        token = response.data.refreshAccessToken;
      });

      test("should return exact user's profile using token from refresh mutation", async () => {
        const response = await request<{ userProfile: User }>(global.httpServer)
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
}
