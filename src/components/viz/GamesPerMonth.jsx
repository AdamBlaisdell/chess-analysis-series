import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function GamesPerMonth({ data, highlightLatest }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!data || !svgRef.current) return

    const margin = { top: 30, right: 30, bottom: 50, left: 70 }
    const width = svgRef.current.clientWidth - margin.left - margin.right
    const height = svgRef.current.clientHeight - margin.top - margin.bottom

    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.month)))
      .range([0, width])

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.games)])
      .range([height, 0])

    const area = d3.area()
      .x(d => x(new Date(d.month)))
      .y0(height)
      .y1(d => y(d.games))
      .curve(d3.curveCatmullRom)

    const line = d3.line()
      .x(d => x(new Date(d.month)))
      .y(d => y(d.games))
      .curve(d3.curveCatmullRom)

    svg.append('path')
      .datum(data)
      .attr('fill', '#c9a84c')
      .attr('fill-opacity', 0.15)
      .attr('d', area)

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#c9a84c')
      .attr('stroke-width', 2)
      .attr('d', line)

    if (highlightLatest) {
      const highlightDate = new Date('2026-04')
      const highlightX = x(highlightDate)

      svg.append('line')
        .attr('x1', highlightX)
        .attr('x2', highlightX)
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.6)

      svg.append('rect')
        .attr('x', highlightX - 52)
        .attr('y', 20)
        .attr('width', 72)
        .attr('height', 24)
        .attr('fill', '#c9a84c')
        .attr('rx', 4)

      svg.append('text')
        .attr('x', highlightX - 16)
        .attr('y', 36)
        .attr('text-anchor', 'middle')
        .attr('fill', '#000')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text('Apr 2026')
    }

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(8).tickFormat(d3.timeFormat('%Y')))
      .call(g => g.select('.domain').attr('stroke', '#444'))
      .call(g => g.selectAll('text').attr('fill', '#888').attr('font-size', '12px'))
      .call(g => g.selectAll('line').attr('stroke', '#444'))

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${(d / 1e6).toFixed(0)}M`))
      .call(g => g.select('.domain').attr('stroke', '#444'))
      .call(g => g.selectAll('text').attr('fill', '#888').attr('font-size', '12px'))
      .call(g => g.selectAll('line').attr('stroke', '#444'))

  }, [data, highlightLatest])

  return (
    <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
  )
}