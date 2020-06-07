const ENV_ENUM = {
  development: 'development',
  production: 'production',
};

export const SERVER_TYPE_ENUM = {
  express: 'express',
  proxy: 'proxy',
};

const ENV_TO_PORTS_MAP = {
  [ENV_ENUM.development]: {
    [SERVER_TYPE_ENUM.express]: 8280,
    [SERVER_TYPE_ENUM.proxy]: 80,
  },
  [ENV_ENUM.production]: {
    [SERVER_TYPE_ENUM.express]: 8280,
    [SERVER_TYPE_ENUM.proxy]: 80,
  }
};

const ENV_TO_HOSTS_MAP = {
  [ENV_ENUM.development]: {
    [SERVER_TYPE_ENUM.express]: 'http://localhost',
    [SERVER_TYPE_ENUM.proxy]: 'http://localhost',
  },
  [ENV_ENUM.production]: {
    [SERVER_TYPE_ENUM.express]: 'http://localhost',
    [SERVER_TYPE_ENUM.proxy]: 'http://161.35.16.69',
  },
};

const getUrl = (env, serverType) => `${ENV_TO_HOSTS_MAP[env][serverType]}:${ENV_TO_PORTS_MAP[env][serverType]}`;

const ENV_TO_URLS_MAP = {
  [ENV_ENUM.development]: {
    [SERVER_TYPE_ENUM.express]: getUrl(ENV_ENUM.development, SERVER_TYPE_ENUM.express),
    [SERVER_TYPE_ENUM.proxy]: getUrl(ENV_ENUM.development, SERVER_TYPE_ENUM.proxy),
  },
  [ENV_ENUM.production]: {
    [SERVER_TYPE_ENUM.express]: getUrl(ENV_ENUM.production, SERVER_TYPE_ENUM.express),
    [SERVER_TYPE_ENUM.proxy]: getUrl(ENV_ENUM.production, SERVER_TYPE_ENUM.proxy),
  }
};

export const PORTS = ENV_TO_PORTS_MAP[process.env.NODE_ENV];

export const URLS = ENV_TO_URLS_MAP[process.env.NODE_ENV];
