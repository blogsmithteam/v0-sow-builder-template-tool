"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import type { SOWData } from "@/app/page"

interface ClientInfoStepProps {
  data: SOWData
  updateData: (section: keyof SOWData, data: any) => void
  onNext: () => void
  onPrev: () => void
}

export function ClientInfoStep({ data, updateData, onNext, onPrev }: ClientInfoStepProps) {
  const handleClientInfoChange = (field: string, value: string) => {
    updateData("clientInfo", { [field]: value })
  }

  const handleServiceProviderChange = (field: string, value: string) => {
    updateData("serviceProvider", { [field]: value })
  }

  const canProceed =
    data.clientInfo.companyName &&
    data.clientInfo.contactName &&
    data.serviceProvider.companyName &&
    data.serviceProvider.contactName

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Enter the client and service provider details for this engagement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Client Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Client Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-company">Company Name *</Label>
              <Input
                id="client-company"
                value={data.clientInfo.companyName}
                onChange={(e) => handleClientInfoChange("companyName", e.target.value)}
                placeholder="Acme Corporation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-contact">Contact Name *</Label>
              <Input
                id="client-contact"
                value={data.clientInfo.contactName}
                onChange={(e) => handleClientInfoChange("contactName", e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-email">Email Address</Label>
              <Input
                id="client-email"
                type="email"
                value={data.clientInfo.email}
                onChange={(e) => handleClientInfoChange("email", e.target.value)}
                placeholder="john@acme.com"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Service Provider Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Service Provider Information</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-800">Default Information (Editable)</span>
            </div>
            <p className="text-xs text-blue-700">
              Your default service provider information is pre-filled below. You can edit any field as needed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provider-company">Company Name *</Label>
              <Input
                id="provider-company"
                value={data.serviceProvider.companyName}
                onChange={(e) => handleServiceProviderChange("companyName", e.target.value)}
                placeholder="Your Company LLC"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider-contact">Contact Name *</Label>
              <Input
                id="provider-contact"
                value={data.serviceProvider.contactName}
                onChange={(e) => handleServiceProviderChange("contactName", e.target.value)}
                placeholder="Your Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider-title">Title</Label>
              <Input
                id="provider-title"
                value={data.serviceProvider.title}
                onChange={(e) => handleServiceProviderChange("title", e.target.value)}
                placeholder="CEO, Your Company"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider-email">Email Address</Label>
              <Input
                id="provider-email"
                type="email"
                value={data.serviceProvider.email}
                onChange={(e) => handleServiceProviderChange("email", e.target.value)}
                placeholder="you@yourcompany.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider-website">Website</Label>
              <Input
                id="provider-website"
                type="url"
                value={data.serviceProvider.website}
                onChange={(e) => handleServiceProviderChange("website", e.target.value)}
                placeholder="https://www.yourcompany.com"
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="provider-address">Address</Label>
            <Textarea
              id="provider-address"
              value={data.serviceProvider.address}
              onChange={(e) => handleServiceProviderChange("address", e.target.value)}
              placeholder="123 Business St, Suite 100, City, State 12345"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrev}>
            Back
          </Button>
          <Button onClick={onNext} disabled={!canProceed}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
