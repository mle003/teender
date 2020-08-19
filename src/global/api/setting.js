import Axios from "axios";
import { BASE_URL, headers } from './var'

class SettingRequest {
  static async resetPassword(oldPw, newPw) {
    let thisHeaders = {...headers}
    thisHeaders.token = localStorage.getItem("token")
    
    let api = BASE_URL + "/api/reset-password";
    let response = await Axios.request({
      method: "PUT",
      url: api,
      headers: thisHeaders,
      data: {
        "old_password": oldPw,
        "new_password": newPw
      }
    });
    console.log('reset pw', response)
    let responseData = response.data;
    if (responseData.success) return responseData.data;
    else throw new Error(responseData.message);
  }
}

export default SettingRequest;
