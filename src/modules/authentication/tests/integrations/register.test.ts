import gql from "graphql-tag";
import request from "supertest-graphql";
import { defaultUser, testUser } from "../../../../tests/stubs/user.stub";
import { User } from "../../../user/models/user.model";
import { JwtTokens } from "../../types/jwtToken.type";

export default function registerTest() {
  describe("given that user does not already exists", () => {
    describe("when register mutation is executed", () => {
      let token: string;

      beforeAll(async () => {
        const response = await request<{ register: JwtTokens }>(
          global.httpServer
        )
          .mutate(
            gql(`
        mutation Register($input: RegisterInput!) {
            register(input: $input) {
              refreshToken
              accessToken
            }
          }
          `)
          )
          .variables({
            input: testUser,
          })
          .expectNoErrors();

        token = response.data.register.accessToken;
      });

      test("should return exact user's profile using token from register mutation", async () => {
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

        expect(response.data.userProfile.email).toBe(testUser.email);
      });
    });
  });

  describe("given that user already exists in database", () => {
    describe("when register mutation is executed for default user", () => {
      test("should fail to mutate with validation error", async () => {
        const response = await request<{ register: JwtTokens }>(
          global.httpServer
        )
          .mutate(
            gql(`
        mutation Register($input: RegisterInput!) {
            register(input: $input) {
              refreshToken
              accessToken
            }
          }
          `)
          )
          .variables({
            input: defaultUser,
          });

        expect(response?.data?.register).toBeUndefined();
        expect(response?.errors?.length).toBeGreaterThan(0);
      });
    });

    describe("when register mutation is executed for user registered earlier", () => {
      test("should fail to mutate with validation error", async () => {
        const response = await request<{ register: JwtTokens }>(
          global.httpServer
        )
          .mutate(
            gql(`
        mutation Register($input: RegisterInput!) {
            register(input: $input) {
              refreshToken
              accessToken
            }
          }
          `)
          )
          .variables({
            input: testUser,
          });

        expect(response?.data?.register).toBeUndefined();
        expect(response?.errors?.length).toBeGreaterThan(0);
      });
    });
  });
}
