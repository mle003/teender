import Axios from "axios";
import { BASE_URL, headers } from "./var";

class UserRequest {
  static async getCards(page) {
    let thisHeaders = { ...headers };
    thisHeaders.token = localStorage.getItem("token");

    let api = BASE_URL + "/api/cards";
    let response = await Axios.request({
      method: "GET",
      url: api,
      headers: thisHeaders,
      params: {
        pageIndex: page,
      },
    });
    let responseData = response.data;
    if (responseData.success) return responseData.data;
    else throw new Error(responseData.message);
  }

  static async getMatch(page) {
    let thisHeaders = { ...headers };
    thisHeaders.token = localStorage.getItem("token");

    let api = BASE_URL + "/api/match";
    let response = await Axios.request({
      method: "GET",
      url: api,
      headers: thisHeaders,
      params: {
        pageIndex: page,
      },
    });
    let responseData = response.data;
    if (responseData.success) return responseData.data;
    else throw new Error(responseData.message);
  }

  static async handleLike(id, type) {
    let thisHeaders = { ...headers };
    thisHeaders.token = localStorage.getItem("token");
    let api = BASE_URL + "/api/like-unlike";
    let response = await Axios.request({
      method: "POST",
      url: api,
      headers: thisHeaders,
      data: {
        _id: id,
        status: type,
      },
    });
    let responseData = response.data;
    if (responseData.success) return responseData.data;
    else throw new Error(responseData.message);
  }
}

export default UserRequest;
