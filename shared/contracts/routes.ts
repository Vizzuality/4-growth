type RouteHandler = {
  path: string;
  getRoute: () => string;
};

type RouteConfig = {
  controller: string;
  handlers: Record<string, RouteHandler>;
};

type RouteKeys = 'auth';

const createRouteHandler = (
  controller: string,
  handlerPath: string,
): RouteHandler => ({
  path: handlerPath,
  getRoute: () => `${controller}${handlerPath}`,
});

export const API_ROUTES: Record<RouteKeys, RouteConfig> = {
  auth: {
    controller: '/auth/',
    handlers: {
      signUp: createRouteHandler('/auth', '/sign-up'),
      signIn: createRouteHandler('/auth', '/sign-in'),
    },
  },
};
