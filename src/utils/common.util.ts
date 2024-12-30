export function roundPercentForUserProgress(specificTask: number, totalTask: number): number {
  if (totalTask === 0) {
    return 0
  }
  return Math.round((specificTask / totalTask) * 100)
}

export function formatAIGenerateFeedback(feedback: string): string {
  return feedback
    .replace(/\*\*([^*]+?)\*\*\n/g, "<h3 class='!text-base !font-bold !text-rose-700 !mt-2'>$1</h3>")
    .replace(/\* \*\*([^*]+?)\*\*/g, "<h4 class='!text-base !font-bold mt-2'>$1</h4>") // Replace **text** with <h4>
    .replace(/\*/g, '') // Remove stray * characters // Close the div for each point
}
