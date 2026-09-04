import axios from 'axios'; // Adjust your axios instance import path as needed

export type ReportStatus = 'available' | 'processing';

export interface TestParameter {
  name: string;
  result: string;
  unit: string;
  normalRange: string;
  isAbnormal: boolean;
}

export interface LabReport {
  id: string; 
  testName: string;
  labName: string;
  date: string;
  status: ReportStatus;
  parameters?: TestParameter[];
  summaryNote?: string;
}

export interface LabReportQueryParams {
  query?: string;
  status?: 'all' | ReportStatus;
  sortOrder?: 'newest' | 'oldest';
}

export const labReportApi = {
  // Fetch all lab reports for the patient
  getReports: async (params?: LabReportQueryParams) => {
    const response = await axios.get<LabReport[]>('/lab-reports', { params });
    return response.data;
  },

  // Fetch a single lab report by its ID
  getReportById: async (id: string) => {
    const response = await axios.get<LabReport>(`/lab-reports/${id}`);
    return response.data;
  },

  // Download lab report PDF file
  downloadReportPdf: async (id: string) => {
    const response = await axios.get(`/lab-reports/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};