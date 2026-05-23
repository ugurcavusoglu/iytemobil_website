export interface Department {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  _count?: { departmentDocuments: number };
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
  _count?: { documents: number; children: number };
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
  folderId?: string | null;
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

export async function bulkUploadDocuments(departmentId: string, file: File) {
  // Token'ı cookie'den al
  const tokenRes = await fetch('/api/auth/get-token');
  const tokenData = await tokenRes.json().catch(() => null);
  const token = tokenData?.token;

  if (!token) throw new Error('Oturum bulunamadi.');

  const formData = new FormData();
  formData.append('file', file);

  // Direkt backend'e gönder — Next.js proxy'sini bypass et (Vercel 4.5MB limiti)
  const res = await fetch(
    `https://api.iytemobil.com/api/departments/${departmentId}/documents/bulk-upload`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
  );
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Toplu yukleme basarisiz.');
  return data as { message: string; uploaded: number; failed: number; skipped: number; details: { title: string; status: string }[] };
}

export async function fetchFolders(departmentId: string, parentId?: string): Promise<Folder[]> {
  const url = `/api/documents/${departmentId}/folders${parentId ? `?parentId=${parentId}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchFolderDocuments(folderId: string): Promise<Document[]> {
  const res = await fetch(`/api/documents/folders/${folderId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.documents || data || [];
}

export async function trackDownload(documentId: string) {
  await fetch(`/api/documents/download/${documentId}`, { method: 'POST' });
}
