import Axios from "axios";
const BASE_URL = "http://localhost:9000";
const headers = {
  "Content-Type": "application/json",
};
class MyRequest {
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
    headers.token = token
    let api = BASE_URL + "/api/auth/check-user";
    let response = await Axios.request({
      method: "GET",
      url: api,
      headers: headers,
    });
    let responseData = response.data;
    if (responseData.success) return responseData.data;
    else throw new Error(responseData.message);

  }
  static async getCards(page) {
    headers.token = localStorage.getItem("token")
    let api = BASE_URL + "/api/cards";
    let response = await Axios.request({
      method: "GET",
      url: api,
      headers: headers,
      params: {
        pageIndex: page
      }
    });
    let responseData = response.data;
    if (responseData.success) return responseData.data;
    else throw new Error(responseData.message);
  }
}

// class MyRequest {
//   static async login(data) {
//     let api = BASE_URL + "/api/auth/sign-in";
//     let body = {
//       email: data.email,
//       password: data.password,
//     };
//     let response = await Axios.request({
//       method: "POST",
//       url: api,
//       headers: headers,
//       data: body,
//     })
//       .then((res) => {
//         console.log(res.data);
//       })
//       .catch((err) => {
//         console.log(err.response.data.message);
//       });
//   }
// }

export default MyRequest;
