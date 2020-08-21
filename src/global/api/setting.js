import Axios from "axios";
import { BASE_URL, headers } from './var'
import {UserInfo} from "../model/user";

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
        "oldPassword": oldPw,
        "newPassword": newPw
      }
    });
    console.log('reset pw', response)
    let responseData = response.data;
    if (responseData.success) return responseData.data;
    else throw new Error(responseData.message);
  }

  static async updateProfile(data) {
    // data (7 fields): email, name, gender, interest, birthdate, imgUrl, desc
    // let userInfo = new UserInfo(data)
    let thisHeaders = {...headers}
    thisHeaders.token = localStorage.getItem("token")
    
    let api = BASE_URL + "/api/update-profile";
    let response = await Axios.request({
      method: "PUT",
      url: api,
      headers: thisHeaders,
      data: data
    });

    console.log('update profile', response)
    let responseData = response.data;
    if (responseData.success) return responseData.data;
    else throw new Error(responseData.message);
  }
}

export default SettingRequest;
