"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lightbulb } from "lucide-react"
import type { SOWData } from "@/app/page"

interface TermsStepProps {
  data: SOWData
  updateData: (section: keyof SOWData, data: any) => void
  onNext: () => void
  onPrev: () => void
}

export function TermsStep({ data, updateData, onNext, onPrev }: TermsStepProps) {
  const [customPaymentTerms, setCustomPaymentTerms] = useState("")
  const [showCustomPayment, setShowCustomPayment] = useState(false)
  const [showCustomIP, setShowCustomIP] = useState(false)
  const [customIPTerms, setCustomIPTerms] = useState("")
  const [includeRevisions, setIncludeRevisions] = useState(true)
  const [includeLateFeesPolicy, setIncludeLateFeesPolicy] = useState(false)
  const [lateFeeDetails, setLateFeeDetails] = useState(
    "Any invoice that is more than 7 days overdue will incur a 10% late fee.",
  )
  const [includeCancellationPolicy, setIncludeCancellationPolicy] = useState(false)

  const handleTermsChange = (field: string, value: any) => {
    updateData("terms", { [field]: value })
  }

  const standardCancellationPolicies = [
    "Either party may terminate this agreement with 30 days written notice. Client will be responsible for payment of all work completed up to the termination date.",
    "This agreement may be terminated by either party with 14 days written notice. Upon termination, all outstanding invoices become immediately due and payable.",
    "Client may terminate this agreement at any time with written notice. Service provider reserves the right to terminate with 30 days notice for non-payment or breach of terms.",
    "For retainer agreements: Either party may terminate with 30 days notice. Unused retainer hours are non-refundable. For project work: Termination requires completion of current milestone and payment of all work performed.",
  ]

  const standardIPClauses = [
    "All work product created under this agreement shall be owned by the Client upon full payment of all fees.",
    "Service Provider retains ownership of all pre-existing intellectual property and grants Client a license to use deliverables.",
    "Client owns final deliverables. Service Provider retains rights to methodologies, processes, and general knowledge gained.",
    "Shared ownership: Client owns project-specific deliverables, Service Provider retains rights to reusable components and frameworks.",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Terms & Conditions</CardTitle>
        <CardDescription>Define the legal and business terms for this engagement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Terms */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payment Terms</h3>
          <div className="space-y-2">
            <Label htmlFor="payment-terms">Payment Terms</Label>
            <Select
              value={showCustomPayment ? "custom" : data.terms.paymentTerms}
              onValueChange={(value) => {
                if (value === "custom") {
                  setShowCustomPayment(true)
                } else {
                  setShowCustomPayment(false)
                  handleTermsChange("paymentTerms", value)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="net-15">Net 15 days</SelectItem>
                <SelectItem value="net-30">Net 30 days</SelectItem>
                <SelectItem value="net-45">Net 45 days</SelectItem>
                <SelectItem value="due-on-receipt">Due on receipt</SelectItem>
                <SelectItem value="50-50">50% upfront, 50% on completion</SelectItem>
                <SelectItem value="monthly">Monthly billing</SelectItem>
                <SelectItem value="milestone">Milestone-based payments</SelectItem>
                <SelectItem value="custom">Custom terms...</SelectItem>
              </SelectContent>
            </Select>

            {showCustomPayment && (
              <div className="mt-2">
                <Input
                  value={customPaymentTerms}
                  onChange={(e) => setCustomPaymentTerms(e.target.value)}
                  placeholder="Enter custom payment terms..."
                  onBlur={() => {
                    if (customPaymentTerms.trim()) {
                      handleTermsChange("paymentTerms", customPaymentTerms)
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Late Fee Policy */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-late-fees"
                checked={includeLateFeesPolicy}
                onCheckedChange={(checked) => {
                  setIncludeLateFeesPolicy(!!checked)
                  if (!checked) {
                    setLateFeeDetails("")
                    handleTermsChange("lateFeePolicy", "")
                  } else {
                    const defaultText = "Any invoice that is more than 7 days overdue will incur a 10% late fee."
                    setLateFeeDetails(defaultText)
                    handleTermsChange("lateFeePolicy", defaultText)
                  }
                }}
              />
              <Label htmlFor="include-late-fees">Include late fee policy</Label>
            </div>

            {includeLateFeesPolicy && (
              <div className="space-y-2">
                <Label htmlFor="late-fee-details">Late Fee Details</Label>
                <Textarea
                  id="late-fee-details"
                  value={lateFeeDetails}
                  onChange={(e) => {
                    setLateFeeDetails(e.target.value)
                    handleTermsChange("lateFeePolicy", e.target.value)
                  }}
                  placeholder="Any invoice that is more than 7 days overdue will incur a 10% late fee."
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Specify your late payment penalties, interest rates, and consequences for overdue accounts
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-cancellation"
              checked={includeCancellationPolicy}
              onCheckedChange={(checked) => {
                setIncludeCancellationPolicy(!!checked)
                if (!checked) {
                  handleTermsChange("cancellationPolicy", "")
                }
              }}
            />
            <Label htmlFor="include-cancellation">Include cancellation policy</Label>
          </div>

          {includeCancellationPolicy && (
            <>
              {/* Standard Language Suggestions */}
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Standard Cancellation Policies (Click to Use)
                  </span>
                </div>
                <div className="space-y-2">
                  {standardCancellationPolicies.map((policy, index) => (
                    <div
                      key={index}
                      className="text-xs text-green-700 cursor-pointer hover:text-green-900 p-2 hover:bg-green-100 rounded border border-green-200"
                      onClick={() => handleTermsChange("cancellationPolicy", policy)}
                    >
                      {policy}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellation-policy">Cancellation Terms</Label>
                <Textarea
                  id="cancellation-policy"
                  value={data.terms.cancellationPolicy}
                  onChange={(e) => handleTermsChange("cancellationPolicy", e.target.value)}
                  placeholder="Enter custom cancellation terms or select from suggestions above..."
                  rows={4}
                />
              </div>
            </>
          )}
        </div>

        {/* Intellectual Property */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Intellectual Property</h3>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="include-ip-terms"
              checked={!!data.terms.intellectualProperty}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleTermsChange("intellectualProperty", "client-owns")
                } else {
                  handleTermsChange("intellectualProperty", "")
                }
              }}
            />
            <Label htmlFor="include-ip-terms">Include intellectual property terms in SOW</Label>
          </div>

          {!!data.terms.intellectualProperty && (
            <>
              <Label htmlFor="intellectual-property">IP Ownership</Label>
              <Select
                value={showCustomIP ? "custom" : data.terms.intellectualProperty}
                onValueChange={(value) => {
                  if (value === "custom") {
                    setShowCustomIP(true)
                  } else {
                    setShowCustomIP(false)
                    handleTermsChange("intellectualProperty", value)
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select IP ownership terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client-owns">Client owns all work product upon full payment</SelectItem>
                  <SelectItem value="provider-retains">Service provider retains IP, client gets license</SelectItem>
                  <SelectItem value="shared-ownership">Shared ownership arrangement</SelectItem>
                  <SelectItem value="client-deliverables">
                    Client owns deliverables, provider keeps methodologies
                  </SelectItem>
                  <SelectItem value="custom">Custom arrangement...</SelectItem>
                </SelectContent>
              </Select>

              {showCustomIP && (
                <div className="mt-2">
                  <Textarea
                    value={customIPTerms}
                    onChange={(e) => setCustomIPTerms(e.target.value)}
                    placeholder="Enter custom IP ownership terms..."
                    rows={3}
                    onBlur={() => {
                      if (customIPTerms.trim()) {
                        handleTermsChange("intellectualProperty", customIPTerms)
                      }
                    }}
                  />
                </div>
              )}

              {/* Standard IP Language Suggestions */}
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Standard IP Language Examples</span>
                </div>
                <div className="space-y-2">
                  {standardIPClauses.map((clause, index) => (
                    <div
                      key={index}
                      className="text-xs text-purple-700 cursor-pointer hover:text-purple-900 p-2 hover:bg-purple-100 rounded border border-purple-200"
                      onClick={() => {
                        setShowCustomIP(true)
                        setCustomIPTerms(clause)
                        handleTermsChange("intellectualProperty", clause)
                      }}
                    >
                      {clause}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Revisions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Revisions & Changes</h3>

          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="include-revisions"
              checked={includeRevisions}
              onCheckedChange={(checked) => {
                setIncludeRevisions(!!checked)
                if (!checked) {
                  handleTermsChange("revisions", 0)
                } else {
                  handleTermsChange("revisions", 3)
                }
              }}
            />
            <Label htmlFor="include-revisions">Include revision terms in SOW</Label>
          </div>

          {includeRevisions && (
            <div className="space-y-2">
              <Label htmlFor="revisions">Number of Included Revisions</Label>
              <Input
                id="revisions"
                type="number"
                value={data.terms.revisions}
                onChange={(e) => handleTermsChange("revisions", Number.parseInt(e.target.value) || 0)}
                placeholder="3"
              />
              <p className="text-xs text-gray-500">Additional revisions beyond this number may incur extra charges</p>
            </div>
          )}
        </div>

        {/* Confidentiality */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Confidentiality</h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="confidentiality"
              checked={data.terms.confidentiality}
              onCheckedChange={(checked) => handleTermsChange("confidentiality", checked)}
            />
            <Label htmlFor="confidentiality">Include mutual non-disclosure agreement (NDA) terms</Label>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrev}>
            Back
          </Button>
          <Button onClick={onNext}>Review SOW</Button>
        </div>
      </CardContent>
    </Card>
  )
}
