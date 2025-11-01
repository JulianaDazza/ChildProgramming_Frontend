import type { Process } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function getProcesses(): Promise<Process[]> {
  const response = await fetch(`${API_BASE_URL}/api/colaborative_process/list`);
  if (!response.ok) throw new Error("Failed to fetch processes");
  return response.json();
}

export async function createProcess(data: {
  name_process: string;
  description_process: string;
  version_process: string;
  image?: string;
  facilitator_id: number;
}): Promise<Process> {
  const response = await fetch(`${API_BASE_URL}/api/colaborative_process/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create process");
  return response.json();
}

export async function updateProcess(id: number, data: Partial<Process>): Promise<Process> {
  const response = await fetch(`${API_BASE_URL}/api/colaborative_process/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update process");
  return response.json();
}

export async function deleteProcess(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/colaborative_process/delete/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete process");
}
