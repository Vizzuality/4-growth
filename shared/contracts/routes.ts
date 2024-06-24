type RouteHandler = {
  path: string;
  getRoute: () => string;
};

type RouteConfig = {
  controller: string;
  handlers: Record<string, RouteHandler>;
};

type RouteKeys = 'auth' | 'users';

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
  users: {
    controller: '/users/',
    handlers: {
      me: createRouteHandler('/users', '/me'),
      createUser: createRouteHandler('/users', '/'),
      getUsers: createRouteHandler('/users', '/'),
      getUser: createRouteHandler('/users', '/:id'),
      updateUser: createRouteHandler('/users', '/:id'),
      deleteUser: createRouteHandler('/users', '/:id'),
      updatePassword: createRouteHandler('/users', '/me/password'),
    },
  },
};
