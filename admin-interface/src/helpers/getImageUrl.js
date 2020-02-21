import { HTTP_URL } from '../shared/hosts';

const getImageUrl = (imageName) => `${HTTP_URL}/uploads/${imageName}`;

export default getImageUrl;