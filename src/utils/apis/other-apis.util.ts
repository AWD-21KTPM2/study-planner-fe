import message from 'antd/es/message'
import axios, { AxiosError } from 'axios'

import { ErrorType } from '@/types/error.type'
import { CountryData } from '@/types/other.type'

export const getCountryDataApi = async (): Promise<CountryData[]> => {
  try {
    const response = await axios.get(`https://countriesnow.space/api/v0.1/countries/positions`)
    return response.data.data.map((item: any) => ({ name: item.name, code: item.iso2 }) as CountryData)
  } catch (error) {
    const errorData = (error as AxiosError<ErrorType>).response?.data.detail
    console.log('errorData', errorData)
    message.error(errorData)
    throw new Error(errorData)
  }
}
