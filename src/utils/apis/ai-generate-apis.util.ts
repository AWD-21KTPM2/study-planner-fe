import { AnalyzeTaskDTO } from '@/types/ai-generate.type'

import axiosClient from '../axios-client.util'

export const analyzeTaskByAI = async (): Promise<AnalyzeTaskDTO[]> => {
  try {
    const response = await axiosClient.get('ai-generate/tasks/analyze')
    return response.data
  } catch (error) {
    throw new Error(`Error while analyze with AI: ${error}`)
  }
}

export const generateFeedback = async (): Promise<string> => {
  try {
    const response = await axiosClient.get('ai-generate/feedback/generate')
    console.log('response.data', response.data)
    return response.data
  } catch (error) {
    throw new Error(`Error while generating with AI: ${error}`)
  }
}
