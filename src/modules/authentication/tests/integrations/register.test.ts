import gql from "graphql-tag";
import request from "supertest-graphql";
import { TestManager } from "../../../../tests/TestManager";
import { User } from "../../../user/models/user.model";
import { JwtTokens } from "../../types/jwtToken.type";
import { testUser } from "../../../../tests/stubs/user.stub";

describe("[Authorization] Register User", () => {
  const testManager = new TestManager();

  beforeAll(() => testManager.beforeAll());

  afterAll(() => testManager.afterAll());

  describe("given that user does not already exists", () => {
    describe("when register mutation is executed", () => {
      let token: string;

      beforeAll(async () => {
        const response = await request<{ register: JwtTokens }>(
          testManager.httpServer
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

        expect(response.data.userProfile.email).toBe(testUser.email);
      });

      test("should user exist in database entry", async () => {
        const user = await User.findBy({ email: testUser.email });

        expect(user).toBeDefined();
      });
    });
  });

  describe("given that user already exists", () => {
    describe("when register mutation is executed", () => {
      test("should fail to mutate with validation error", async () => {
        const response = await request<{ register: JwtTokens }>(
          testManager.httpServer
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
});
