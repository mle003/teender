import Axios from "axios";
const BASE_URL = "http://localhost:9000";
const headers = {
  "Content-Type": "application/json",
};

class OtherRequest {
  static async uploadImage(base64Code) {

    const api = BASE_URL + '/api/upload-image';

    let response = await Axios.request({
      method: "POST",
      url: api,
      headers: headers,
      data: {
        source: base64Code
      }
    });

    console.log("upload image", response);
    let responseData = response.data;
    if (responseData.success) return responseData.data;
    else throw new Error(responseData.message);
  }
}

export default OtherRequest;