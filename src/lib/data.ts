import { OrgNode } from '../types';

export const initialData: OrgNode = {
  "id": "root",
  "name": "My Company",
  "isComplete": false,
  "children": [
    {
      "id": "1", "name": "Corporate & Governance", "isComplete": false,
      "children": [
        { "id": "1.1", "name": "Business Formation", "isComplete": false, "children": [
          { "id": "1.1.1", "name": "Business Plan Creation", "isComplete": false, "children": [] },
          { "id": "1.1.2", "name": "Name Registration", "isComplete": false, "children": [] },
          { "id": "1.1.3", "name": "Legal Structure (LLC, Corp)", "isComplete": false, "children": [] },
          { "id": "1.1.4", "name": "Federal & State Registration", "isComplete": false, "children": [] },
          { "id": "1.1.5", "name": "Obtain Business Licenses & Permits", "isComplete": false, "children": [] }
        ]},
        { "id": "1.2", "name": "Legal & Compliance", "isComplete": false, "children": [
          { "id": "1.2.1", "name": "Draft Founder/Shareholder Agreements", "isComplete": false, "children": [] },
          { "id": "1.2.2", "name": "Establish Corporate Bylaws & Minute Books", "isComplete": false, "children": [] },
          { "id": "1.2.3", "name": "Data Privacy Compliance (GDPR, CCPA)", "isComplete": false, "children": [] },
          { "id": "1.2.4", "name": "Terms of Service & Privacy Policy", "isComplete": false, "children": [] },
          { "id": "1.2.5", "name": "Identify Third-Party Consents/Approvals", "isComplete": false, "children": [] }
        ]},
        { "id": "1.3", "name": "Investor & Shareholder Management", "isComplete": false, "children": [
          { "id": "1.3.1", "name": "Maintain Capitalization Table", "isComplete": false, "children": [] },
          { "id": "1.3.2", "name": "Pitch Deck Creation", "isComplete": false, "children": [] },
          { "id": "1.3.3", "name": "Fundraising Rounds", "isComplete": false, "children": [] },
          { "id": "1.3.4", "name": "Investor Reporting", "isComplete": false, "children": [] },
          { "id": "1.3.5", "name": "Manage Stock Option/Equity Plans", "isComplete": false, "children": [] }
        ]}
      ]
    },
    {
      "id": "2", "name": "Finance & Accounting", "isComplete": false,
      "children": [
        { "id": "2.1", "name": "Financial Setup", "isComplete": false, "children": [
          { "id": "2.1.1", "name": "Open Business Bank Account", "isComplete": false, "children": [] },
          { "id": "2.1.2", "name": "Setup Chart of Accounts", "isComplete": false, "children": [] },
          { "id": "2.1.3", "name": "Implement Accounting Software", "isComplete": false, "children": [] }
        ]},
        { "id": "2.2", "name": "Core Accounting", "isComplete": false, "children": [
          { "id": "2.2.1", "name": "Accounts Payable Process", "isComplete": false, "children": [] },
          { "id": "2.2.2", "name": "Accounts Receivable Process", "isComplete": false, "children": [] },
          { "id": "2.2.3", "name": "Payroll Processing", "isComplete": false, "children": [] },
          { "id": "2.2.4", "name": "Bank Reconciliation", "isComplete": false, "children": [] }
        ]},
        { "id": "2.3", "name": "Financial Management", "isComplete": false, "children": [
          { "id": "2.3.1", "name": "Budgeting & Forecasting", "isComplete": false, "children": [] },
          { "id": "2.3.2", "name": "Financial Statement Preparation", "isComplete": false, "children": [] },
          { "id": "2.3.3", "name": "Tax Planning & Filing", "isComplete": false, "children": [] },
          { "id": "2.3.4", "name": "Expense Management", "isComplete": false, "children": [] },
          { "id": "2.3.5", "name": "Manage Credit Agreements", "isComplete": false, "children": [] }
        ]}
      ]
    },
    {
      "id": "3", "name": "Human Resources", "isComplete": false,
      "children": [
        { "id": "3.1", "name": "Recruitment & Hiring", "isComplete": false, "children": [
          { "id": "3.1.1", "name": "Job Description Creation", "isComplete": false, "children": [] },
          { "id": "3.1.2", "name": "Applicant Tracking System", "isComplete": false, "children": [] },
          { "id": "3.1.3", "name": "Interview Process", "isComplete": false, "children": [] },
          { "id": "3.1.4", "name": "Offer Letter & Contracts", "isComplete": false, "children": [] }
        ]},
        { "id": "3.2", "name": "Onboarding & Training", "isComplete": false, "children": [
          { "id": "3.2.1", "name": "New Hire Paperwork", "isComplete": false, "children": [] },
          { "id": "3.2.2", "name": "Company Orientation", "isComplete": false, "children": [] },
          { "id": "3.2.3", "name": "Role-Specific Training", "isComplete": false, "children": [] }
        ]},
        { "id": "3.3", "name": "Employee Management", "isComplete": false, "children": [
          { "id": "3.3.1", "name": "Performance Review System", "isComplete": false, "children": [] },
          { "id": "3.3.2", "name": "Benefits Administration", "isComplete": false, "children": [] },
          { "id": "3.3.3", "name": "HR Policies & Handbook", "isComplete": false, "children": [] },
          { "id": "3.3.4", "name": "Offboarding Process", "isComplete": false, "children": [] }
        ]}
      ]
    },
    {
      "id": "4", "name": "Sales & Marketing", "isComplete": false,
      "children": [
        { "id": "4.1", "name": "Marketing Strategy", "isComplete": false, "children": [
          { "id": "4.1.1", "name": "Market Research", "isComplete": false, "children": [] },
          { "id": "4.1.2", "name": "Brand Identity & Messaging", "isComplete": false, "children": [] },
          { "id": "4.1.3", "name": "Marketing Plan & Budget", "isComplete": false, "children": [] }
        ]},
        { "id": "4.2", "name": "Online Presence", "isComplete": false, "children": [
          { "id": "4.2.1", "name": "Website Development", "isComplete": false, "children": [] },
          { "id": "4.2.2", "name": "Social Media Setup", "isComplete": false, "children": [] },
          { "id": "4.2.3", "name": "SEO Strategy", "isComplete": false, "children": [] }
        ]},
        { "id": "4.3", "name": "Lead Generation & Sales", "isComplete": false, "children": [
          { "id": "4.3.1", "name": "CRM Setup", "isComplete": false, "children": [] },
          { "id": "4.3.2", "name": "Sales Funnel Definition", "isComplete": false, "children": [] },
          { "id": "4.3.3", "name": "Content Marketing", "isComplete": false, "children": [] },
          { "id": "4.3.4", "name": "Paid Advertising", "isComplete": false, "children": [] }
        ]}
      ]
    },
    {
      "id": "5", "name": "Operations & Product", "isComplete": false,
      "children": [
        { "id": "5.1", "name": "Product/Service Development", "isComplete": false, "children": [
          { "id": "5.1.1", "name": "Idea & Concept Validation", "isComplete": false, "children": [] },
          { "id": "5.1.2", "name": "Prototyping & MVP", "isComplete": false, "children": [] },
          { "id": "5.1.3", "name": "Beta Testing & Feedback Loop", "isComplete": false, "children": [] },
          { "id": "5.1.4", "name": "Product Launch", "isComplete": false, "children": [] }
        ]},
        { "id": "5.2", "name": "Supply Chain & Customer Mgmt", "isComplete": false, "children": [
          { "id": "5.2.1", "name": "Supplier Sourcing & Vetting", "isComplete": false, "children": [] },
          { "id": "5.2.2", "name": "Inventory Management System", "isComplete": false, "children": [] },
          { "id": "5.2.3", "name": "Shipping & Fulfillment", "isComplete": false, "children": [] },
          { "id": "5.2.4", "name": "Track Customer Churn", "isComplete": false, "children": [] }
        ]},
        { "id": "5.3", "name": "Customer Support", "isComplete": false, "children": [
          { "id": "5.3.1", "name": "Support Channel Setup", "isComplete": false, "children": [] },
          { "id": "5.3.2", "name": "Ticketing System", "isComplete": false, "children": [] },
          { "id": "5.3.3", "name": "Knowledge Base/FAQ", "isComplete": false, "children": [] }
        ]}
      ]
    },
    {
      "id": "6", "name": "Technology & IP", "isComplete": false,
      "children": [
        { "id": "6.1", "name": "IT & Infrastructure", "isComplete": false, "children": [
          { "id": "6.1.1", "name": "Setup Email & Comms Tools", "isComplete": false, "children": [] },
          { "id": "6.1.2", "name": "Data Backup & Security", "isComplete": false, "children": [] },
          { "id": "6.1.3", "name": "Hardware & Software Procurement", "isComplete": false, "children": [] }
        ]},
        { "id": "6.2", "name": "Intellectual Property", "isComplete": false, "children": [
          { "id": "6.2.1", "name": "Trademark Registration", "isComplete": false, "children": [] },
          { "id": "6.2.2", "name": "Patent Application", "isComplete": false, "children": [] },
          { "id": "6.2.3", "name": "Manage Domain Portfolio", "isComplete": false, "children": [] },
          { "id": "6.2.4", "name": "Third-Party IP Licensing", "isComplete": false, "children": [] }
        ]}
      ]
    },
    {
      "id": "7", "name": "Risk & Insurance", "isComplete": false,
      "children": [
        { "id": "7.1", "name": "Insurance Management", "isComplete": false, "children": [
          { "id": "7.1.1", "name": "Property & Casualty Insurance", "isComplete": false, "children": [] },
          { "id": "7.1.2", "name": "General Liability Insurance", "isComplete": false, "children": [] },
          { "id": "7.1.3", "name": "Directors & Officers Insurance", "isComplete": false, "children": [] }
        ]},
        { "id": "7.2", "name": "Litigation", "isComplete": false, "children": [
          { "id": "7.2.1", "name": "Track Pending/Threatened Claims", "isComplete": false, "children": [] },
          { "id": "7.2.2", "name": "Manage Settlement Agreements", "isComplete": false, "children": [] }
        ]}
      ]
    }
  ]
};