"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Download, Send } from "lucide-react"
import type { SOWData } from "@/app/page"

interface DocumentPreviewProps {
  data: SOWData
  onDownloadDocx: () => void
  onDownloadPdf: () => void
  onSendForSignature: () => void
  isGenerating: boolean
  customContent?: string
}

export function DocumentPreview({
  data,
  onDownloadDocx,
  onDownloadPdf,
  onSendForSignature,
  isGenerating,
  customContent,
}: DocumentPreviewProps) {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Eye className="h-4 w-4" />
          Preview Document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Document Preview</DialogTitle>
          <DialogDescription>Review how your Statement of Work will appear in the final document</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            {customContent ? (
              /* Show custom edited content */
              <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded border">{customContent}</div>
            ) : (
              /* Show structured preview - existing content */
              <>
                {/* Header */}
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold">STATEMENT OF WORK</h1>
                </div>

                <Separator />

                {/* Overview */}
                <div>
                  <p className="text-gray-700">
                    This Statement of Work outlines the collaboration between The Blogsmith and{" "}
                    {data.clientInfo.companyName}, including the following key terms:
                  </p>
                </div>

                <Separator />

                {/* Parties */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">PARTIES</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">CLIENT:</h3>
                      <div className="space-y-1">
                        <p>
                          <strong>Company:</strong> {data.clientInfo.companyName}
                        </p>
                        <p>
                          <strong>Primary Contact:</strong> {data.clientInfo.contactName}
                        </p>
                        {data.clientInfo.email && (
                          <p>
                            <strong>Email:</strong> {data.clientInfo.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">SERVICE PROVIDER:</h3>
                      <div className="space-y-1">
                        <p>
                          <strong>Company:</strong> {data.serviceProvider.companyName}
                        </p>
                        {data.serviceProvider.website && (
                          <p>
                            <strong>Website:</strong> {data.serviceProvider.website}
                          </p>
                        )}
                        {data.serviceProvider.address && (
                          <p>
                            <strong>Business Address:</strong> {data.serviceProvider.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Deliverables */}
                {(data.projectDetails.deliverables.length > 0 || data.projectDetails.description) && (
                  <>
                    <div>
                      <h2 className="text-lg font-semibold mb-3">DELIVERABLES AND OUTCOMES</h2>
                      {data.projectDetails.description && (
                        <div className="mb-4">
                          <p className="font-semibold mb-1">Project Description:</p>
                          <p className="text-gray-700">{data.projectDetails.description}</p>
                        </div>
                      )}
                      {/* Add after project description */}
                      {data.projectDetails.fees.totalAmount > 0 && (
                        <>
                          <div>
                            <h2 className="text-lg font-semibold mb-3">PROJECT FEES AND PAYMENT STRUCTURE</h2>
                            <div className="space-y-2">
                              <p>
                                <strong>Total Project Fee:</strong>{" "}
                                {formatCurrency(data.projectDetails.fees.totalAmount)}
                              </p>
                              <p>
                                <strong>Payment Structure:</strong>{" "}
                                {data.projectDetails.fees.paymentStructure.replace(/-/g, " ")}
                              </p>
                            </div>
                          </div>
                          <Separator />
                        </>
                      )}
                      {data.projectDetails.deliverables.length > 0 && (
                        <>
                          <p className="font-semibold mb-2">Deliverables:</p>
                          {data.projectDetails.useFeesForContentPhrasing ? (
                            <div className="text-gray-700">
                              <p>
                                The fees will be used for various content projects including{" "}
                                {data.projectDetails.deliverables.join(", ")}.
                              </p>
                              {data.projectDetails.specificProjectDetails && (
                                <p className="mt-2">
                                  These deliverables will include {data.projectDetails.specificProjectDetails}.
                                </p>
                              )}
                            </div>
                          ) : (
                            <>
                              <ol className="list-decimal list-inside space-y-1">
                                {data.projectDetails.deliverables.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ol>
                              <p className="text-gray-700 mt-3">
                                All deliverables will be provided in the agreed-upon format and will meet the quality
                                standards established in this agreement.
                              </p>
                            </>
                          )}
                        </>
                      )}
                    </div>
                    <Separator />
                  </>
                )}

                {/* Timeline Section */}
                {(data.projectDetails.timeline || data.projectDetails.startDate || data.projectDetails.endDate) && (
                  <>
                    <div>
                      <h2 className="text-lg font-semibold mb-3">TIMELINE</h2>
                      {data.projectDetails.startDate && data.projectDetails.endDate ? (
                        <p>
                          <strong>Timeline:</strong> This SOW begins on{" "}
                          {new Date(data.projectDetails.startDate).toLocaleDateString()} and will terminate at the end
                          of the day on {new Date(data.projectDetails.endDate).toLocaleDateString()}.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {data.projectDetails.timeline && (
                            <p>
                              <strong>Timeline:</strong> {data.projectDetails.timeline}
                            </p>
                          )}
                          {data.projectDetails.startDate && (
                            <p>
                              <strong>Start Date:</strong>{" "}
                              {new Date(data.projectDetails.startDate).toLocaleDateString()}
                            </p>
                          )}
                          {data.projectDetails.endDate && (
                            <p>
                              <strong>End Date:</strong> {new Date(data.projectDetails.endDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <Separator />
                  </>
                )}

                {/* Engagement-specific Details */}
                {data.engagementType === "retainer" && (
                  <>
                    <div>
                      <h2 className="text-lg font-semibold mb-3">RETAINER ARRANGEMENT</h2>
                      <p className="text-gray-700 mb-3">
                        This engagement is structured as a monthly retainer arrangement, providing the Client with
                        dedicated access to the Service Provider's expertise and services on an ongoing basis.
                      </p>
                      <div className="space-y-2">
                        <p>
                          <strong>Monthly Hour Allocation:</strong> {data.retainerDetails.monthlyHours} hours per month
                        </p>
                        <p>
                          <strong>Hourly Rate:</strong> {formatCurrency(data.retainerDetails.hourlyRate)}
                        </p>
                        <p>
                          <strong>Monthly Retainer Fee:</strong> {formatCurrency(data.retainerDetails.retainerFee)}
                        </p>
                      </div>
                      <p className="text-gray-700 mt-3">
                        The monthly retainer fee secures the allocated hours and priority access to services. Any hours
                        exceeding the monthly allocation will be billed at the standard hourly rate.
                      </p>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Terms */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">TERMS AND CONDITIONS</h2>
                  <div className="space-y-3">
                    {data.terms.paymentTerms && (
                      <div>
                        <p className="font-semibold">Payment Terms:</p>
                        <p className="text-gray-700">
                          All invoices are {formatPaymentTerms(data.terms.paymentTerms)}. Late payments may incur
                          interest charges at a rate of 1.5% per month.
                        </p>
                      </div>
                    )}

                    {data.terms.intellectualProperty && (
                      <div>
                        <p className="font-semibold">Intellectual Property Rights:</p>
                        <p className="text-gray-700">{data.terms.intellectualProperty}</p>
                      </div>
                    )}

                    {data.terms.revisions > 0 && (
                      <div>
                        <p className="font-semibold">Revisions and Changes:</p>
                        <p className="text-gray-700">
                          This agreement includes up to {data.terms.revisions} rounds of revisions for each major
                          deliverable. Additional revisions beyond this scope will be subject to additional charges at
                          the standard hourly rate.
                        </p>
                      </div>
                    )}

                    {data.terms.confidentiality && (
                      <div>
                        <p className="font-semibold">Confidentiality:</p>
                        <p className="text-gray-700">
                          Both parties acknowledge that they may have access to confidential information during the
                          course of this engagement. Each party agrees to maintain the confidentiality of such
                          information.
                        </p>
                      </div>
                    )}

                    {data.terms.cancellationPolicy && (
                      <div>
                        <p className="font-semibold">Termination and Cancellation:</p>
                        <p className="text-gray-700">{data.terms.cancellationPolicy}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Signature Section */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">ACCEPTANCE AND AUTHORIZATION</h2>
                  <p className="text-gray-700 mb-4">
                    By signing below, both parties acknowledge that they have read, understood, and agree to be bound by
                    the terms and conditions set forth in this Statement of Work.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold">CLIENT ACCEPTANCE:</p>
                      <p>Signature: _________________________ Date: _________</p>
                      <p>{data.clientInfo.contactName}</p>
                      <p>{data.clientInfo.companyName}</p>
                    </div>

                    <div>
                      <p className="font-semibold">SERVICE PROVIDER ACCEPTANCE:</p>
                      <p>Signature: _________________________ Date: _________</p>
                      <p>{data.serviceProvider.contactName}</p>
                      <p>{data.serviceProvider.title || "Authorized Representative"}</p>
                      <p>{data.serviceProvider.companyName}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button onClick={onDownloadDocx} disabled={isGenerating} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Download DOCX"}
          </Button>
          <Button
            onClick={onDownloadPdf}
            disabled={isGenerating}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <Download className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Download PDF"}
          </Button>
          <Button onClick={onSendForSignature} className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send for Signature
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
