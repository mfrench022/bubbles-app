/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(main)` | `/(main)/` | `/_sitemap` | `/add-contact` | `/add-contact/` | `/add-contact/bubble-tap` | `/add-contact/cloud` | `/add-contact/manual` | `/add-contact/paste` | `/add-contact/photo` | `/profile`;
      DynamicRoutes: `/bubble/${Router.SingleRoutePart<T>}` | `/contact/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/bubble/[id]` | `/contact/[id]`;
    }
  }
}
