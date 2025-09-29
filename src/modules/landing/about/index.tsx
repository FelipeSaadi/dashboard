const About = () => {
  return (
    <div id="about" className="relative w-full grid grid-cols-1 lg:grid-cols-2 items-center mt-24 md:mt-40 lg:mt-56">
      <div className="absolute hidden lg:block w-[1px] h-full bg-landing-border left-1/2 top-0" />

      <div className="relative flex flex-col items-center text-center gap-6 xl:gap-10 pt-10 md:pt-14 lg:pt-16 mt-12 md:mt-24 lg:mt-32 pb-0 px-6 justify-self-center">
        <h2 className="text-landing-title leading-tight max-w-3xl mx-auto text-2xl md:text-3xl lg:text-4xl">
          <span className="text-landing-highlight">Agentic Economy</span> Engineered through Academic Alliances.
        </h2>

        <p className="text-landing-text max-w-3xl mx-auto text-base md:text-lg lg:text-xl">
          Panorama Block is built on rigorous cryptoeconomic and decentralized systems research from UCLA and leading Brazilian universities, creating a
          <span className="text-landing-highlight"> protocol-agnostic agentic framework for Web3</span>, where
          <span className="text-landing-highlight"> modular AI agents</span> intelligently learn, adjust, and deploy actions on-chain. We’re a globally distributed team based in the US, South America, and Switzerland.
        </p>
      </div>

      <div className="flex items-center justify-center pt-10 md:pt-14 lg:pt-16 pb-0 px-6 justify-self-center">
        <img
          src="/landing/map.png"
          alt="Global presence map"
          className="w-full max-w-[1000px] h-auto object-contain"
        />
      </div>
    </div>
  )
}

export default About
