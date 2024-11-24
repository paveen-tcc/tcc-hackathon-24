"use client"
import { IplFilterTable } from "@/components/ipl-filter-table";
import { useEffect, useState } from "react";

export default function Home() {
  const [data,setData]=useState<any>()

  // async function getData() {
  //   const url = "https://www.mockachino.com/5db99bd2-28c5-46/ipl/table";
  //   try {
  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error(`Response status: ${response.status}`);
  //     }
  //     const json = await response.json();
  //     setData(json)
  //     console.log(json);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // useEffect(()=>{
  //   getData()
  // },[])

  return (
    <>
    <IplFilterTable/> 
    </>
  );
}
