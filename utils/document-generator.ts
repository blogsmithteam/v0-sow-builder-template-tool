import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx"
import jsPDF from "jspdf"
import type { SOWData } from "@/app/page"

export class DocumentGenerator {
  private data: SOWData
  private customContent?: string

  constructor(data: SOWData, customContent?: string) {
    this.data = data
    this.customContent = customContent
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  private formatDate(dateString: string): string {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  private formatDeliverables(): Paragraph[] {
    if (this.data.projectDetails.deliverables.length === 0) return []

    if (this.data.projectDetails.useFeesForContentPhrasing) {
      const deliverablesText = this.data.projectDetails.deliverables.join(", ")
      let content = `The fees will be used for various content projects including ${deliverablesText}.`

      if (this.data.projectDetails.specificProjectDetails) {
        content += ` These deliverables will include ${this.data.projectDetails.specificProjectDetails}.`
      }

      return [
        new Paragraph({
          text: content,
          spacing: { after: 200 },
        }),
      ]
    } else {
      return [
        new Paragraph({
          text: "The Service Provider will deliver the following specific outputs and results to the Client:",
          spacing: { after: 200 },
        }),
        ...this.data.projectDetails.deliverables.map(
          (item, index) =>
            new Paragraph({
              text: `${index + 1}. ${item}`,
              spacing: { after: 100 },
            }),
        ),
      ]
    }
  }

  private formatPaymentTerms(terms: string): string {
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

  async generateDocx(): Promise<Blob> {
    // If custom content is provided, create a simpler document with that content
    if (this.customContent) {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: this.customContent.split("\n").map(
              (line) =>
                new Paragraph({
                  text: line,
                  spacing: { after: line.trim() === "" ? 200 : 100 },
                  run: {
                    size: 22, // 11pt font
                    font: "Calibri",
                  },
                }),
            ),
          },
        ],
      })
      return await Packer.toBlob(doc)
    }

