'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Download, FileText, Loader2, Upload, AlertCircle, CheckCircle2, Archive } from 'lucide-react';
import {
  fetchDepartmentDocuments,
  trackDownload,
  uploadDocument,
  bulkUploadDocuments,
  type Document,
} from '@/lib/documents-api';

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_ZIP_SIZE = 50 * 1024 * 1024; // 50MB

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

type UploadTab = 'single' | 'zip';

export function DocumentsView({ departmentId }: { departmentId: string }) {
  const t = useTranslations('documents');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTab, setUploadTab] = useState<UploadTab>('single');

  // Single upload state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // ZIP upload state
  const [zipFile, setZipFile] = useState<File | null>(null);

  // Shared state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, [departmentId]);

  async function loadDocuments() {
    setIsLoading(true);
    try {
      const data = await fetchDepartmentDocuments(departmentId);
      setDocuments(data.documents || []);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDownload(doc: Document) {
    trackDownload(doc.id);
    const url = doc.fileUrl.startsWith('http')
      ? doc.fileUrl
      : `https://api.iytemobil.com${doc.fileUrl}`;
    window.open(url, '_blank');
  }

  async function handleSingleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadFile) return;
    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('title', uploadTitle);
      if (uploadDesc) formData.append('description', uploadDesc);

      await uploadDocument(departmentId, formData);
      setUploadSuccess(t('uploadSuccess'));
      setUploadTitle('');
      setUploadDesc('');
      setUploadFile(null);
      setShowUpload(false);
      loadDocuments();
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : t('uploadError'));
    } finally {
      setIsUploading(false);
    }
  }

  async function handleZipUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!zipFile) return;
    setUploadError(null);
    setIsUploading(true);

    try {
      const result = await bulkUploadDocuments(departmentId, zipFile);
      setUploadSuccess(result.message);
      setZipFile(null);
      setShowUpload(false);
      loadDocuments();
      setTimeout(() => setUploadSuccess(null), 5000);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : t('uploadError'));
    } finally {
      setIsUploading(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.has(file.type)) {
      setUploadError(t('invalidFileType'));
      e.target.value = '';
      return;
    }
    if (file.size > MAX_SIZE) {
      setUploadError(t('fileTooLarge'));
      e.target.value = '';
      return;
    }
    setUploadError(null);
    setUploadFile(file);
  }

  function onZipChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.zip') && file.type !== 'application/zip' && file.type !== 'application/x-zip-compressed') {
      setUploadError(t('invalidZipType'));
      e.target.value = '';
      return;
    }
    if (file.size > MAX_ZIP_SIZE) {
      setUploadError(t('zipTooLarge'));
      e.target.value = '';
      return;
    }
    setUploadError(null);
    setZipFile(file);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Upload success */}
      {uploadSuccess && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {uploadSuccess}
        </div>
      )}

      {/* Upload toggle */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          {documents.length} {t('documentCount')}
        </p>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-primary/90"
        >
          <Upload className="h-3.5 w-3.5" />
          {t('uploadButton')}
        </button>
      </div>

      {/* Upload form */}
      {showUpload && (
        <div className="mb-6 rounded-xl border border-white/10 bg-surface/50 p-5 backdrop-blur-sm">
          {/* Tabs */}
          <div className="mb-4 flex gap-1 rounded-lg bg-white/5 p-1">
            <button
              onClick={() => { setUploadTab('single'); setUploadError(null); }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all ${
                uploadTab === 'single'
                  ? 'bg-primary text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              {t('tabSingle')}
            </button>
            <button
              onClick={() => { setUploadTab('zip'); setUploadError(null); }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all ${
                uploadTab === 'zip'
                  ? 'bg-primary text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Archive className="h-3.5 w-3.5" />
              {t('tabZip')}
            </button>
          </div>

          {uploadError && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Single file form */}
          {uploadTab === 'single' && (
            <form onSubmit={handleSingleUpload} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                  {t('uploadTitle')}
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder={t('uploadTitlePlaceholder')}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                  {t('uploadDescription')}
                </label>
                <input
                  type="text"
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder={t('uploadDescPlaceholder')}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                  {t('uploadFile')}
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx"
                  onChange={onFileChange}
                  className="w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-white hover:file:bg-white/20"
                />
                <p className="mt-1 text-xs text-zinc-500">{t('uploadHint')}</p>
              </div>
              <button
                type="submit"
                disabled={isUploading || !uploadFile}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {isUploading ? t('uploading') : t('uploadSubmit')}
              </button>
            </form>
          )}

          {/* ZIP form */}
          {uploadTab === 'zip' && (
            <form onSubmit={handleZipUpload} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                  {t('zipFile')}
                </label>
                <input
                  type="file"
                  required
                  accept=".zip"
                  onChange={onZipChange}
                  className="w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-white hover:file:bg-white/20"
                />
                <p className="mt-1 text-xs text-zinc-500">{t('zipHint')}</p>
              </div>
              <button
                type="submit"
                disabled={isUploading || !zipFile}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                {isUploading ? t('uploading') : t('zipSubmit')}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Document list */}
      {documents.length === 0 ? (
        <p className="py-10 text-center text-sm text-zinc-500">{t('noDocuments')}</p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-surface/50 p-4 backdrop-blur-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-primary" />
                  <h4 className="truncate text-sm font-medium text-white">{doc.title}</h4>
                  {doc.status === 'PENDING' && (
                    <span className="shrink-0 rounded-full bg-yellow-500/15 px-2 py-0.5 text-[10px] font-medium text-yellow-400">
                      {t('statusPending')}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                  <span>{doc.user?.name || '-'}</span>
                  <span>{formatSize(doc.fileSize)}</span>
                  <span>{formatDate(doc.createdAt)}</span>
                  <span>{doc.downloadCount} {t('downloads')}</span>
                </div>
              </div>
              <button
                onClick={() => handleDownload(doc)}
                className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-400 transition-all hover:border-primary/30 hover:text-primary"
                title={t('downloadButton')}
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
