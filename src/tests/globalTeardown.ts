const teardown = async () => {
  await global.nestApp.close();
};

export default teardown;
