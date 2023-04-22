export function getImage(fileName) {
    // default image
    if (fileName == null) {
        return 'https://www.magikcommerce.com/wp-content/themes/magik/images/default-image.jpg';
    }
    return `${process.env.REACT_APP_BASE_URL_FIREBASE}${fileName}?alt=media`;
}