    // Otherwise use the existing structured generation with improved styling
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: "Calibri",
              size: 22, // 11pt
            },
          },
        },
        paragraphStyles: [
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            run: {
              size: 28, // 14pt
              bold: true,
              color: "2F5496",
            },
            paragraph: {
              spacing: { before: 400, after: 200 },
            },
          },
          {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            run: {
              size: 24, // 12pt
              bold: true,
              color: "404040",
            },
            paragraph: {
              spacing: { before: 300, after: 150 },
            },
          },
          {
            id: "Normal",
            name: "Normal",
            run: {
              size: 22, // 11pt
              font: "Calibri",
            },
            paragraph: {
              spacing: { after: 120 },
            },
          },
        ],
      },
      sections: [
        {
          properties: {},
          children: [
            // Title with better styling
            new Paragraph({
              text: "STATEMENT OF WORK",
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
              run: {
                size: 32, // 16pt
                bold: true,
                color: "1F4E79",
                font: "Calibri",
              },
            }),

            // Subtitle
            new Paragraph({
              text: `${this.data.serviceProvider.companyName} & ${this.data.clientInfo.companyName}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
              run: {
                size: 24, // 12pt
                color: "595959",
                font: "Calibri",
              },
            }),

            // Introduction
            new Paragraph({
              text: `This Statement of Work outlines the collaboration between ${this.data.serviceProvider.companyName} and ${this.data.clientInfo.companyName}, including the following key terms:`,
              spacing: { after: 300 },
              run: {
                size: 22,
                font: "Calibri",
              },
            }),

            // Rest of the content with improved styling...
            new Paragraph({
              text: "PARTIES",
              style: "Heading1",
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "CLIENT:",
                  bold: true,
                  size: 22,
                  font: "Calibri",
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: "Company: ", bold: true, size: 22, font: "Calibri" }),
                new TextRun({ text: this.data.clientInfo.companyName, size: 22, font: "Calibri" }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: "Primary Contact: ", bold: true, size: 22, font: "Calibri" }),
                new TextRun({ text: this.data.clientInfo.contactName, size: 22, font: "Calibri" }),
              ],
              spacing: { after: 100 },
            }),

            ...(this.data.clientInfo.email
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Email: ", bold: true, size: 22, font: "Calibri" }),
                      new TextRun({ text: this.data.clientInfo.email, size: 22, font: "Calibri" }),
                    ],
                    spacing: { after: 200 },
                  }),
                ]
              : []),

            new Paragraph({
              children: [new TextRun({ text: "SERVICE PROVIDER:", bold: true, size: 22, font: "Calibri" })],
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: "Company: ", bold: true, size: 22, font: "Calibri" }),
                new TextRun({ text: this.data.serviceProvider.companyName, size: 22, font: "Calibri" }),
              ],
              spacing: { after: 100 },
            }),

            ...(this.data.serviceProvider.website
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Website: ", bold: true, size: 22, font: "Calibri" }),
                      new TextRun({ text: this.data.serviceProvider.website, size: 22, font: "Calibri" }),
                    ],
                    spacing: { after: 100 },
                  }),
                ]
              : []),

            ...(this.data.serviceProvider.address
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Business Address: ", bold: true, size: 22, font: "Calibri" }),
                      new TextRun({ text: this.data.serviceProvider.address, size: 22, font: "Calibri" }),
                    ],
                    spacing: { after: 100 },
                  }),
                ]
              : []),

            // Deliverables
            ...(this.data.projectDetails.deliverables.length > 0 || this.data.projectDetails.description
              ? [
                  new Paragraph({
                    text: "DELIVERABLES AND OUTCOMES",
                    style: "Heading1",
                  }),

                  ...(this.data.projectDetails.description
                    ? [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Project Description:", bold: true, size: 22, font: "Calibri" }),
                          ],
                          spacing: { after: 100 },
                        }),
                        new Paragraph({
                          text: this.data.projectDetails.description,
                          spacing: { after: 200 },
                        }),
                      ]
                    : []),

                  // Project Fees (if applicable)
                  ...(this.data.projectDetails.fees.totalAmount > 0
                    ? [
                        new Paragraph({
                          text: "PROJECT FEES AND PAYMENT STRUCTURE",
                          style: "Heading1",
                        }),

                        new Paragraph({
                          children: [
                            new TextRun({ text: "Total Project Fee: ", bold: true, size: 22, font: "Calibri" }),
                            new TextRun({
                              text: this.formatCurrency(this.data.projectDetails.fees.totalAmount),
                              size: 22,
                              font: "Calibri",
                            }),
                          ],
                          spacing: { after: 100 },
                        }),

                        new Paragraph({
                          children: [
                            new TextRun({ text: "Payment Structure: ", bold: true, size: 22, font: "Calibri" }),
                            new TextRun({
                              text: this.data.projectDetails.fees.paymentStructure.replace(/-/g, " "),
                              size: 22,
                              font: "Calibri",
                            }),
                          ],
                          spacing: { after: 200 },
                        }),
                      ]
                    : []),

                  ...(this.data.projectDetails.deliverables.length > 0
                    ? [
                        new Paragraph({
                          children: [new TextRun({ text: "Deliverables:", bold: true, size: 22, font: "Calibri" })],
                          spacing: { after: 100 },
                        }),
                        ...this.formatDeliverables(),
                      ]
                    : []),
                ]
              : []),

            // Add timeline section before Terms and Conditions
            ...(this.data.projectDetails.timeline ||
            this.data.projectDetails.startDate ||
            this.data.projectDetails.endDate
              ? [
                  new Paragraph({
                    text: "TIMELINE",
                    style: "Heading1",
                  }),
                  ...(this.data.projectDetails.startDate && this.data.projectDetails.endDate
                    ? [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Timeline: ", bold: true, size: 22, font: "Calibri" }),
                            new TextRun({
                              text: `This SOW begins on ${this.formatDate(this.data.projectDetails.startDate)} and will terminate at the end of the day on ${this.formatDate(this.data.projectDetails.endDate)}.`,
                              size: 22,
                              font: "Calibri",
                            }),
                          ],
                          spacing: { after: 200 },
                        }),
                      ]
                    : [
                        ...(this.data.projectDetails.timeline
                          ? [
                              new Paragraph({
                                children: [
                                  new TextRun({ text: "Timeline: ", bold: true, size: 22, font: "Calibri" }),
                                  new TextRun({ text: this.data.projectDetails.timeline, size: 22, font: "Calibri" }),
                                ],
                                spacing: { after: 100 },
                              }),
                            ]
                          : []),
                        ...(this.data.projectDetails.startDate
                          ? [
                              new Paragraph({
                                children: [
                                  new TextRun({ text: "Start Date: ", bold: true, size: 22, font: "Calibri" }),
                                  new TextRun({
                                    text: this.formatDate(this.data.projectDetails.startDate),
                                    size: 22,
                                    font: "Calibri",
                                  }),
                                ],
                                spacing: { after: 100 },
                              }),
                            ]
                          : []),
                        ...(this.data.projectDetails.endDate
                          ? [
                              new Paragraph({
                                children: [
                                  new TextRun({ text: "End Date: ", bold: true, size: 22, font: "Calibri" }),
                                  new TextRun({
                                    text: this.formatDate(this.data.projectDetails.endDate),
                                    size: 22,
                                    font: "Calibri",
                                  }),
                                ],
                                spacing: { after: 200 },
                              }),
                            ]
                          : []),
                      ]),
                ]
              : []),

            // Terms and Conditions section follows here
            new Paragraph({
              text: "TERMS AND CONDITIONS",
              style: "Heading1",
            }),

            // Payment Terms
            ...(this.data.terms.paymentTerms
              ? [
                  new Paragraph({
                    children: [new TextRun({ text: "Payment Terms:", bold: true, size: 22, font: "Calibri" })],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: `All invoices are ${this.formatPaymentTerms(this.data.terms.paymentTerms)}. ${
                      this.data.terms.lateFeePolicy ||
                      "Late payments may incur interest charges at a rate of 1.5% per month."
                    }`,
                    spacing: { after: 200 },
                  }),
                ]
              : []),

            // Intellectual Property (only if provided)
            ...(this.data.terms.intellectualProperty
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Intellectual Property Rights:", bold: true, size: 22, font: "Calibri" }),
                    ],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: this.data.terms.intellectualProperty,
                    spacing: { after: 200 },
                  }),
                ]
              : []),

            // Revisions
            ...(this.data.terms.revisions > 0
              ? [
                  new Paragraph({
                    children: [new TextRun({ text: "Revisions and Changes:", bold: true, size: 22, font: "Calibri" })],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: `This agreement includes up to ${this.data.terms.revisions} rounds of revisions for each major deliverable. Additional revisions beyond this scope will be subject to additional charges at the standard hourly rate. All revision requests must be submitted in writing with specific, actionable feedback.`,
                    spacing: { after: 200 },
                  }),
                ]
              : []),

            // Confidentiality
            ...(this.data.terms.confidentiality
              ? [
                  new Paragraph({
                    children: [new TextRun({ text: "Confidentiality:", bold: true, size: 22, font: "Calibri" })],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: "Both parties acknowledge that they may have access to confidential information during the course of this engagement. Each party agrees to maintain the confidentiality of such information and not to disclose it to third parties without prior written consent. This obligation shall survive the termination of this agreement.",
                    spacing: { after: 200 },
                  }),
                ]
              : []),

            // Cancellation Policy
            ...(this.data.terms.cancellationPolicy
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Termination and Cancellation:", bold: true, size: 22, font: "Calibri" }),
                    ],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: this.data.terms.cancellationPolicy,
                    spacing: { after: 200 },
                  }),
                ]
              : []),

            // Acceptance
            new Paragraph({
              text: "ACCEPTANCE AND AUTHORIZATION",
              style: "Heading1",
            }),

            new Paragraph({
              text: "By signing below, both parties acknowledge that they have read, understood, and agree to be bound by the terms and conditions set forth in this Statement of Work.",
              spacing: { after: 400 },
            }),

            // Signature Section
            new Paragraph({
              text: "CLIENT ACCEPTANCE:",
              spacing: { after: 200 },
            }),

            new Paragraph({
              text: "Signature: _________________________    Date: _________",
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: `Print Name: ${this.data.clientInfo.contactName}`,
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: `Company: ${this.data.clientInfo.companyName}`,
              spacing: { after: 400 },
            }),

            new Paragraph({
              text: "SERVICE PROVIDER ACCEPTANCE:",
              spacing: { after: 200 },
            }),

            new Paragraph({
              text: "Signature: _________________________    Date: _________",
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: `Print Name: ${this.data.serviceProvider.contactName}`,
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: `Title: ${this.data.serviceProvider.title || "Authorized Representative"}`,
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: `Company: ${this.data.serviceProvider.companyName}`,
            }),
          ],
        },
      ],
    })

    return await Packer.toBlob(doc)
  }

  generatePdf(): jsPDF {
    const doc = new jsPDF()

    // Set default font
    doc.setFont("helvetica", "normal")

    if (this.customContent) {
      // Simple text-based PDF generation for custom content with better styling
      const lines = this.customContent.split("\n")
      let yPosition = 25

      lines.forEach((line) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 25
        }

        if (line.trim() === "") {
          yPosition += 4
        } else {
          // Check if it's a heading
          if (line.toUpperCase() === line && line.length > 0 && !line.includes(":")) {
            doc.setFontSize(12)
            doc.setFont("helvetica", "bold")
          } else {
            doc.setFontSize(10)
            doc.setFont("helvetica", "normal")
          }

          const wrappedLines = doc.splitTextToSize(line, 170)
          doc.text(wrappedLines, 20, yPosition)
          yPosition += wrappedLines.length * 5
        }
      })

      return doc
    }

    let yPosition = 25

    // Helper function to add text with better styling
    const addText = (text: string, x: number, y: number, options: any = {}) => {
      const lines = doc.splitTextToSize(text, options.maxWidth || 170)
      doc.text(lines, x, y, options)
      return y + lines.length * (options.lineHeight || 5)
    }

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace = 25) => {
      if (yPosition + requiredSpace > 270) {
        doc.addPage()
        yPosition = 25
      }
    }

    // Title with better styling
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(31, 78, 121) // Dark blue
    doc.text("STATEMENT OF WORK", 105, yPosition, { align: "center" })
    yPosition += 8

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(89, 89, 89) // Gray
    doc.text(`${this.data.serviceProvider.companyName} & ${this.data.clientInfo.companyName}`, 105, yPosition, {
      align: "center",
    })
    yPosition += 15

    // Add a subtle line separator
    doc.setDrawColor(200, 200, 200)
    doc.line(20, yPosition, 190, yPosition)
    yPosition += 10

    // Reset text color
    doc.setTextColor(0, 0, 0)

    // Introduction with better spacing
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    yPosition = addText(
      `This Statement of Work outlines the collaboration between ${this.data.serviceProvider.companyName} and ${this.data.clientInfo.companyName}, including the following key terms:`,
      20,
      yPosition,
      { maxWidth: 170, lineHeight: 5 },
    )
    yPosition += 10

    // Section headers with consistent styling
    const addSectionHeader = (title: string) => {
      checkNewPage()
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(47, 84, 150) // Blue
      doc.text(title, 20, yPosition)
      doc.setTextColor(0, 0, 0) // Reset to black
      yPosition += 8
    }

    const addSubHeader = (title: string) => {
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      yPosition = addText(title, 20, yPosition, { lineHeight: 5 })
    }

    const addBodyText = (text: string, indent = 20) => {
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      yPosition = addText(text, indent, yPosition, { maxWidth: 170 - (indent - 20), lineHeight: 5 })
    }

    // Parties Section
    addSectionHeader("PARTIES")

    addSubHeader("CLIENT:")
    addBodyText(`Company: ${this.data.clientInfo.companyName}`)
    addBodyText(`Primary Contact: ${this.data.clientInfo.contactName}`)

    if (this.data.clientInfo.email) {
      addBodyText(`Email: ${this.data.clientInfo.email}`)
    }
    yPosition += 5

    addSubHeader("SERVICE PROVIDER:")
    addBodyText(`Company: ${this.data.serviceProvider.companyName}`)
    addBodyText(`Primary Contact: ${this.data.serviceProvider.contactName}`)

    if (this.data.serviceProvider.title) {
      addBodyText(`Title: ${this.data.serviceProvider.title}`)
    }

    if (this.data.serviceProvider.email) {
      addBodyText(`Email: ${this.data.serviceProvider.email}`)
    }

    if (this.data.serviceProvider.website) {
      addBodyText(`Website: ${this.data.serviceProvider.website}`)
    }

    if (this.data.serviceProvider.address) {
      addBodyText(`Business Address: ${this.data.serviceProvider.address}`)
    }
    yPosition += 10

    // Project Details
    checkNewPage()
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("PROJECT SCOPE AND OBJECTIVES", 20, yPosition)
    yPosition += 10

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    yPosition = addText(`Project Title: ${this.data.projectDetails.projectName}`, 20, yPosition)
    yPosition += 5

    doc.setFont("helvetica", "bold")
    yPosition = addText("Project Description:", 20, yPosition)
    doc.setFont("helvetica", "normal")
    yPosition = addText(this.data.projectDetails.description, 20, yPosition, { maxWidth: 170 })
    yPosition += 10

    // Project Fees
    if (this.data.projectDetails.fees.totalAmount > 0) {
      addSectionHeader("PROJECT FEES AND PAYMENT STRUCTURE")

      addBodyText(`Total Project Fee: ${this.formatCurrency(this.data.projectDetails.fees.totalAmount)}`)
      addBodyText(`Payment Structure: ${this.data.projectDetails.fees.paymentStructure.replace(/-/g, " ")}`)
      yPosition += 10
    }

    // Retainer Details (if applicable)
    if (this.data.engagementType === "retainer") {
      checkNewPage()
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("RETAINER ARRANGEMENT", 20, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      yPosition = addText(
        "This engagement is structured as a monthly retainer arrangement, providing the Client with dedicated access to the Service Provider's expertise and services on an ongoing basis.",
        20,
        yPosition,
        { maxWidth: 170 },
      )
      yPosition += 10

      doc.setFontSize(11)
      yPosition = addText(
        `Monthly Hour Allocation: ${this.data.retainerDetails.monthlyHours} hours per month`,
        20,
        yPosition,
      )
      yPosition = addText(`Hourly Rate: ${this.formatCurrency(this.data.retainerDetails.hourlyRate)}`, 20, yPosition)
      yPosition = addText(
        `Monthly Retainer Fee: ${this.formatCurrency(this.data.retainerDetails.retainerFee)}`,
        20,
        yPosition,
      )
      yPosition += 5

      doc.setFontSize(10)
      yPosition = addText(
        "The monthly retainer fee secures the allocated hours and priority access to services. Any hours exceeding the monthly allocation will be billed at the standard hourly rate.",
        20,
        yPosition,
        { maxWidth: 170 },
      )
      yPosition += 10
    }

    // Deliverables
    if (this.data.projectDetails.deliverables.length > 0) {
      checkNewPage()
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("DELIVERABLES AND OUTCOMES", 20, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      yPosition = addText(
        "The Service Provider will deliver the following specific outputs and results to the Client upon completion of the respective project phases:",
        20,
        yPosition,
        { maxWidth: 170 },
      )
      yPosition += 5

      doc.setFontSize(11)
      this.data.projectDetails.deliverables.forEach((item, index) => {
        yPosition = addText(`${index + 1}. ${item}`, 25, yPosition, { maxWidth: 165 })
      })
      yPosition += 10
    }

    // Terms and Conditions
    checkNewPage()
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("TERMS AND CONDITIONS", 20, yPosition)
    yPosition += 10

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")

    if (this.data.terms.paymentTerms) {
      doc.setFont("helvetica", "bold")
      yPosition = addText("Payment Terms:", 20, yPosition)
      doc.setFont("helvetica", "normal")
      const paymentText = `All invoices are ${this.formatPaymentTerms(this.data.terms.paymentTerms)}. ${
        this.data.terms.lateFeePolicy || "Late payments may incur interest charges at a rate of 1.5% per month."
      }`
      yPosition = addText(paymentText, 20, yPosition, { maxWidth: 170 })
      yPosition += 5
    }

    if (this.data.terms.revisions > 0) {
      doc.setFont("helvetica", "bold")
      yPosition = addText("Revisions and Changes:", 20, yPosition)
      doc.setFont("helvetica", "normal")
      yPosition = addText(
        `This agreement includes up to ${this.data.terms.revisions} rounds of revisions for each major deliverable. Additional revisions will be subject to additional charges.`,
        20,
        yPosition,
        { maxWidth: 170 },
      )
      yPosition += 5
    }

    if (this.data.terms.cancellationPolicy) {
      doc.setFont("helvetica", "bold")
      yPosition = addText("Termination and Cancellation:", 20, yPosition)
      doc.setFont("helvetica", "normal")
      yPosition = addText(this.data.terms.cancellationPolicy, 20, yPosition, { maxWidth: 170 })
      yPosition += 5
    }

    // Add new page if needed for signatures
    checkNewPage(60)

    // Signatures
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("ACCEPTANCE AND AUTHORIZATION", 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    yPosition = addText(
      "By signing below, both parties acknowledge that they have read, understood, and agree to be bound by the terms and conditions set forth in this Statement of Work.",
      20,
      yPosition,
      { maxWidth: 170 },
    )
    yPosition += 15

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("CLIENT ACCEPTANCE:", 20, yPosition)
    yPosition += 10

    doc.setFont("helvetica", "normal")
    doc.text("Signature: _________________________ Date: _________", 20, yPosition)
    yPosition += 7
    doc.text(`Print Name: ${this.data.clientInfo.contactName}`, 20, yPosition)
    yPosition += 7
    doc.text(`Company: ${this.data.clientInfo.companyName}`, 20, yPosition)
    yPosition += 15

    doc.setFont("helvetica", "bold")
    doc.text("SERVICE PROVIDER ACCEPTANCE:", 20, yPosition)
    yPosition += 10

    doc.setFont("helvetica", "normal")
    doc.text("Signature: _________________________ Date: _________", 20, yPosition)
    yPosition += 7
    doc.text(`Print Name: ${this.data.serviceProvider.contactName}`, 20, yPosition)
    yPosition += 7
    doc.text(`Title: ${this.data.serviceProvider.title || "Authorized Representative"}`, 20, yPosition)
    yPosition += 7
    doc.text(`Company: ${this.data.serviceProvider.companyName}`, 20, yPosition)

    return doc
  }
}
