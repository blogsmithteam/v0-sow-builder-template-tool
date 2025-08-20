"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit } from "lucide-react"
import type { SOWData } from "@/app/page"
import { DocumentGenerator } from "@/utils/document-generator"
import { DocumentPreview } from "./document-preview"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ReviewStepProps {
  data: SOWData
  onPrev: () => void
}

export function ReviewStep({ data, onPrev }: ReviewStepProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editableContent, setEditableContent] = useState("")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatEngagementType = (type: string | undefined) => {
    if (!type || typeof type !== "string") return ""
    return type.replace(/-/g, " ")
  }

  const downloadDocx = async () => {
    setIsGenerating(true)
    try {
      const generator = new DocumentGenerator(data, isEditing ? editableContent : undefined)
      const blob = await generator.generateDocx()

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `SOW-${data.clientInfo.companyName.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating DOCX:", error)
      alert("Error generating document. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadPdf = async () => {
    setIsGenerating(true)
    try {
      const generator = new DocumentGenerator(data, isEditing ? editableContent : undefined)
      const pdf = generator.generatePdf()

      pdf.save(`SOW-${data.clientInfo.companyName.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating document. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const sendForSignature = () => {
    // This would integrate with an e-signature service
    console.log("Sending for signature:", data)
    alert("SOW sent for signature! (This would integrate with DocuSign, HelloSign, etc.)")
  }

  const formatDeliverablesForContent = () => {
    if (data.projectDetails.deliverables.length === 0) return ""

    if (data.projectDetails.useFeesForContentPhrasing) {
      const deliverablesText = data.projectDetails.deliverables.join(", ")
      let content = `The fees will be used for various content projects including ${deliverablesText}.`

      if (data.projectDetails.specificProjectDetails) {
        content += ` These deliverables will include ${data.projectDetails.specificProjectDetails}.`
      }

      return content
    } else {
      let content = "The Service Provider will deliver the following specific outputs and results to the Client:\n"
      data.projectDetails.deliverables.forEach((item, index) => {
        content += `${index + 1}. ${item}\n`
      })
      return content
    }
  }

  const generateSOWContent = () => {
    let content = `STATEMENT OF WORK

This Statement of Work outlines the collaboration between The Blogsmith and ${data.clientInfo.companyName}, including the following key terms:

PARTIES`

    content += `

CLIENT:
Company: ${data.clientInfo.companyName}
Primary Contact: ${data.clientInfo.contactName}`

    if (data.clientInfo.email) {
      content += `\nEmail: ${data.clientInfo.email}`
    }

    content += `\n\nSERVICE PROVIDER:
Company: ${data.serviceProvider.companyName}`

    if (data.serviceProvider.website) {
      content += `\nWebsite: ${data.serviceProvider.website}`
    }
    if (data.serviceProvider.address) {
      content += `\nBusiness Address: ${data.serviceProvider.address}`
    }

    // Deliverables section
    if (data.projectDetails.description || data.projectDetails.deliverables.length > 0) {
      content += `\n\nDELIVERABLES AND OUTCOMES`

      if (data.projectDetails.description) {
        content += `\n\nProject Description:
${data.projectDetails.description}`
      }

      // Add fees display
      if (data.projectDetails.fees.totalAmount > 0) {
        content += `\n\nPROJECT FEES AND PAYMENT STRUCTURE

Total Project Fee: ${formatCurrency(data.projectDetails.fees.totalAmount)}
Payment Structure: ${data.projectDetails.fees.paymentStructure.replace(/-/g, " ")}`
      }

      if (data.projectDetails.deliverables.length > 0) {
        content += `\n\nDeliverables:
${formatDeliverablesForContent()}`
      }
    }

    // Add timeline section before terms
    if (data.projectDetails.timeline || data.projectDetails.startDate || data.projectDetails.endDate) {
      content += `\n\nTIMELINE`

      if (data.projectDetails.startDate && data.projectDetails.endDate) {
        content += `\n\nTimeline: This SOW begins on ${new Date(data.projectDetails.startDate).toLocaleDateString()} and will terminate at the end of the day on ${new Date(data.projectDetails.endDate).toLocaleDateString()}.`
      } else {
        if (data.projectDetails.timeline) {
          content += `\n\nTimeline: ${data.projectDetails.timeline}`
        }
        if (data.projectDetails.startDate) {
          content += `\nStart Date: ${new Date(data.projectDetails.startDate).toLocaleDateString()}`
        }
        if (data.projectDetails.endDate) {
          content += `\nEnd Date: ${new Date(data.projectDetails.endDate).toLocaleDateString()}`
        }
      }
    }

    // Terms and Conditions
    content += `\n\nTERMS AND CONDITIONS`

    if (data.terms.paymentTerms) {
      const formatPaymentTerms = (terms: string) => {
        switch (terms) {
          case "net-15":
            return "Net 15 days"
          case "net-30":
            return "Net 30 days"
          case "net-45":
            return "Net 45 days"
          case "due-on-receipt":
            return "due on receipt"
          case "50-50":
            return "50% upfront, 50% on completion"
          case "monthly":
            return "monthly"
          case "milestone":
            return "milestone-based"
          default:
            return terms
        }
      }

      content += `\n\nPayment Terms:
All invoices are ${formatPaymentTerms(data.terms.paymentTerms)}.`

      if (data.terms.lateFeePolicy) {
        content += ` ${data.terms.lateFeePolicy}`
      } else {
        content += ` Late payments may incur interest charges at a rate of 1.5% per month.`
      }
    }

    // Only include IP section if provided
    if (data.terms.intellectualProperty) {
      content += `\n\nIntellectual Property Rights:
${data.terms.intellectualProperty}`
    }

    if (data.terms.revisions > 0) {
      content += `\n\nRevisions and Changes:
This agreement includes up to ${data.terms.revisions} rounds of revisions for each major deliverable. Additional revisions beyond this scope will be subject to additional charges at the standard hourly rate. All revision requests must be submitted in writing with specific, actionable feedback.`
    }

    if (data.terms.confidentiality) {
      content += `\n\nConfidentiality:
Both parties acknowledge that they may have access to confidential information during the course of this engagement. Each party agrees to maintain the confidentiality of such information and not to disclose it to third parties without prior written consent. This obligation shall survive the termination of this agreement.`
    }

    if (data.terms.cancellationPolicy) {
      content += `\n\nTermination and Cancellation:
${data.terms.cancellationPolicy}`
    }

    // Remove General Provisions section

    content += `\n\nACCEPTANCE AND AUTHORIZATION

By signing below, both parties acknowledge that they have read, understood, and agree to be bound by the terms and conditions set forth in this Statement of Work.

CLIENT ACCEPTANCE:
Signature: _________________________ Date: _________
${data.clientInfo.contactName}
${data.clientInfo.companyName}

SERVICE PROVIDER ACCEPTANCE:
Signature: _________________________ Date: _________
${data.serviceProvider.contactName}
${data.serviceProvider.title || "Authorized Representative"}
${data.serviceProvider.companyName}`

    return content
  }

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditableContent(generateSOWContent())
    }
    setIsEditing(!isEditing)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Your Statement of Work</CardTitle>
          <CardDescription>Please review all details before generating the final document</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Toggle between summary and full text view */}
          <div className="flex gap-4 mb-6">
            <Button variant={!isEditing ? "default" : "outline"} onClick={() => setIsEditing(false)} size="sm">
              Summary View
            </Button>
            <Button variant={isEditing ? "default" : "outline"} onClick={handleEditToggle} size="sm">
              Edit Full Text
            </Button>
          </div>

          {isEditing ? (
            /* Full Text Editor */
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Edit className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Edit SOW Content</span>
                </div>
                <p className="text-xs text-amber-700">
                  You can edit the full text of your Statement of Work below. Changes will be reflected in the generated
                  document.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sow-content">Statement of Work Content</Label>
                <Textarea
                  id="sow-content"
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  className="min-h-[600px] font-mono text-sm"
                  placeholder="SOW content will appear here..."
                />
              </div>
            </div>
          ) : (
            /* Summary View - existing content */
            <>
              {/* Engagement Type */}
              <div>
                <h3 className="font-semibold mb-2">Engagement Type</h3>
                <Badge variant="outline" className="capitalize">
                  {formatEngagementType(data.engagementType)}
                </Badge>
              </div>

              <Separator />

              {/* Parties */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Client</h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{data.clientInfo.companyName}</p>
                    <p>{data.clientInfo.contactName}</p>
                    {data.clientInfo.email && <p>{data.clientInfo.email}</p>}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Service Provider</h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{data.serviceProvider.companyName}</p>
                    <p>{data.serviceProvider.contactName}</p>
                    {data.serviceProvider.title && <p className="text-gray-600">{data.serviceProvider.title}</p>}
                    {data.serviceProvider.email && <p>{data.serviceProvider.email}</p>}
                    {data.serviceProvider.website && (
                      <p>
                        <a
                          href={data.serviceProvider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {data.serviceProvider.website}
                        </a>
                      </p>
                    )}
                    {data.serviceProvider.address && (
                      <p className="text-gray-600 whitespace-pre-line">{data.serviceProvider.address}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Project Details */}
              <div>
                <h3 className="font-semibold mb-3">Project Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mt-1">{data.projectDetails.description}</p>
                  </div>

                  {/* Add fees display */}
                  {data.projectDetails.fees.totalAmount > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm font-medium text-green-800 mb-1">Project Fees:</p>
                      <p className="text-sm text-green-700">
                        Total: {formatCurrency(data.projectDetails.fees.totalAmount)}
                      </p>
                      {data.projectDetails.fees.paymentStructure && (
                        <p className="text-sm text-green-700">
                          Payment: {data.projectDetails.fees.paymentStructure.replace(/-/g, " ")}
                        </p>
                      )}
                    </div>
                  )}

                  {data.projectDetails.timeline && (
                    <div>
                      <span className="text-sm font-medium">Timeline: </span>
                      <span className="text-sm">{data.projectDetails.timeline}</span>
                    </div>
                  )}

                  {(data.projectDetails.startDate || data.projectDetails.endDate) && (
                    <div className="text-sm">
                      {data.projectDetails.startDate && (
                        <span>Start: {new Date(data.projectDetails.startDate).toLocaleDateString()}</span>
                      )}
                      {data.projectDetails.startDate && data.projectDetails.endDate && <span> • </span>}
                      {data.projectDetails.endDate && (
                        <span>End: {new Date(data.projectDetails.endDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  )}

                  {data.projectDetails.deliverables.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Deliverables:</p>
                      {data.projectDetails.useFeesForContentPhrasing ? (
                        <div className="text-sm text-gray-600">
                          <p>
                            The fees will be used for various content projects including{" "}
                            {data.projectDetails.deliverables.join(", ")}.
                          </p>
                          {data.projectDetails.specificProjectDetails && (
                            <p className="mt-1">
                              These deliverables will include {data.projectDetails.specificProjectDetails}.
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {data.projectDetails.deliverables.map((item, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Engagement-specific Details */}
              {data.engagementType === "retainer" && (
                <div>
                  <h3 className="font-semibold mb-3">Retainer Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Monthly Hours: </span>
                      <span>{data.retainerDetails.monthlyHours}</span>
                    </div>
                    <div>
                      <span className="font-medium">Hourly Rate: </span>
                      <span>{formatCurrency(data.retainerDetails.hourlyRate)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Monthly Fee: </span>
                      <span>{formatCurrency(data.retainerDetails.retainerFee)}</span>
                    </div>
                    {data.retainerDetails.rolloverHours && (
                      <div>
                        <span className="font-medium">Max Rollover: </span>
                        <span>{data.retainerDetails.maxRolloverHours} hours</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {data.engagementType === "multiple-projects" && (
                <div>
                  <h3 className="font-semibold mb-3">Multiple Projects</h3>
                  <div className="space-y-3">
                    {data.multipleProjectsDetails.projects.map((project, index) => (
                      <div key={index} className="border rounded p-3 bg-gray-50">
                        <p className="font-medium text-sm">{project.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{project.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span>{project.estimatedHours} hours</span>
                          <span>{project.timeline}</span>
                        </div>
                      </div>
                    ))}
                    <div className="text-sm">
                      <span className="font-medium">Total Budget: </span>
                      <span>{formatCurrency(data.multipleProjectsDetails.totalBudget)}</span>
                    </div>
                    {data.multipleProjectsDetails.paymentSchedule && (
                      <div className="text-sm">
                        <span className="font-medium">Payment Schedule: </span>
                        <span>{data.multipleProjectsDetails.paymentSchedule}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              {/* Terms */}
              <div>
                <h3 className="font-semibold mb-3">Terms & Conditions</h3>
                <div className="space-y-2 text-sm">
                  {data.terms.paymentTerms && (
                    <div>
                      <span className="font-medium">Payment Terms: </span>
                      <span>{data.terms.paymentTerms}</span>
                    </div>
                  )}
                  {data.terms.lateFeePolicy && (
                    <div>
                      <span className="font-medium">Late Fee Policy: </span>
                      <p className="text-gray-600 mt-1">{data.terms.lateFeePolicy}</p>
                    </div>
                  )}
                  {data.terms.intellectualProperty && (
                    <div>
                      <span className="font-medium">IP Ownership: </span>
                      <p className="text-gray-600 mt-1">{data.terms.intellectualProperty}</p>
                    </div>
                  )}
                  {data.terms.revisions > 0 && (
                    <div>
                      <span className="font-medium">Included Revisions: </span>
                      <span>{data.terms.revisions}</span>
                    </div>
                  )}
                  {data.terms.confidentiality && (
                    <div>
                      <Badge variant="outline" className="text-xs">
                        NDA Included
                      </Badge>
                    </div>
                  )}
                  {data.terms.cancellationPolicy && (
                    <div>
                      <span className="font-medium">Cancellation Policy: </span>
                      <p className="text-gray-600 mt-1">{data.terms.cancellationPolicy}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" onClick={onPrev} className="flex items-center gap-2 bg-transparent">
          <Edit className="h-4 w-4" />
          Edit Details
        </Button>
        <DocumentPreview
          data={data}
          onDownloadDocx={downloadDocx}
          onDownloadPdf={downloadPdf}
          onSendForSignature={sendForSignature}
          isGenerating={isGenerating}
          customContent={isEditing ? editableContent : undefined}
        />
      </div>
    </div>
  )
}
