import { Input } from 'antd'
import { FC } from 'react'

interface SearchTaskProps {
  onSearch: (value: string) => void
}

const SearchTask: FC<SearchTaskProps> = ({ onSearch }) => {
  return (
    <Input placeholder='Search tasks...' onChange={(e) => onSearch(e.target.value)} style={{ marginBottom: '20px' }} />
  )
}

export default SearchTask
