"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, FolderOpen, Target, Check } from "lucide-react"
import type { SOWData } from "@/app/page"

interface EngagementTypeStepProps {
  data: SOWData
  updateData: (section: keyof SOWData, data: any) => void
  onNext: () => void
}

export function EngagementTypeStep({ data, updateData, onNext }: EngagementTypeStepProps) {
  const handleEngagementTypeChange = (value: string) => {
    updateData("engagementType", value)
  }

  const canProceed = data.engagementType !== ""

  const options = [
    {
      id: "retainer",
      title: "Monthly Retainer",
      icon: Clock,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      selectedBorder: "border-blue-500",
      selectedBg: "bg-blue-50",
      iconColor: "text-blue-600",
      description:
        "Ongoing monthly engagement with a set number of hours and recurring fee. Perfect for continuous support, maintenance, or regular consulting work.",
      features: ["Fixed monthly hours", "Predictable billing", "Optional hour rollover"],
      bestFor: "Long-term partnerships, ongoing support, regular consulting",
    },
    {
      id: "multiple-projects",
      title: "Multiple Projects",
      icon: FolderOpen,
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      selectedBorder: "border-green-500",
      selectedBg: "bg-green-50",
      iconColor: "text-green-600",
      description:
        "Several distinct projects under one agreement with shared terms and conditions. Ideal for clients with multiple initiatives or phased work.",
      features: ["Multiple deliverables", "Flexible timeline", "Consolidated billing"],
      bestFor: "Complex initiatives, phased rollouts, multiple team projects",
    },
    {
      id: "single-project",
      title: "Single Project",
      icon: Target,
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      selectedBorder: "border-purple-500",
      selectedBg: "bg-purple-50",
      iconColor: "text-purple-600",
      description:
        "One-time project with defined scope, timeline, and deliverables. Best for specific initiatives with clear start and end dates.",
      features: ["Fixed scope", "Clear timeline", "Project-based pricing"],
      bestFor: "Specific deliverables, one-time builds, defined outcomes",
    },
  ]

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Choose Your Engagement Type</CardTitle>
        <CardDescription className="text-base">
          Select the type of working relationship that best fits your project needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual Selection Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {options.map((option) => {
            const Icon = option.icon
            const isSelected = data.engagementType === option.id

            return (
              <div
                key={option.id}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  isSelected ? "scale-105" : "hover:scale-102"
                }`}
                onClick={() => handleEngagementTypeChange(option.id)}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-r ${option.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                {/* Main Card */}
                <div
                  className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                    isSelected
                      ? `${option.selectedBorder} ${option.selectedBg} shadow-lg ring-4 ring-opacity-20 ring-${option.gradient.split("-")[1]}-500`
                      : `${option.borderColor} bg-white hover:${option.bgColor} hover:shadow-md`
                  }`}
                >
                  {/* Gradient Header */}
                  <div className={`h-2 bg-gradient-to-r ${option.gradient}`}></div>

                  <div className="p-6">
                    {/* Icon and Title */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div
                        className={`p-3 rounded-lg ${
                          isSelected ? option.selectedBg : option.bgColor
                        } transition-colors duration-300`}
                      >
                        <Icon className={`h-6 w-6 ${option.iconColor}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{option.title}</h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{option.description}</p>

                    {/* Best For */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Best For:</p>
                      <p className="text-sm text-gray-700">{option.bestFor}</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      {option.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${option.gradient}`}></div>
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selection Overlay */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10 pointer-events-none"></div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <Button onClick={onNext} disabled={!canProceed} className="px-12 py-3 text-base font-medium" size="lg">
            {canProceed ? "Continue to Client Information" : "Select an Engagement Type"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
