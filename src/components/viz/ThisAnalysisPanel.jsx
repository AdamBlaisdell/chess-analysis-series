export default function ThisAnalysisPanel() {
  return (
    <div style={{ padding: '2rem', width: '100%' }}>
      <h3 style={{ color: '#c9a84c', marginBottom: '2rem', fontSize: '1.3rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>April 2026</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {[
          { label: 'Games Analyzed', value: '89.9M' },
          { label: 'Blitz', value: '41M' },
          { label: 'Bullet', value: '31.8M' },
          { label: 'Rapid', value: '14.5M' },
          { label: 'With Clock Data', value: '~99%' },
          { label: 'With Engine Eval', value: '~10%' },
        ].map(({ label, value }) => (
          <div key={label} style={{
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '1.2rem',
            background: 'rgba(201,168,76,0.05)'
          }}>
            <div style={{ color: '#c9a84c', fontSize: '1.4rem', fontWeight: 'bold' }}>{value}</div>
            <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.3rem' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}