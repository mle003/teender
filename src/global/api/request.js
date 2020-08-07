import Axios from "axios"
const BASE_URL = 'http://localhost:9000'
const headers = {
  "Content-Type": "application/json",
}
class MyRequest {
  static async login(data) {
    let api = "/api/auth/sign-in"
    let responseJson = await Axios.request({
      method: "POST",
      url: BASE_URL + api,
      headers: headers,
      data: {
        email: data.email,
        password: data.password,
      },
    })
    let response = JSON.parse(responseJson)
    if (response.success) {
      localStorage.setItem("token", JSON.stringify(res.data.accessToken))
      return response.data
    } else {
      throw new Error(response.message)
    }
  }
}

export default MyRequest