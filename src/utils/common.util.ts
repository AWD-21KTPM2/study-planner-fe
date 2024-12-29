export function roundDecimalPercent(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Division by zero is not allowed.')
  }
  return Math.round((a / b) * 100)
}

export function formatAIGenerateFeedback(feedback: string): string {
  return feedback
    .replace(/\*\*([^*]+?)\*\*\n/g, "<h3 class='!text-base !font-bold !text-rose-700 !mt-2'>$1</h3>")
    .replace(/\* \*\*([^*]+?)\*\*/g, "<h4 class='!text-base !font-bold mt-2'>$1</h4>") // Replace **text** with <h4>
    .replace(/\*/g, '') // Remove stray * characters // Close the div for each point
}
