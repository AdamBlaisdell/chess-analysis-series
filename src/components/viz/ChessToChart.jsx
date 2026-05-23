import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { motion, AnimatePresence } from 'framer-motion'

const LICHESS_PATH = "M38.956.5c-3.53.418-6.452.902-9.286 2.984C5.534 1.786-.692 18.533.68 29.364 3.493 50.214 31.918 55.785 41.329 41.7c-7.444 7.696-19.276 8.752-28.323 3.084S-.506 27.392 4.683 17.567C9.873 7.742 18.996 4.535 29.03 6.405c2.43-1.418 5.225-3.22 7.655-3.187l-1.694 4.86 12.752 21.37c-.439 5.654-5.459 6.112-5.459 6.112-.574-1.47-1.634-2.942-4.842-6.036-3.207-3.094-17.465-10.177-15.788-16.207-2.001 6.967 10.311 14.152 14.04 17.663 3.73 3.51 5.426 6.04 5.795 6.756 0 0 9.392-2.504 7.838-8.927L37.4 7.171z"

function Board({ step }) {
  const squares = []
  for (let ri = 0; ri < 8; ri++) {
    for (let fi = 0; fi < 8; fi++) {
      const isLight = (ri + fi) % 2 === 0
      squares.push(
        <motion.div
          key={`${ri}-${fi}`}
          animate={{
            backgroundColor: step >= 2
              ? isLight ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0)'
              : isLight ? '#f0d9b5' : '#b58863',
            borderColor: step >= 2
              ? 'rgba(255,255,255,0.06)'
              : 'transparent',
          }}
          transition={{ duration: 1.2 }}
          style={{ border: '1px solid transparent' }}
        />
      )
    }
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 1fr)',
      gridTemplateRows: 'repeat(8, 1fr)',
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0, left: 0,
    }}>
      {squares}
    </div>
  )
}

