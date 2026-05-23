import { useState } from 'react'
import { Scrollama, Step } from 'react-scrollama'

export default function ScrollySection({ steps, renderViz }) {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <div style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start' }}>

      {/* Scrolling text */}
      <div style={{ flex: '0 0 35%' }}>
        <Scrollama
          onStepEnter={({ data }) => setCurrentStep(data)}
          onStepExit={({ data, direction }) => {
            if (direction === 'up' && data === 0) setCurrentStep(0)
          }}
          offset={0.5}
        >
          {steps.map((step, i) => (
            <Step data={i} key={i}>
              <div style={{
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                padding: '2rem 0',
              }}>
                <div>{step}</div>
              </div>
            </Step>
          ))}
        </Scrollama>
      </div>

      {/* Sticky viz */}
      <div style={{
        flex: '0 0 60%',
        position: 'sticky',
        top: '10vh',
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {renderViz(currentStep)}
      </div>

    </div>
  )
}