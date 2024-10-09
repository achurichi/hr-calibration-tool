import { REQUESTS } from "@/apis/utils";

export const REQUEST_IDS = {
  GET_IMAGE_BY_ID: "GET_IMAGE_BY_ID",
  SAVE_IMAGE: "SAVE_IMAGE",
};

class ImagesApi {
  get base() {
    return "/images";
  }

  async getById(id) {
    const { data } = await REQUESTS.get(
      REQUEST_IDS.GET_IMAGE_BY_ID,
      `${this.base}?id=${id}`,
    );
    return data || null;
  }

  async save(base64) {
    const { data } = await REQUESTS.post(REQUEST_IDS.SAVE_IMAGE, this.base, {
      base64,
    });
    return data || null;
  }
}

export default ImagesApi;
