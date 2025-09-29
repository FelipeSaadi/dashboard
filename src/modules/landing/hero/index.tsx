'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

const Hero = () => {
  const [currentWord, setCurrentWord] = useState(0)

  const words = [
    'Composable DeFi Strategies',
    'Real-Time AI Analytics',
    'Specialized Crypto Agents',
    'Cross-Chain AI Automation',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <div className="relative flex flex-col items-center justify-center h-full mt-32">
      <h1 className="text-4xl lg:text-5xl 2xl:text-6xl text-landing-title w-[90%] md:w-full md:max-w-[1200px] mx-auto px-4 md:px-0">
        <span className="flex flex-col items-center gap-5 text-center">
          A Panoramic View of
          <span className="inline-block h-[1.2em]">
            <span key={words[currentWord]} className="inline-block animate-slideUpIn text-landing-highlight">
              {words[currentWord]}
            </span>
          </span>
          <div className="flex mx-auto w-fit h-8 mt-6" />
        </span>
      </h1>
      <span className="text-landing-text text-xl mx-auto text-center w-[90%] md:max-w-[600px] mt-4 lg:mt-0">
        Fusing multi-chain data pipelines with AI reasoning frameworks to empower decentralized, composable financial automation.
      </span>

      <div className="flex mx-auto w-fit mt-8 z-50">
        <Button className="min-w-[180px] h-14 rounded-[30px] hover:bg-gray-100">Launch App</Button>
      </div>
    </div>
  )
}

export default Hero

