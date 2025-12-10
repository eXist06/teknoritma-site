import type { ModuleNode } from "@/types/modules";

export const moduleHierarchy: ModuleNode[] = [
  {
    id: "clinical-care",
    type: "domain",
    name: "Clinical Care (EMR Core)",
    description: "Core EMR workflows: encounters, nursing, specialty care, telehealth.",
    children: [
      {
        id: "clinical-core-journey",
        type: "cluster",
        name: "Core Patient Journey & Clinical Workflow",
        children: [
          {
            id: "central-local-appointment",
            type: "module",
            name: "Central and Local Appointment System",
            tags: ["clinical", "appointment", "scheduling", "emr"]
          },
          {
            id: "reception",
            type: "module",
            name: "Reception Module",
            tags: ["clinical", "admin", "front-office", "patient-access"]
          },
          {
            id: "policlinic",
            type: "module",
            name: "Policlinic Module",
            tags: ["clinical", "outpatient", "emr"]
          },
          {
            id: "inpatient",
            type: "module",
            name: "Inpatient Module",
            tags: ["clinical", "inpatient", "ward", "emr"]
          },
          {
            id: "icu",
            type: "module",
            name: "Intensive Care Module",
            tags: ["clinical", "icu", "critical-care"]
          },
          {
            id: "emergency",
            type: "module",
            name: "Emergency Management Module",
            tags: ["clinical", "ed", "emergency"]
          },
          {
            id: "nursing",
            type: "module",
            name: "Nursing Management Module",
            tags: ["clinical", "nursing", "care-planning"]
          },
          {
            id: "telemedicine",
            type: "module",
            name: "Telemedicine Module",
            tags: ["clinical", "telehealth", "virtual-care"]
          },
          {
            id: "patient-monitoring",
            type: "module",
            name: "Patient Monitoring",
            tags: ["clinical", "monitoring", "vital-signs"]
          },
          {
            id: "patient-chart",
            type: "module",
            name: "Patient Chart",
            tags: ["clinical", "ehr", "medical-history"]
          },
          {
            id: "doctor-notes",
            type: "module",
            name: "Doctor Notes",
            tags: ["clinical", "documentation", "notes"]
          },
          {
            id: "examination",
            type: "module",
            name: "Examination and Consultation",
            tags: ["clinical", "examination", "consultation"]
          },
          {
            id: "medication",
            type: "module",
            name: "Medication Management",
            tags: ["clinical", "medication", "inventory"]
          },
          {
            id: "prescription",
            type: "module",
            name: "Prescription Management",
            tags: ["clinical", "prescription", "e-prescription"]
          },
          {
            id: "lab-integration",
            type: "module",
            name: "Laboratory Integration",
            tags: ["clinical", "integration", "lab-results"]
          },
          {
            id: "radiology-integration",
            type: "module",
            name: "Radiology Integration",
            tags: ["clinical", "integration", "radiology"]
          },
          {
            id: "operating-rooms",
            type: "module",
            name: "Operating Rooms Module",
            tags: ["clinical", "or", "surgery"]
          }
        ]
      },
      {
        id: "clinical-surgical",
        type: "cluster",
        name: "Surgical & Procedural Care",
        children: []
      },
      {
        id: "clinical-specialties",
        type: "cluster",
        name: "Specialty Clinical Programs",
        children: [
          { id: "oncology", type: "module", name: "Oncology Module", tags: ["clinical","oncology"] },
          { id: "orthopedics", type: "module", name: "Orthopedics Module", tags: ["clinical","orthopedics"] },
          { id: "gynecology", type: "module", name: "Gynecology Module", tags: ["clinical","gynecology"] },
          { id: "oral-dental", type: "module", name: "Oral and Dental Health Module", tags: ["clinical","dentistry"] },
          { id: "hemodialysis", type: "module", name: "Hemodialysis Module", tags: ["clinical","nephrology"] },
          { id: "ivf", type: "module", name: "In Vitro Fertilization Module", tags: ["clinical","lab","ivf","diagnostic"] },
          { id: "physiotherapy", type: "module", name: "Physiotherapy Module", tags: ["clinical","rehab"] },
          { id: "diet", type: "module", name: "Diet Module", tags: ["clinical","nutrition"] },
          { id: "social-services", type: "module", name: "Social Services Module", tags: ["clinical","social-care"] },
          { id: "medical-board", type: "module", name: "Medical Board Module", tags: ["clinical","governance"] },
          { id: "mortuary", type: "module", name: "Mortuary Management System", tags: ["clinical","mortuary"] }
        ]
      }
    ]
  },
  {
    id: "diagnostics-package",
    type: "domain",
    name: "Diagnostics Package (LIS / RIS / PACS)",
    description: "Laboratory, imaging, pathology, pharmacy and transfusion services.",
    children: [
      {
        id: "diagnostics-lab",
        type: "cluster",
        name: "Laboratory & Transfusion",
        children: [
          { id: "laboratory", type: "module", name: "Laboratory Module", tags: ["diagnostic","lis","lab"] },
          { id: "blood-center", type: "module", name: "Blood Center Module", tags: ["diagnostic","blood-bank","lab","transfusion"] },
          { id: "genetics-lab", type: "module", name: "Genetics Module", tags: ["diagnostic","lab","genetics","clinical"] }
        ]
      },
      {
        id: "diagnostics-pathology",
        type: "cluster",
        name: "Pathology & Cytology",
        children: [
          { id: "pathology", type: "module", name: "Pathology Module", tags: ["diagnostic","lis","pathology"] }
        ]
      },
      {
        id: "diagnostics-imaging",
        type: "cluster",
        name: "Imaging & Radiology",
        children: [
          { id: "ris", type: "module", name: "Radiology Information System (RIS)", tags: ["diagnostic","ris","radiology"] },
          { id: "pacs", type: "module", name: "PACS", tags: ["diagnostic","pacs","imaging"] },
          { id: "nuclear-medicine", type: "module", name: "Nuclear Medicine Module", tags: ["diagnostic","nuclear-medicine","imaging"] }
        ]
      },
      {
        id: "diagnostics-onco",
        type: "cluster",
        name: "Oncology Diagnostics & Planning",
        children: [
          { id: "radiotherapy-chemo-diag", type: "module", name: "Radiotherapy and Chemotherapy Module", tags: ["diagnostic","oncology","clinical"] }
        ]
      },
      {
        id: "diagnostics-pharmacy",
        type: "cluster",
        name: "Pharmacy & Medication Management",
        children: [
          { id: "pharmacy", type: "module", name: "Pharmacy Module", tags: ["diagnostic","pharmacy","medication"] }
        ]
      }
    ]
  },
  {
    id: "admin-enterprise",
    type: "domain",
    name: "Administrative & Enterprise",
    description: "Revenue cycle, logistics, HR, records and system management.",
    children: [
      {
        id: "admin-revenue-cycle",
        type: "cluster",
        name: "Patient Administration & Revenue Cycle",
        children: [
          { id: "revolving-funds", type: "module", name: "Revolving Funds, Invoicing and Financial Transactions Module", tags: ["admin","billing","finance"] },
          { id: "cash-desk", type: "module", name: "Cash Desk Module", tags: ["admin","billing","cashier"] }
        ]
      },
      {
        id: "admin-resource-planning",
        type: "cluster",
        name: "Resource Planning & Scheduling",
        children: [
          { id: "appointment", type: "module", name: "Appointment System", tags: ["admin","appointment","scheduling"] },
          { id: "bed-management", type: "module", name: "Bed Management", tags: ["admin","bed-management","capacity"] },
          { id: "room-tracking", type: "module", name: "Room & Bed Tracking", tags: ["admin","room-tracking","inventory"] },
          { id: "resource-planning", type: "module", name: "Resource Planning", tags: ["admin","resource-planning","optimization"] }
        ]
      },
      {
        id: "admin-logistics",
        type: "cluster",
        name: "Materials Management & Logistics",
        children: [
          { id: "stock-tracking", type: "module", name: "Stock Tracking System", tags: ["admin","inventory","logistics"] },
          { id: "procurement-fixed-assets", type: "module", name: "Procurement and Fixed Asset Management Module", tags: ["admin","procurement","assets"] },
          { id: "equipment-tracking", type: "module", name: "Equipment Tracking Module", tags: ["admin","biomed","equipment"] },
          { id: "cleaning-laundry", type: "module", name: "Cleaning and Laundry Module", tags: ["admin","facility","housekeeping"] },
          { id: "sterilization-logistics", type: "module", name: "Sterilization Module", tags: ["admin","logistics","cssd","clinical"] }
        ]
      },
      {
        id: "admin-hr",
        type: "cluster",
        name: "Human Capital Management",
        children: [
          { id: "human-resources", type: "module", name: "Human Resources Module", tags: ["admin","hr"] }
        ]
      },
      {
        id: "admin-info-governance",
        type: "cluster",
        name: "Information Governance, Reporting & IT",
        children: [
          { id: "records-archives", type: "module", name: "Records and Archives Module", tags: ["admin","him","records"] },
          { id: "statistics-reporting", type: "module", name: "Statistics and Reporting Module", tags: ["admin","bi","analytics"] },
          { id: "system-management", type: "module", name: "System Management Module", tags: ["admin","it","platform"] }
        ]
      }
    ]
  }
];

