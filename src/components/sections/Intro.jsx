import { useState, useEffect } from 'react'
import ScrollySection from '../layout/ScrollySection'
import ChessToChart from '../viz/ChessToChart'

export default function Intro() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/data/games_per_month.json')
      .then(r => r.json())
      .then(setData)
  }, [])

  const steps = [
    <div>
      <div className="intro-eyebrow">A Data Story</div>
      <h1>The Infinite Game</h1>
      <p className="intro-subtitle">
        Chess has been played for over 1,500 years. There are more possibilities in a game of chess than there are atoms in the observable universe.
      </p>
        <div className="scroll-hint">Scroll to explore ↓</div>
    </div>,
    <div>
      <h2>LiChess</h2>
      <p>
        For most of chess history, games were only preserved if someone thought they mattered. 
        Master games were recorded by hand, published in newspapers, magazines, or tournament books, while the vast majority of casual games vanished immediately
        after they were played. Even later, building large collections of games still meant manually copying notation from physical score sheets into databases.
      </p>
      <p>
        This meant that the vast majority of chess games from history were lost, preserved only in the memories of players or in the pages of old publications.
        Computers and the internet changed that completely. Online chess platforms began automatically recording every move of every game,
        creating massive searchable archives instead of isolated famous matches. Lichess is one of the largest examples of this shift. It is free, open source, and crucially, open data. Every rated game ever played on the platform is publicly available for download. The full database spans over 7.7 billion games dating back to 2013.
      </p>
      <blockquote className="intro-quote">
        "Chess is the art of analysis."
        <cite>— Mikhail Botvinnik</cite>
      </blockquote>
    </div>,
    <div>
      <h2>Explosive Growth</h2>
      <p>
        In January 2013, around 120,000 games were played. During Covid that number soared to over 90 million per month and never came back down.
      </p>
    </div>,
  ]

  return (
    <section id="intro">
      <ScrollySection
        steps={steps}
        renderViz={(step) => <ChessToChart step={step} data={data} />}
      />
    </section>
  )
}