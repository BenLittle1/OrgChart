import { OrgNode } from '../types';

/**
 * Complete organizational maturity assessment data structure
 * 7 main categories with 50+ individual tasks covering all aspects of business operations
 */
export const organizationalData: OrgNode = {
  id: 'root',
  name: 'My Company',
  isComplete: false,
  children: [
    {
      id: '1',
      name: 'Corporate & Governance',
      isComplete: false,
      description: 'Legal foundation, compliance, and investor management',
      children: [
        {
          id: '1.1',
          name: 'Business Formation',
          isComplete: false,
          children: [
            { id: '1.1.1', name: 'Business Plan Creation', isComplete: false, children: [], priority: 'high' },
            { id: '1.1.2', name: 'Name Registration & Trademark', isComplete: false, children: [], priority: 'high' },
            { id: '1.1.3', name: 'Legal Structure (LLC, Corp)', isComplete: false, children: [], priority: 'high' },
            { id: '1.1.4', name: 'Articles of Incorporation', isComplete: false, children: [], priority: 'high' },
            { id: '1.1.5', name: 'Operating Agreement/Bylaws', isComplete: false, children: [], priority: 'medium' },
          ],
        },
        {
          id: '1.2',
          name: 'Legal Compliance',
          isComplete: false,
          children: [
            { id: '1.2.1', name: 'Business License & Permits', isComplete: false, children: [], priority: 'high' },
            { id: '1.2.2', name: 'Tax ID (EIN)', isComplete: false, children: [], priority: 'high' },
            { id: '1.2.3', name: 'Regulatory Compliance', isComplete: false, children: [], priority: 'medium' },
            { id: '1.2.4', name: 'Industry-Specific Licenses', isComplete: false, children: [], priority: 'medium' },
          ],
        },
        {
          id: '1.3',
          name: 'Investor Management',
          isComplete: false,
          children: [
            { id: '1.3.1', name: 'Cap Table Management', isComplete: false, children: [], priority: 'medium' },
            { id: '1.3.2', name: 'Board of Directors Setup', isComplete: false, children: [], priority: 'medium' },
            { id: '1.3.3', name: 'Shareholder Agreements', isComplete: false, children: [], priority: 'medium' },
            { id: '1.3.4', name: 'Investor Reporting System', isComplete: false, children: [], priority: 'low' },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'Finance & Accounting',
      isComplete: false,
      description: 'Financial systems, accounting processes, and money management',
      children: [
        {
          id: '2.1',
          name: 'Financial Setup',
          isComplete: false,
          children: [
            { id: '2.1.1', name: 'Business Bank Account', isComplete: false, children: [], priority: 'high' },
            { id: '2.1.2', name: 'Accounting Software Setup', isComplete: false, children: [], priority: 'high' },
            { id: '2.1.3', name: 'Chart of Accounts', isComplete: false, children: [], priority: 'high' },
            { id: '2.1.4', name: 'Business Credit Cards', isComplete: false, children: [], priority: 'medium' },
            { id: '2.1.5', name: 'Expense Management System', isComplete: false, children: [], priority: 'medium' },
          ],
        },
        {
          id: '2.2',
          name: 'Accounting Processes',
          isComplete: false,
          children: [
            { id: '2.2.1', name: 'Monthly Bookkeeping', isComplete: false, children: [], priority: 'high' },
            { id: '2.2.2', name: 'Financial Statement Preparation', isComplete: false, children: [], priority: 'high' },
            { id: '2.2.3', name: 'Tax Preparation & Filing', isComplete: false, children: [], priority: 'high' },
            { id: '2.2.4', name: 'Audit Preparation', isComplete: false, children: [], priority: 'medium' },
          ],
        },
        {
          id: '2.3',
          name: 'Financial Management',
          isComplete: false,
          children: [
            { id: '2.3.1', name: 'Cash Flow Management', isComplete: false, children: [], priority: 'high' },
            { id: '2.3.2', name: 'Budget & Forecasting', isComplete: false, children: [], priority: 'high' },
            { id: '2.3.3', name: 'Financial Reporting Dashboard', isComplete: false, children: [], priority: 'medium' },
            { id: '2.3.4', name: 'Investor Financial Reporting', isComplete: false, children: [], priority: 'medium' },
          ],
        },
      ],
    },
    {
      id: '3',
      name: 'Human Resources',
      isComplete: false,
      description: 'Recruitment, onboarding, and employee management systems',
      children: [
        {
          id: '3.1',
          name: 'Recruitment & Hiring',
          isComplete: false,
          children: [
            { id: '3.1.1', name: 'Job Descriptions & Requirements', isComplete: false, children: [], priority: 'high' },
            { id: '3.1.2', name: 'Recruitment Process', isComplete: false, children: [], priority: 'high' },
            { id: '3.1.3', name: 'Interview Framework', isComplete: false, children: [], priority: 'medium' },
            { id: '3.1.4', name: 'Background Check Process', isComplete: false, children: [], priority: 'medium' },
          ],
        },
        {
          id: '3.2',
          name: 'Employee Onboarding',
          isComplete: false,
          children: [
            { id: '3.2.1', name: 'Onboarding Checklist', isComplete: false, children: [], priority: 'high' },
            { id: '3.2.2', name: 'Employee Handbook', isComplete: false, children: [], priority: 'high' },
            { id: '3.2.3', name: 'IT Setup & Access Management', isComplete: false, children: [], priority: 'high' },
            { id: '3.2.4', name: 'Training Program', isComplete: false, children: [], priority: 'medium' },
          ],
        },
        {
          id: '3.3',
          name: 'Employee Management',
          isComplete: false,
          children: [
            { id: '3.3.1', name: 'Performance Review System', isComplete: false, children: [], priority: 'medium' },
            { id: '3.3.2', name: 'Compensation & Benefits', isComplete: false, children: [], priority: 'high' },
            { id: '3.3.3', name: 'Time Tracking System', isComplete: false, children: [], priority: 'medium' },
            { id: '3.3.4', name: 'Employee Development Plans', isComplete: false, children: [], priority: 'low' },
          ],
        },
      ],
    },
    {
      id: '4',
      name: 'Sales & Marketing',
      isComplete: false,
      description: 'Market strategy, online presence, and customer acquisition',
      children: [
        {
          id: '4.1',
          name: 'Marketing Strategy',
          isComplete: false,
          children: [
            { id: '4.1.1', name: 'Target Market Analysis', isComplete: false, children: [], priority: 'high' },
            { id: '4.1.2', name: 'Brand Identity & Messaging', isComplete: false, children: [], priority: 'high' },
            { id: '4.1.3', name: 'Marketing Plan & Budget', isComplete: false, children: [], priority: 'high' },
            { id: '4.1.4', name: 'Competitive Analysis', isComplete: false, children: [], priority: 'medium' },
          ],
        },
        {
          id: '4.2',
          name: 'Online Presence',
          isComplete: false,
          children: [
            { id: '4.2.1', name: 'Website Development', isComplete: false, children: [], priority: 'high' },
            { id: '4.2.2', name: 'SEO Optimization', isComplete: false, children: [], priority: 'medium' },
            { id: '4.2.3', name: 'Social Media Strategy', isComplete: false, children: [], priority: 'medium' },
            { id: '4.2.4', name: 'Content Marketing Plan', isComplete: false, children: [], priority: 'medium' },
          ],
        },
        {
          id: '4.3',
          name: 'Sales Process',
          isComplete: false,
          children: [
            { id: '4.3.1', name: 'Sales Funnel Design', isComplete: false, children: [], priority: 'high' },
            { id: '4.3.2', name: 'CRM System Setup', isComplete: false, children: [], priority: 'high' },
            { id: '4.3.3', name: 'Lead Generation Process', isComplete: false, children: [], priority: 'high' },
            { id: '4.3.4', name: 'Sales Training & Scripts', isComplete: false, children: [], priority: 'medium' },
          ],
        },
      ],
    },
    {
      id: '5',
      name: 'Operations & Product',
      isComplete: false,
      description: 'Product development, operations, and customer support',
      children: [
        {
          id: '5.1',
          name: 'Product Development',
          isComplete: false,
          children: [
            { id: '5.1.1', name: 'Product Roadmap', isComplete: false, children: [], priority: 'high' },
            { id: '5.1.2', name: 'Development Process', isComplete: false, children: [], priority: 'high' },
            { id: '5.1.3', name: 'Quality Assurance', isComplete: false, children: [], priority: 'high' },
            { id: '5.1.4', name: 'Product Launch Strategy', isComplete: false, children: [], priority: 'medium' },
          ],
        },
        {
          id: '5.2',
          name: 'Operations Management',
          isComplete: false,
          children: [
            { id: '5.2.1', name: 'Supply Chain Management', isComplete: false, children: [], priority: 'medium' },
            { id: '5.2.2', name: 'Inventory Management', isComplete: false, children: [], priority: 'medium' },
            { id: '5.2.3', name: 'Vendor Management', isComplete: false, children: [], priority: 'medium' },
            { id: '5.2.4', name: 'Process Documentation', isComplete: false, children: [], priority: 'medium' },
          ],
        },
        {
          id: '5.3',
          name: 'Customer Support',
          isComplete: false,
          children: [
            { id: '5.3.1', name: 'Support System Setup', isComplete: false, children: [], priority: 'high' },
            { id: '5.3.2', name: 'Customer Success Process', isComplete: false, children: [], priority: 'medium' },
            { id: '5.3.3', name: 'Feedback Collection System', isComplete: false, children: [], priority: 'medium' },
            { id: '5.3.4', name: 'Knowledge Base Creation', isComplete: false, children: [], priority: 'low' },
          ],
        },
      ],
    },
    {
      id: '6',
      name: 'Technology & IP',
      isComplete: false,
      description: 'IT infrastructure and intellectual property management',
      children: [
        {
          id: '6.1',
          name: 'IT Infrastructure',
          isComplete: false,
          children: [
            { id: '6.1.1', name: 'IT Security Framework', isComplete: false, children: [], priority: 'high' },
            { id: '6.1.2', name: 'Data Backup & Recovery', isComplete: false, children: [], priority: 'high' },
            { id: '6.1.3', name: 'Cloud Infrastructure', isComplete: false, children: [], priority: 'medium' },
            { id: '6.1.4', name: 'Software License Management', isComplete: false, children: [], priority: 'medium' },
          ],
        },
        {
          id: '6.2',
          name: 'Intellectual Property',
          isComplete: false,
          children: [
            { id: '6.2.1', name: 'IP Strategy & Protection', isComplete: false, children: [], priority: 'medium' },
            { id: '6.2.2', name: 'Patent Applications', isComplete: false, children: [], priority: 'low' },
            { id: '6.2.3', name: 'Trade Secrets Management', isComplete: false, children: [], priority: 'medium' },
            { id: '6.2.4', name: 'IP Documentation', isComplete: false, children: [], priority: 'low' },
          ],
        },
      ],
    },
    {
      id: '7',
      name: 'Risk & Insurance',
      isComplete: false,
      description: 'Risk management and insurance coverage',
      children: [
        {
          id: '7.1',
          name: 'Insurance Management',
          isComplete: false,
          children: [
            { id: '7.1.1', name: 'General Liability Insurance', isComplete: false, children: [], priority: 'high' },
            { id: '7.1.2', name: 'Professional Liability Insurance', isComplete: false, children: [], priority: 'high' },
            { id: '7.1.3', name: 'Cyber Liability Insurance', isComplete: false, children: [], priority: 'medium' },
            { id: '7.1.4', name: 'Workers\' Compensation', isComplete: false, children: [], priority: 'medium' },
          ],
        },
        {
          id: '7.2',
          name: 'Risk Management',
          isComplete: false,
          children: [
            { id: '7.2.1', name: 'Risk Assessment Framework', isComplete: false, children: [], priority: 'medium' },
            { id: '7.2.2', name: 'Business Continuity Plan', isComplete: false, children: [], priority: 'medium' },
            { id: '7.2.3', name: 'Crisis Management Plan', isComplete: false, children: [], priority: 'low' },
            { id: '7.2.4', name: 'Legal Risk Management', isComplete: false, children: [], priority: 'medium' },
          ],
        },
      ],
    },
  ],
};