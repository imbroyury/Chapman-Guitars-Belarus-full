import { URLS, SERVER_TYPE_ENUM } from '../shared/hosts';

const getImageUrl = (imageName) => `${URLS[SERVER_TYPE_ENUM.proxy]}/uploads/${imageName}`;

export default getImageUrl;