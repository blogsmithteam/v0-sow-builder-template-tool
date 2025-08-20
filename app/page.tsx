"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { EngagementTypeStep } from "@/components/engagement-type-step"
import { ClientInfoStep } from "@/components/client-info-step"
import { ProjectDetailsStep } from "@/components/project-details-step"
import { TermsStep } from "@/components/terms-step"
import { ReviewStep } from "@/components/review-step"
import { FileText, Users, Calendar, CheckCircle } from "lucide-react"

export interface SOWData {
  engagementType: "retainer" | "multiple-projects" | "single-project" | ""
  clientInfo: {
    companyName: string
    contactName: string
    email: string
  }
  serviceProvider: {
    companyName: string
    contactName: string
    email: string
    address: string
    website: string
    title: string
  }
  projectDetails: {
    projectName: string
    description: string
    deliverables: string[]
    timeline: string
    startDate: string
    endDate: string
    useFeesForContentPhrasing: boolean
    specificProjectDetails: string
    fees: {
      totalAmount: number
      paymentStructure: string
      customPaymentStructure: string
    }
  }
  retainerDetails: {
    monthlyHours: number
    hourlyRate: number
    retainerFee: number
    rolloverHours: boolean
    maxRolloverHours: number
  }
  multipleProjectsDetails: {
    projects: Array<{
      name: string
      description: string
      estimatedHours: number
      timeline: string
    }>
    totalBudget: number
    paymentSchedule: string
  }
  terms: {
    paymentTerms: string
    cancellationPolicy: string
    intellectualProperty: string
    confidentiality: boolean
    revisions: number
    lateFeePolicy: string
  }
}

const steps = [
  { id: 1, title: "Engagement Type", icon: FileText },
  { id: 2, title: "Client Information", icon: Users },
  { id: 3, title: "Project Details", icon: Calendar },
  { id: 4, title: "Terms & Conditions", icon: CheckCircle },
  { id: 5, title: "Review & Finalize", icon: CheckCircle },
]

export default function SOWBuilder() {
  const [currentStep, setCurrentStep] = useState(1)
  const [sowData, setSOWData] = useState<SOWData>({
    engagementType: "",
    clientInfo: {
      companyName: "",
      contactName: "",
      email: "",
    },
    serviceProvider: {
      companyName: "Blogsmith INC",
      contactName: "Madeline French",
      email: "maddy@theblogsmith.com",
      address: "1090 S Wadsworth Blvd\nUnit C #3184\nLakewood, CO 80226",
      website: "https://www.theblogsmith.com",
      title: "CEO, The Blogsmith",
    },
    projectDetails: {
      projectName: "",
      description: "",
      deliverables: [],
      timeline: "",
      startDate: "",
      endDate: "",
      useFeesForContentPhrasing: false,
      specificProjectDetails: "",
      fees: {
        totalAmount: 0,
        paymentStructure: "",
        customPaymentStructure: "",
      },
    },
    retainerDetails: {
      monthlyHours: 0,
      hourlyRate: 0,
      retainerFee: 0,
      rolloverHours: false,
      maxRolloverHours: 0,
    },
    multipleProjectsDetails: {
      projects: [],
      totalBudget: 0,
      paymentSchedule: "",
    },
    terms: {
      paymentTerms: "",
      cancellationPolicy: "",
      intellectualProperty: "",
      confidentiality: false,
      revisions: 3,
      lateFeePolicy: "",
    },
  })

  const updateSOWData = (section: keyof SOWData, data: any) => {
    setSOWData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = (currentStep / steps.length) * 100

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <EngagementTypeStep data={sowData} updateData={updateSOWData} onNext={nextStep} />
      case 2:
        return <ClientInfoStep data={sowData} updateData={updateSOWData} onNext={nextStep} onPrev={prevStep} />
      case 3:
        return <ProjectDetailsStep data={sowData} updateData={updateSOWData} onNext={nextStep} onPrev={prevStep} />
      case 4:
        return <TermsStep data={sowData} updateData={updateSOWData} onNext={nextStep} onPrev={prevStep} />
      case 5:
        return <ReviewStep data={sowData} onPrev={prevStep} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Statement of Work Builder</h1>
          <p className="mt-2 text-gray-600">
            Create professional SOWs for retainer clients, multiple projects, or single engagements
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  Step {currentStep} of {steps.length}
                </span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between">
              {steps.map((step) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id

                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : isActive
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        {renderStep()}
      </div>
    </div>
  )
}
