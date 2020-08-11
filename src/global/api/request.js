import Axios from "axios"
import User from "../model/user"
const BASE_URL = 'http://localhost:9000'
const headers = {
  "Content-Type": "application/json",
}
class MyRequest {
  static async signIn(data) {
    let api = BASE_URL + "/api/auth/sign-in"
    let body = {
      email: data.email,
      password: data.password,
    }
    let response = await Axios.request({
      method: "POST",
      url: api,
      headers: headers,
      data: body,
    })
    if (response.status >= 200 && response.status <= 300 ) {
      let responseData = response.data
      if (responseData.success) 
        return responseData.data
      else 
        throw new Error(responseData.message)
    } else {
      throw new Error(response.statusText)
    }
  }

  static async getCards(pageIndex) {
    let api = BASE_URL + "/api/cards?pageIndex="+`${pageIndex}`
    headers.token = '' // demo token here
    let response = await Axios.request({
      method: "GET",
      url: api,
      headers: headers,
    })
    if (response.status >= 200 && response.status <= 300 ) {
      let responseData = response.data
      if (responseData.success) 
        return responseData.data.map(item => new User(item))
      else 
        throw new Error(responseData.message)
    } else {
      throw new Error(response.statusText)
    }
  }
}

export default MyRequest