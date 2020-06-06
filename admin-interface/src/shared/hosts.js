const HTTP_PROTOCOL = 'http';

const LOCAL_HOST = 'localhost';
const REMOTE_HOST = '161.35.16.69';

export const EXPRESS_HTTP_PORT = 8280;

const NGINX_HTTP_PORT = 80;

const isDevEnv = process.env.NODE_ENV === 'development';

const getUrl = (protocol, host, port) => `${protocol}://${host}:${port}`;

const getHTTPUrl = (host) => getUrl(HTTP_PROTOCOL, host, NGINX_HTTP_PORT);

export const HTTP_URL = isDevEnv
  ? getHTTPUrl(LOCAL_HOST)
  : getHTTPUrl(REMOTE_HOST);
