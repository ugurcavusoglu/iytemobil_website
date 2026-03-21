export interface Department {
  id: string;
  name: string;
  slug: string;
  _count?: { documents: number };
  documentCount?: number;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  grade: string;
  status: string;
  downloadCount: number;
  createdAt: string;
  user?: { id: string; name: string; verificationStatus?: string };
}

export async function fetchDepartments(): Promise<Department[]> {
  const res = await fetch('/api/documents/departments');
  if (!res.ok) throw new Error('Bolumler yuklenemedi.');
  const data = await res.json();
  return data.departments || data || [];
}

export async function fetchDepartmentDocuments(
  departmentId: string,
  page = 1,
  limit = 50,
): Promise<{ documents: Document[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
  const res = await fetch(`/api/documents/${departmentId}?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Belgeler yuklenemedi.');
  return res.json();
}

export async function uploadDocument(departmentId: string, formData: FormData) {
  const res = await fetch(`/api/documents/${departmentId}/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Yukleme basarisiz.');
  return data;
}

export async function trackDownload(documentId: string) {
  await fetch(`/api/documents/download/${documentId}`, { method: 'POST' });
}
