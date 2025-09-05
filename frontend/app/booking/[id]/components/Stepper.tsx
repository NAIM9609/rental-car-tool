'use client'

import { FaChevronRight, FaCheck } from 'react-icons/fa'

export interface StepDef {
  number: number
  title: string
  description: string
}

export default function Stepper({ currentStep, steps }: { currentStep: number; steps: StepDef[] }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center space-x-3 ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'}`}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep > step.number
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : currentStep === step.number
                      ? 'border-blue-600 bg-white text-blue-600'
                      : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {currentStep > step.number ? <FaCheck /> : step.number}
              </div>
              <div className="text-left">
                <div className="font-semibold">{step.title}</div>
                <div className="text-sm opacity-75">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && <FaChevronRight className="mx-4 text-gray-400" />}
          </div>
        ))}
      </div>
    </div>
  )
}
