import axios from "axios";

interface CreateReportDTO {
  title: string;
  description: string;
  category: string;
  lat: number;
  long: number;
  images: string[]; // Data URLs para el backend
}

export async function createReport(data: CreateReportDTO): Promise<any> {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/report`,
    data
  );
  console.log(response.data);
  return response.data;
}

export async function getReportsByZone(lat: number, long: number) {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/report/by-zone/${lat}/${long}`
  );

  return response.data;
}

export async function getAllReports(): Promise<any[]> {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/report/all`
  );
  return response.data;
}
