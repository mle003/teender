import Axios from "axios";
import { BASE_URL, headers } from './var'

class AuthRequest {
  static async signUp(data) {
    let api = BASE_URL + "/api/auth/sign-up";
    let response = await Axios.request({
      method: "POST",
      url: api,
      headers: headers,
      data: data,
    });
    console.log("sign up", response);
    let responseData = response.data;
    if (responseData.success) return responseData.data;
    else throw new Error(responseData.message);
  }
  static async signIn(data) {
    let api = BASE_URL + "/api/auth/sign-in";
    let body = {
      email: data.email,
      password: data.password,
    };
    let response = await Axios.request({
      method: "POST",
      url: api,
      headers: headers,
      data: body,
    });
    console.log("sign in", response);
    let responseData = response.data;
    if (responseData.success) return responseData.data;
    else throw new Error(responseData.message);
  }
  static async checkUser(token) {
    let thisHeaders = {...headers}
    thisHeaders.token = token

    let api = BASE_URL + "/api/auth/check-user";
    let response = await Axios.request({
      method: "GET",
      url: api,
      headers: thisHeaders,
    });
    let responseData = response.data;
    if (responseData.success) return responseData.data;
    else throw new Error(responseData.message);

  }
}

export default AuthRequest;
