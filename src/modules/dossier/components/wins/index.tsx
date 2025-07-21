const wins = [
  {
    name: "ICP",
    img: "coins/icp.png"
  },
  {
    name: "XRPL",
    img: "partners/xrp.png"
  },
  {
    name: "AVAX",
    img: "coins/avax.png"
  },
  {
    name: "Chainlink",
    img: "partners/chainlink.png"
  }
]

export const Wins = () => {
  return (
    <section>
      <div className="flex w-full">
        <div className="bg-black w-1/2 rounded-l-lg">
          <ul className="flex flex-col text-white p-6">
            <li className="list-disc list-inside">3x Global Hackathon Winners</li>
            <li className="list-disc list-inside">ICP: Brazil, Vietnam, and Mexico</li>
            <li className="list-disc list-inside">Winners of the XRP Ledger LATAM Hackathon</li>
            <li className="list-disc list-inside">Grantees of the Avalanche Infrabuild AI Program</li>
            <li className="list-disc list-inside">Winners of the AVAX Summit Hackathon in the On-Chain Finance category for Chainlink</li>
          </ul>
        </div>
        <div className="flex bg-white w-1/2 rounded-r-lg">
          {wins.map((win) => (
            <div key={win.name} className="flex flex-1 items-center justify-center border border-black px-4">
              <img src={win.img} alt={win.name} className="my-auto w-12 "/>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}