function LichessLogo({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <svg viewBox="-12 -12 74 74" width="300" height="300">
              <path
                d={LICHESS_PATH}
                fill="black"
                stroke="black"
                strokeLinejoin="round"
                strokeWidth="0.5"
              />
            </svg>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function Chart({ data, visible, size }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!data || !svgRef.current || !size) return
    if (!visible) {
      d3.select(svgRef.current).selectAll('*').remove()
      return
    }

    const { width, height } = size

    const parseMonth = str => {
      const [y, m] = str.split('-').map(Number)
      return new Date(y, m - 1, 1)
    }

    d3.select(svgRef.current).selectAll('*').remove()
    const svg = d3.select(svgRef.current)

    const cellW = width / 8
    const cellH = height / 8

    const yMax = 15e6 * 8

    const xMin = d3.min(data, d => parseMonth(d.month))
    const xMax = d3.max(data, d => parseMonth(d.month))

    const x = d3.scaleTime().domain([xMin, xMax]).range([0, width])
    const y = d3.scaleLinear().domain([0, yMax]).range([height, 0])

    // Grid at exact board cell boundaries
    for (let i = 0; i <= 8; i++) {
      svg.append('line')
        .attr('x1', i * cellW).attr('x2', i * cellW)
        .attr('y1', 0).attr('y2', height)
        .attr('stroke', 'rgba(255,255,255,0.08)')
        .attr('stroke-width', 1)
    }
    for (let i = 0; i <= 8; i++) {
      svg.append('line')
        .attr('x1', 0).attr('x2', width)
        .attr('y1', i * cellH).attr('y2', i * cellH)
        .attr('stroke', 'rgba(255,255,255,0.08)')
        .attr('stroke-width', 1)
    }

    const area = d3.area()
      .x(d => x(parseMonth(d.month)))
      .y0(height)
      .y1(d => y(d.games))
      .curve(d3.curveCatmullRom)

    const line = d3.line()
      .x(d => x(parseMonth(d.month)))
      .y(d => y(d.games))
      .curve(d3.curveCatmullRom)

    svg.append('path')
      .datum(data)
      .attr('fill', '#c9a84c')
      .attr('fill-opacity', 0.2)
      .attr('d', area)

    const path = svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#c9a84c')
      .attr('stroke-width', 2.5)
      .attr('d', line)

    const totalLength = path.node().getTotalLength()
    path
      .attr('stroke-dasharray', totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .delay(600)
      .duration(1800)
      .ease(d3.easeQuadInOut)
      .attr('stroke-dashoffset', 0)

    // X labels — show exact month each grid line lands on
    for (let i = 0; i <= 8; i++) {
      const xPos = i * cellW
      const date = x.invert(xPos)
      const yr = date.getFullYear()
      const mo = date.getMonth() + 1
      const label = mo === 1 ? `${yr}` : `${yr}.m${mo}`
      svg.append('text')
        .attr('x', xPos)
        .attr('y', height + 16)
        .attr('text-anchor', 'middle')
        .attr('fill', '#aaa')
        .attr('font-size', '11px')
        .text(label)
    }

    // Y labels
    for (let i = 0; i <= 8; i++) {
      const yPos = i * cellH
      const value = y.invert(yPos)
      svg.append('text')
        .attr('x', -6)
        .attr('y', yPos)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#aaa')
        .attr('font-size', '11px')
        .text(`${Math.round(value / 1e6)}M`)
    }

    // Tooltip elements
    const tooltipLine = svg.append('line')
      .attr('y1', 0).attr('y2', height)
      .attr('stroke', 'rgba(255,255,255,0.3)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
      .style('display', 'none')

    const tooltipDot = svg.append('circle')
      .attr('r', 4)
      .attr('fill', '#c9a84c')
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5)
      .style('display', 'none')

    const tooltipBox = svg.append('g').style('display', 'none')

    const tooltipRect = tooltipBox.append('rect')
      .attr('rx', 4)
      .attr('fill', '#1a1a1a')
      .attr('stroke', 'rgba(255,255,255,0.15)')
      .attr('stroke-width', 1)

    const tooltipText1 = tooltipBox.append('text')
      .attr('fill', '#c9a84c')
      .attr('font-size', '12px')
      .attr('font-family', 'Georgia, serif')

    const tooltipText2 = tooltipBox.append('text')
      .attr('fill', '#aaa')
      .attr('font-size', '11px')
      .attr('font-family', 'Georgia, serif')

    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mousemove', function(event) {
        const [mx] = d3.pointer(event)
        const hoveredDate = x.invert(mx)
        const hoveredTime = hoveredDate.getTime()

        let nearest = data[0]
        let minDist = Infinity
        for (const d of data) {
          const dist = Math.abs(parseMonth(d.month).getTime() - hoveredTime)
          if (dist < minDist) {
            minDist = dist
            nearest = d
          }
        }
        const d = nearest

        const cx = x(parseMonth(d.month))
        const cy = y(d.games)

        tooltipLine.attr('x1', cx).attr('x2', cx).style('display', null)
        tooltipDot.attr('cx', cx).attr('cy', cy).style('display', null)

        const label1 = d3.timeFormat('%B %Y')(parseMonth(d.month))
        const label2 = `${(d.games / 1e6).toFixed(1)}M games`

        tooltipText1.text(label1)
        tooltipText2.text(label2)

        const w = Math.max(
          label1.length * 7.5,
          label2.length * 7
        ) + 20
        const h = 38
        const pad = 8
        let tx = cx + 10
        if (tx + w > width) tx = cx - w - 10
        const ty = Math.max(pad, cy - h / 2)

        tooltipRect.attr('x', tx).attr('y', ty).attr('width', w).attr('height', h)
        tooltipText1.attr('x', tx + 10).attr('y', ty + 14)
        tooltipText2.attr('x', tx + 10).attr('y', ty + 28)

        tooltipBox.style('display', null)
      })
      .on('mouseleave', function() {
        tooltipLine.style('display', 'none')
        tooltipDot.style('display', 'none')
        tooltipBox.style('display', 'none')
      })

  }, [data, visible, size])

  return (
    <motion.svg
      ref={svgRef}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        overflow: 'visible',
      }}
    />
  )
}

export default function ChessToChart({ step, data }) {
  const containerRef = useRef(null)
  const [size, setSize] = useState(null)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setSize({ width, height })
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Keep container square
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1',
          maxWidth: '500px',
          maxHeight: '500px',
        }}
      >
        <Board step={step} />
        <LichessLogo visible={step === 1} />
        <Chart data={data} visible={step >= 2} size={size} />
      </div>
    </div>
  )
}