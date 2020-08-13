import Axios from "axios";
const BASE_URL = "http://localhost:9000";
const headers = {
  "Content-Type": "application/json",
};
class MyRequest {
  static async login(data) {
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
    if (response.status >= 200 && response.status <= 300) {
      console.log("asd", response);
      let responseData = response.data;
      if (responseData.success) return responseData.data;
      else throw new Error(responseData.message);
    } else {
      console.log(response.data.message);
    }
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
