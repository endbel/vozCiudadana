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
  console.log(data);

  const response = await axios.post("http://localhost:3000/report", data);
  console.log(response.data);

  return response.data;
}

export async function getReportsByZone(lat: number, long: number) {
  console.log(lat, long);

  const response = await axios.get(
    `http://localhost:3000/report/by-zone/${lat}/${long}`
  );
  console.log(response.data);

  return response.data;
}
