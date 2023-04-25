import gql from "graphql-tag";
import request from "supertest-graphql";
import { TestManager } from "../../../../tests/TestManager";
import { defaultUser, testUser } from "../../../../tests/stubs/user.stub";
import { User } from "../../../user/models/user.model";
import { JwtTokens } from "../../types/jwtToken.type";

describe("[Authorization] Register User", () => {
  const testManager = new TestManager();

  beforeAll(async () => {
    await testManager.beforeAll();
  });

  afterAll(async () => {
    await testManager.afterAll();
  });

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
        const user = await User.findOneBy({ email: testUser.email });

        expect(user).toBeDefined();
        expect(user?.email).toBe(testUser.email);
      });
    });
  });

  describe("given that user already exists in database", () => {
    describe("when register mutation is executed for default user", () => {
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
            input: defaultUser,
          });

        expect(response?.data?.register).toBeUndefined();
        expect(response?.errors?.length).toBeGreaterThan(0);
      });
    });

    describe("when register mutation is executed for user registered earlier", () => {
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
