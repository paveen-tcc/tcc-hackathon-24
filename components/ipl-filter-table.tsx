"use client"

import { useState, useMemo, useEffect, useCallback, SetStateAction } from 'react'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronUp, ChevronDown, X } from "lucide-react"
import { BarChart, Bar, PieChart, Pie, Sector, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Image from 'next/image'

type IPLTeamData = {
  IPLYear: number
  Gender: string
  StandingFlag: string
  Category: string | null
  CompetitionID: string
  TeamID: string
  TeamCode: string
  TeamName: string
  TeamLogo: string
  IsQualified: string | null
  Matches: string | number
  Wins: string | number
  Loss: string | number
  Tied: string | number
  NoResult: string | number
  Points: string | number
  Draw: string | number
  ForTeams: string
  AgainstTeam: string
  NetRunRate: string
  Quotient: string | number
  LeadBy: string | number
  Deficit: string | number
  Performance: string
}

type SortKeys = keyof IPLTeamData
type SortOrder = 'asc' | 'desc'

function sortData(data: IPLTeamData[], sortKey: any, reverse: boolean) {
  if (!sortKey) return data

  const sortedData = [...data].sort((a:any, b:any) => {
    if (a[sortKey] < b[sortKey]) return reverse ? 1 : -1
    if (a[sortKey] > b[sortKey]) return reverse ? -1 : 1
    return 0
  })

  return sortedData
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

export function IplFilterTable() {
  const [data, setData] = useState<IPLTeamData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKeys>('Points')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [filters, setFilters] = useState<{ key: SortKeys; value: string }[]>([
    { key: 'Gender', value: 'men' },
    { key: 'IPLYear', value: '2023' },
  ])
  const [selectedTeam, setSelectedTeam] = useState<string>('')
  const [activeIndex, setActiveIndex] = useState(0)

  const router = useRouter()

  const columns: SortKeys[] = [
    'TeamName', 'Matches', 'Wins', 'Loss', 'Tied', 'NoResult', 'Points', 'NetRunRate', 'ForTeams', 'AgainstTeam', 'Performance'
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://6501896d736d26322f5bdb28.mockapi.io/tables')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const jsonData = await response.json()
        setData(jsonData[0].points)
        setLoading(false)
      } catch (err) {
        setError('Error fetching data. Please try again later.')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const defaultFilters = [
      { key: 'Gender' as SortKeys, value: 'men' },
      { key: 'IPLYear' as SortKeys, value: '2023' },
    ]

    setFilters(prevFilters => {
      const updatedFilters = [...prevFilters]
      defaultFilters.forEach((defaultFilter, index) => {
        if (!updatedFilters[index] || !updatedFilters[index].value) {
          updatedFilters[index] = defaultFilter
        }
      })
      return updatedFilters
    })
  }, [])

  const filteredAndSortedData = useMemo(() => {
    let result = data
    filters.forEach(filter => {
      if (filter.value) {
        result = result.filter(item => 
          String(item[filter.key]).toLowerCase() === filter.value.toLowerCase()
        )
      }
    })
    return sortData(result, sortKey, sortOrder === 'desc')
  }, [data, filters, sortKey, sortOrder])

  useEffect(() => {
    if (filteredAndSortedData.length > 0) {
      setSelectedTeam(filteredAndSortedData[0].TeamName)
    }
  }, [filteredAndSortedData])

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
    if (index >= 2) {
      setFilters(filters.filter((_, i) => i !== index))
    }
  }

  const updateFilter = (index: number, key: SortKeys, value: string) => {
    const newFilters = [...filters]
    newFilters[index] = { key, value: value || newFilters[index].value }
    // Clear subsequent filters
    for (let i = index + 1; i < newFilters.length; i++) {
      newFilters[i].value = ''
    }
    setFilters(newFilters)
  }

  const handleRowClick = (item: IPLTeamData) => {
    console.log(item)
    router.push(`/charts?team=${(item.TeamCode).toLowerCase()}`)
  }

  const chartData = useMemo(() => {
    return filteredAndSortedData.map(item => ({
      name: item.TeamName,
      points: Number(item.Points),
    }))
  }, [filteredAndSortedData])

  const teamPerformanceData = useMemo(() => {
    const selectedTeamData = filteredAndSortedData.find(item => item.TeamName === selectedTeam)
    if (!selectedTeamData) return []
    return [
      { name: 'Wins', value: Number(selectedTeamData.Wins) },
      { name: 'Losses', value: Number(selectedTeamData.Loss) },
      { name: 'Tied', value: Number(selectedTeamData.Tied) },
      { name: 'No Result', value: Number(selectedTeamData.NoResult) },
    ]
  }, [filteredAndSortedData, selectedTeam])

  const getFilterOptions = (key: SortKeys, index: number) => {
    let filteredData = data
    for (let i = 0; i < index; i++) {
      if (filters[i].value) {
        filteredData = filteredData.filter(item => 
          String(item[filters[i].key]).toLowerCase() === filters[i].value.toLowerCase()
        )
      }
    }
    const options = Array.from(new Set(filteredData.map(item => String(item[key]))))
    return options.sort()
  }

  const onPieEnter = useCallback(
    (_: any, index: SetStateAction<number>) => {
      setActiveIndex(index)
    },
    [setActiveIndex]
  )

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center text-primary">We welcome you all to
      The Cloud Company Placement Drive - September 2024 Chapter !</h1>
      {/* <h2 className="text-2xl font-bold mb-4">IPL Team Statistics</h2> */}
      
      <div className="space-y-2 mb-4">
        {filters.map((filter, index) => (
          <div key={index} className="flex space-x-2 items-center">
            <label className="w-[100px] flex items-center font-semibold">
              {filter.key === 'IPLYear' ? 'Year' : filter.key}:
            </label>
            <Select
              value={filter.value}
              onValueChange={(value) => updateFilter(index, filter.key, value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={`Select ${filter.key === 'IPLYear' ? 'Year' : filter.key}`} />
              </SelectTrigger>
              <SelectContent>
                {getFilterOptions(filter.key, index).map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <TableHead>Logo</TableHead>
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
                <TableCell>
                  <Image src={item.TeamLogo} alt={item.TeamName} width={50} height={50} />
                </TableCell>
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
          <h2 className="text-xl font-semibold mb-4">Points Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="points" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Team Performance</h2>
          <div className="mb-4">
            <Select
              value={selectedTeam}
              onValueChange={setSelectedTeam}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Team" />
              </SelectTrigger>
              <SelectContent>
                {filteredAndSortedData.map((item) => (
                  <SelectItem key={item.TeamName} value={item.TeamName}>
                    {item.TeamName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={teamPerformanceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {teamPerformanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}