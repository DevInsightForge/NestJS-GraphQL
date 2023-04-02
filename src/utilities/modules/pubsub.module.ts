import { Global, Module } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";

@Global()
@Module({
  providers: [
    {
      provide: PubSub,
      useClass: PubSub,
      // useValue: new PubSub(),
      // useFactory: () => {
      //  return new PubSub();
      // }
    },
  ],
  exports: [PubSub],
})
export default class PubSubModule {}
