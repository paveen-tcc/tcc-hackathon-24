'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { OrganizationChart } from 'primereact/organizationchart'
import { gt, srh, vel, pbks, csk, mi, rcb, kkr, lsg, rr, dc, tbl, sno } from './teamData.js'
import { useState, useEffect, Suspense } from 'react'
import { ArrowLeft } from 'lucide-react'
// import { Button } from '@/components/ui/button.jsx'
// import { ArrowLeft } from 'lucide-react'

const teamData: { [key: string]: any } = { gt, srh, vel, pbks, csk, mi, rcb, kkr, lsg, rr, dc, tbl, sno }

function TeamChart() {
  const searchParams = useSearchParams()
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://6501896d736d26322f5bdb28.mockapi.io/players')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const jsonData = await response.json()
        // setData(jsonData[0].points)
        // setLoading(false)
      } catch (err) {
        console.log('Error fetching data. Please try again later.')
        // setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const teamName = searchParams.get('team')
    if (teamName && teamData[teamName]) {
      setSelectedTeam(teamData[teamName].crew)
    }
  }, [searchParams])

  if (!selectedTeam) {
    return <div className="flex justify-center items-center bg-gray-200 h-screen">No team selected or invalid team name</div>
  }
  

  const nodeTemplate = (node: any) => {
    return (
      <div className="flex flex-col items-center p-2 bg-gray-200 rounded-lg w-24">
        {node.image && (
          <img
            src={node.image}
            alt={node.label}
            className="w-16 h-16 rounded-full mb-2 "
            loading="lazy"
          />
        )}
        <div className="text-center">
          <div className="font-bold">{node.label}</div>
        </div>
      </div>
    )
  }

  const handleBackClick = () => {
    router.push('/')
  }

  return (
    <div className="container mx-auto p-4 h-screen w-screen">
      <div className='flex gap-6 align-baseline'>
      <button className="bg-gray-900 rounded-md p-2 text-slate-200 cursor-pointer" onClick={handleBackClick} >
      <ArrowLeft className="mr-2 h-4 w-4 inline-block" /> <span>Back to Home</span>
      </button>
      <h1 className="text-2xl font-bold mb-4 ">Team Organization Chart</h1>
      </div>
      <div className="overflow-x-auto">
        <OrganizationChart
          value={selectedTeam}
          nodeTemplate={nodeTemplate}
          className="w-full"
        />
      </div>
    </div>
  )
}

export default function ChartWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeamChart />
    </Suspense>
  )
}
