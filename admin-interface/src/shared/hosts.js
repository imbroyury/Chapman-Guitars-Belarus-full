const HTTP_PROTOCOL = 'http';

const LOCAL_HOST = 'localhost';
const REMOTE_HOST = 'localhost';
// TODO: actual prod IP
// const REMOTE_HOST = '178.172.195.18';

export const HTTP_PORT = 8280;

const isDevEnv = process.env.NODE_ENV === 'development';

const getUrl = (protocol, host, port) => `${protocol}://${host}:${port}`;

const getHTTPUrl = (host) => getUrl(HTTP_PROTOCOL, host, HTTP_PORT);

export const HTTP_URL = isDevEnv
  ? getHTTPUrl(LOCAL_HOST)
  : getHTTPUrl(REMOTE_HOST);
