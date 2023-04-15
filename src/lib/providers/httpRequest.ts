import Axios from 'axios'

const axios = Axios.create({
  timeout: 5000,
})

export const request = async (options: any) => {
  try {
    const response = await axios({
      url: `${options.hostname}${options.path}`,
      headers: options.headers,
      method: options.method,
    })

    return {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
    }
  } catch (error: any) {
    if (error.response) {
      return {
        status: false,
        message: error.response.data?.message,
      }
    } else {
      throw new Error('Something went wrong. Try again.')
    }
  }
}
