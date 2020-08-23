import Axios from "axios";
import { BASE_URL, headers } from './var'

class ChatRequest {
  static async getChatList(page) {
    let thisHeaders = {...headers}
    thisHeaders.token = localStorage.getItem("token")

    let api = BASE_URL + "/api/chat/list";
    let response = await Axios.request({
      method: "GET",
      url: api,
      headers: thisHeaders,
      params: {
        pageIndex: page
      }
    });
    let responseData = response.data;
    if (responseData.success) return responseData.data; 
    // return list 20 list with 20 latest mess
    else throw new Error(responseData.message);
  }
  static async getMessage(page, chatId) {
    let thisHeaders = {...headers}
    thisHeaders.token = localStorage.getItem("token")

    let api = BASE_URL + "/api/chat/message";
    let response = await Axios.request({
      method: "GET",
      url: api,
      headers: thisHeaders,
      params: {
        pageIndex: page,
        chatId: chatId // required
      }
    });
    let responseData = response.data;
    if (responseData.success) return responseData.data;
    // return mess of a channel
    else throw new Error(responseData.message);
  }
  static async sendMessage(mess, chatId) {
    // data must contain at lease 1 field: content
    // if send img => type = "image"
    let thisHeaders = {...headers}
    thisHeaders.token = localStorage.getItem("token")

    let api = BASE_URL + "/api/chat/message";
    let response = await Axios.request({
      method: "POST",
      url: api,
      headers: thisHeaders,
      params: {
        chatId: chatId
      },
      data: mess
    });
    let responseData = response.data;
    if (responseData.success) return responseData.data;
    else throw new Error(responseData.message);
  }
}

export default ChatRequest;
