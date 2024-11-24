"use client"

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronUp, ChevronDown, X } from "lucide-react"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const initialData = [
  { id: 1, name: "John Doe", age: 30, city: "New York", occupation: "Engineer" },
  { id: 2, name: "Jane Smith", age: 25, city: "Los Angeles", occupation: "Designer" },
  { id: 3, name: "Bob Johnson", age: 35, city: "Chicago", occupation: "Manager" },
  { id: 4, name: "Alice Brown", age: 28, city: "Houston", occupation: "Teacher" },
  { id: 5, name: "Charlie Wilson", age: 40, city: "Phoenix", occupation: "Doctor" },
]

type DataItem = typeof initialData[0]
type SortKeys = keyof DataItem
type SortOrder = 'asc' | 'desc'

function sortData(data: DataItem[], sortKey: SortKeys, reverse: boolean) {
  if (!sortKey) return data

  const sortedData = [...data].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return reverse ? 1 : -1
    if (a[sortKey] > b[sortKey]) return reverse ? -1 : 1
    return 0
  })

  return sortedData
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function DynamicFilterTableComponent() {
  const [data] = useState(initialData)
  const [sortKey, setSortKey] = useState<SortKeys>('id')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [filters, setFilters] = useState<{ key: SortKeys; value: string }[]>([
    { key: 'name', value: '' },
    { key: 'age', value: '' },
  ])

  const router = useRouter()

  const columns = Object.keys(data[0]) as SortKeys[]

  const handleSort = (key: SortKeys) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const addFilter = () => {
    const availableColumns = columns.filter(column => 
      !filters.some(filter => filter.key === column)
    )
    if (availableColumns.length > 0) {
      setFilters([...filters, { key: availableColumns[0], value: '' }])
    }
  }

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index))
  }

  const updateFilter = (index: number, key: SortKeys, value: string) => {
    const newFilters = [...filters]
    newFilters[index] = { key, value }
    setFilters(newFilters)
  }

  const filteredAndSortedData = useMemo(() => {
    let result = data
    filters.forEach(filter => {
      result = result.filter(item => 
        String(item[filter.key]).toLowerCase().includes(filter.value.toLowerCase())
      )
    })
    return sortData(result, sortKey, sortOrder === 'desc')
  }, [data, filters, sortKey, sortOrder])

  const handleRowClick = (item: DataItem) => {
    router.push(`/charts?data=${encodeURIComponent(JSON.stringify(item))}`)
  }

  const ageData = filteredAndSortedData.map(item => ({
    name: item.name,
    age: item.age
  }))

  const occupationData = Object.entries(
    filteredAndSortedData.reduce((acc, item) => {
      acc[item.occupation] = (acc[item.occupation] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dynamic Filter Table</h1>
      <div className="space-y-2 mb-4">
        {filters.map((filter, index) => (
          <div key={index} className="flex space-x-2">
            <Select
              value={filter.key}
              onValueChange={(value) => updateFilter(index, value as SortKeys, filter.value)}
              disabled={index < 2}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Filter value"
              value={filter.value}
              onChange={(e) => updateFilter(index, filter.key, e.target.value)}
            />
            {index >= 2 && (
              <Button variant="outline" size="icon" onClick={() => removeFilter(index)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <div className="mb-4">
        <Button onClick={addFilter}>Add Filter</Button>
      </div>
      <div className="overflow-x-auto mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column}
                  className="cursor-pointer"
                  onClick={() => handleSort(column)}
                >
                  {column}
                  {sortKey === column && (
                    sortOrder === 'asc' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.map((item, index) => (
              <TableRow key={index} onClick={() => handleRowClick(item)} className="cursor-pointer hover:bg-gray-100">
                {columns.map((column) => (
                  <TableCell key={column}>{String(item[column])}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Age Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="age" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Occupation Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={occupationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {occupationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}