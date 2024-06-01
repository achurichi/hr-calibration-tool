/**
 * Converts a Blob URL to a Blob object.
 *
 * @param {string} blobUrl - The URL of the blob to convert.
 * @returns {Promise<Blob>} A promise that resolves to the Blob object.
 */
export const blobUrlToBlobObject = (blobUrl) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = (error) => reject(error);
    xhr.open("GET", blobUrl);
    xhr.send();
  });
};

/**
 * Converts a Blob object to a Base64 string.
 *
 * @param {Blob} blobObject - The Blob object to convert.
 * @returns {Promise<string>} A promise that resolves to the Base64 string representation of the Blob object.
 */
export const blobObjectToBase64String = (blobObject) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blobObject);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Converts a Blob URL to a Base64 string.
 *
 * @param {string} blobUrl - The URL of the blob to convert.
 * @returns {Promise<string>} A promise that resolves to the Base64 string representation of the Blob URL.
 */
export const blobUrlToBase64String = async (blobUrl) => {
  const blobObject = await blobUrlToBlobObject(blobUrl);
  return await blobObjectToBase64String(blobObject);
};
