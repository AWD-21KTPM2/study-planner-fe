import { AnalyzeTaskDTO } from '@/types/ai-generate.type'

import axiosClient from '../axios-client.util'

export const analyzeTaskByAI = async (authSession: string | null): Promise<AnalyzeTaskDTO[]> => {
  try {
    const response = await axiosClient.get('ai-generate/tasks/analyze', {
      headers: {
        Authorization: `Bearer ${authSession}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error(`Error while logging in with Google: ${error}`)
  }
}
