"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Check, DollarSign } from "lucide-react"
import type { SOWData } from "@/app/page"

interface ProjectDetailsStepProps {
  data: SOWData
  updateData: (section: keyof SOWData, data: any) => void
  onNext: () => void
  onPrev: () => void
}

const commonDeliverables = [
  "Blog posts",
  "Website copy",
  "Social media content",
  "Email campaigns",
  "Product descriptions",
  "Case studies",
  "White papers",
  "Press releases",
  "SEO content",
  "Landing pages",
  "Video scripts",
  "Podcast scripts",
  "Newsletter content",
  "Technical documentation",
  "Marketing materials",
]

export function ProjectDetailsStep({ data, updateData, onNext, onPrev }: ProjectDetailsStepProps) {
  const [newDeliverable, setNewDeliverable] = useState("")
  const [showCustomPayment, setShowCustomPayment] = useState(false)

  const addDeliverable = (deliverable: string) => {
    if (deliverable && !data.projectDetails.deliverables.includes(deliverable)) {
      updateData("projectDetails", {
        deliverables: [...data.projectDetails.deliverables, deliverable],
      })
    }
    setNewDeliverable("")
  }

  const removeDeliverable = (index: number) => {
    const newDeliverables = data.projectDetails.deliverables.filter((_, i) => i !== index)
    updateData("projectDetails", { deliverables: newDeliverables })
  }

  const handleFeesChange = (field: string, value: any) => {
    updateData("projectDetails", {
      fees: { ...data.projectDetails.fees, [field]: value },
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handleNext = () => {
    if (!data.projectDetails.description.trim()) {
      alert("Please provide a project description.")
      return
    }
    if (data.projectDetails.fees.totalAmount <= 0) {
      alert("Please provide a project fee amount.")
      return
    }
    if (!data.projectDetails.fees.paymentStructure) {
      alert("Please select a payment structure.")
      return
    }
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>Describe your project scope, deliverables, and fees</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Project Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe the overall project scope, objectives, and what you'll be delivering..."
            value={data.projectDetails.description}
            onChange={(e) => updateData("projectDetails", { description: e.target.value })}
            className="min-h-[100px]"
          />
        </div>

        {/* Project Fees Section */}
        <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-800">Project Fees</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Project Fee *</Label>
              <Input
                id="totalAmount"
                type="number"
                placeholder="5000"
                value={data.projectDetails.fees.totalAmount || ""}
                onChange={(e) => handleFeesChange("totalAmount", Number(e.target.value) || 0)}
              />
              {data.projectDetails.fees.totalAmount > 0 && (
                <p className="text-sm text-green-700">{formatCurrency(data.projectDetails.fees.totalAmount)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentStructure">Payment Structure *</Label>
              <Select
                value={showCustomPayment ? "custom" : data.projectDetails.fees.paymentStructure}
                onValueChange={(value) => {
                  if (value === "custom") {
                    setShowCustomPayment(true)
                  } else {
                    setShowCustomPayment(false)
                    handleFeesChange("paymentStructure", value)
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment structure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-upfront">100% upfront</SelectItem>
                  <SelectItem value="50-50">50% upfront, 50% on completion</SelectItem>
                  <SelectItem value="33-33-33">33% upfront, 33% midpoint, 33% completion</SelectItem>
                  <SelectItem value="25-75">25% upfront, 75% on completion</SelectItem>
                  <SelectItem value="milestone-based">Milestone-based payments</SelectItem>
                  <SelectItem value="monthly">Monthly payments</SelectItem>
                  <SelectItem value="custom">Custom structure...</SelectItem>
                </SelectContent>
              </Select>

              {showCustomPayment && (
                <div className="mt-2">
                  <Input
                    placeholder="Describe custom payment structure..."
                    value={data.projectDetails.fees.customPaymentStructure}
                    onChange={(e) => handleFeesChange("customPaymentStructure", e.target.value)}
                    onBlur={() => {
                      if (data.projectDetails.fees.customPaymentStructure.trim()) {
                        handleFeesChange("paymentStructure", data.projectDetails.fees.customPaymentStructure)
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="text-sm text-green-700 bg-green-100 p-3 rounded">
            <p className="font-medium mb-1">Fee Summary:</p>
            <p>
              Total:{" "}
              {data.projectDetails.fees.totalAmount > 0
                ? formatCurrency(data.projectDetails.fees.totalAmount)
                : "$0.00"}
              {data.projectDetails.fees.paymentStructure && (
                <span> • Payment: {data.projectDetails.fees.paymentStructure.replace(/-/g, " ")}</span>
              )}
            </p>
          </div>
        </div>

        {/* Deliverables */}
        <div className="space-y-4">
          <div>
            <Label>Deliverables</Label>
            <p className="text-sm text-gray-600 mt-1">Select or add specific deliverables for this project</p>
          </div>

          {/* Deliverables formatting option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useFeesForContentPhrasing"
              checked={data.projectDetails.useFeesForContentPhrasing}
              onCheckedChange={(checked) => updateData("projectDetails", { useFeesForContentPhrasing: checked })}
            />
            <Label htmlFor="useFeesForContentPhrasing" className="text-sm">
              Use "fees for content projects" phrasing
            </Label>
          </div>

          {/* Specific project details (only show if using fees phrasing) */}
          {data.projectDetails.useFeesForContentPhrasing && (
            <div className="space-y-2">
              <Label htmlFor="specificProjectDetails">Specific Project Details (Optional)</Label>
              <Textarea
                id="specificProjectDetails"
                placeholder="Add any specific project scope details that will be included..."
                value={data.projectDetails.specificProjectDetails}
                onChange={(e) => updateData("projectDetails", { specificProjectDetails: e.target.value })}
                className="min-h-[80px]"
              />
              <p className="text-xs text-gray-500">
                This will be added as: "These deliverables will include [your text]."
              </p>
            </div>
          )}

          {/* Common deliverables */}
          <div>
            <p className="text-sm font-medium mb-2">Common Deliverables</p>
            <div className="flex flex-wrap gap-2">
              {commonDeliverables.map((deliverable) => (
                <Button
                  key={deliverable}
                  variant="outline"
                  size="sm"
                  onClick={() => addDeliverable(deliverable)}
                  disabled={data.projectDetails.deliverables.includes(deliverable)}
                  className="text-xs"
                >
                  {data.projectDetails.deliverables.includes(deliverable) ? (
                    <Check className="h-3 w-3 mr-1" />
                  ) : (
                    <Plus className="h-3 w-3 mr-1" />
                  )}
                  {deliverable}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom deliverable input */}
          <div className="flex gap-2">
            <Input
              placeholder="Add custom deliverable..."
              value={newDeliverable}
              onChange={(e) => setNewDeliverable(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addDeliverable(newDeliverable)
                }
              }}
            />
            <Button onClick={() => addDeliverable(newDeliverable)} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected deliverables */}
          {data.projectDetails.deliverables.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Selected Deliverables</p>
              <div className="flex flex-wrap gap-2">
                {data.projectDetails.deliverables.map((deliverable, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {deliverable}
                    <button
                      onClick={() => removeDeliverable(index)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          <Label>Timeline</Label>

          <div className="space-y-2">
            <Label htmlFor="timeline">Overall Timeline (Optional)</Label>
            <Input
              id="timeline"
              placeholder="e.g., 3 months, 6 weeks, etc."
              value={data.projectDetails.timeline}
              onChange={(e) => updateData("projectDetails", { timeline: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date (Optional)</Label>
              <Input
                id="startDate"
                type="date"
                value={data.projectDetails.startDate}
                onChange={(e) => updateData("projectDetails", { startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={data.projectDetails.endDate}
                onChange={(e) => updateData("projectDetails", { endDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrev}>
            Previous
          </Button>
          <Button onClick={handleNext}>Next</Button>
        </div>
      </CardContent>
    </Card>
  )
}
