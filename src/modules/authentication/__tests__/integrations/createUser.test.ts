import { TestManager } from "../../../../tests/TestManager";

describe("Authorization Tests", () => {
  const testManager = new TestManager();

  beforeAll(async () => {
    await testManager.beforeAll();
  });

  afterAll(async () => {
    await testManager.afterAll();
  });

  it("ok", () => {
    expect(1).toBe(1);
  });
});
