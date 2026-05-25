'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Download, FileText, FolderOpen, Loader2, Upload, AlertCircle, CheckCircle2, Archive, ChevronRight, Lock } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  fetchDepartmentDocuments,
  fetchFolders,
  fetchFolderDocuments,
  folderDownloadUrl,
  trackDownload,
  uploadDocument,
  bulkUploadDocuments,
  type Document,
  type Folder as FolderType,
} from '@/lib/documents-api';

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/png',
  'image/jpeg',
  'text/plain',
  'text/csv',
  'application/zip',
  'application/x-zip-compressed',
  'application/x-zip',
]);
const MAX_SIZE = 10 * 1024 * 1024;
const MAX_ZIP_SIZE = 50 * 1024 * 1024;

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

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

function DocumentRow({ doc, onDownload, isLoggedIn }: { doc: Document; onDownload: (doc: Document) => void; isLoggedIn: boolean }) {
  const t = useTranslations('documents');
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-surface/50 p-4 backdrop-blur-sm">
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
        onClick={() => onDownload(doc)}
        className={`shrink-0 rounded-lg border p-2 transition-all ${
          isLoggedIn
            ? 'border-white/10 bg-white/5 text-zinc-400 hover:border-primary/30 hover:text-primary'
            : 'border-yellow-500/20 bg-yellow-500/5 text-yellow-500/70 hover:border-yellow-500/40 hover:text-yellow-400'
        }`}
        title={isLoggedIn ? t('downloadButton') : 'Indirmek icin giris yapin'}
      >
        {isLoggedIn ? <Download className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
      </button>
    </div>
  );
}

function LoginRequiredModal({ onClose, onLogin }: { onClose: () => void; onLogin: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 mx-auto">
          <Lock className="h-6 w-6 text-yellow-400" />
        </div>
        <h3 className="mb-2 text-center text-lg font-semibold text-white">Giris Gerekli</h3>
        <p className="mb-6 text-center text-sm text-zinc-400">
          Bu belgeyi indirmek icin giris yapman gerekiyor.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-medium text-zinc-400 transition-all hover:text-white"
          >
            Vazgec
          </button>
          <button
            onClick={onLogin}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90"
          >
            Giris Yap
          </button>
        </div>
      </div>
    </div>
  );
}

export function DocumentsView({ departmentId }: { departmentId: string }) {
  const t = useTranslations('documents');
  const { user } = useAuth();
  const router = useRouter();

  // Explorer state
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([{ id: null, name: t('rootFolder') }]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Upload state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTab, setUploadTab] = useState<UploadTab>('single');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const currentFolder = breadcrumb[breadcrumb.length - 1];

  useEffect(() => {
    loadCurrentFolder();
  }, [breadcrumb]);

  async function loadCurrentFolder() {
    setIsLoading(true);
    try {
      if (currentFolder.id === null) {
        const [foldersData, docsData] = await Promise.all([
          fetchFolders(departmentId),
          fetchDepartmentDocuments(departmentId),
        ]);
        setFolders(foldersData);
        setDocuments((docsData.documents || []).filter((d) => !d.folderId));
      } else {
        const [subFolders, folderDocs] = await Promise.all([
          fetchFolders(departmentId, currentFolder.id),
          fetchFolderDocuments(currentFolder.id),
        ]);
        setFolders(subFolders);
        setDocuments(folderDocs);
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }

  function openFolder(folder: FolderType) {
    setBreadcrumb((prev) => [...prev, { id: folder.id, name: folder.name }]);
  }

  function navigateTo(index: number) {
    setBreadcrumb((prev) => prev.slice(0, index + 1));
  }

  function handleDownload(doc: Document) {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
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
      loadCurrentFolder();
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
      setBreadcrumb([{ id: null, name: t('rootFolder') }]);
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
    if (!ALLOWED_TYPES.has(file.type)) { setUploadError(t('invalidFileType')); e.target.value = ''; return; }
    if (file.size > MAX_SIZE) { setUploadError(t('fileTooLarge')); e.target.value = ''; return; }
    setUploadError(null);
    setUploadFile(file);
  }

  function onZipChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.zip') && file.type !== 'application/zip' && file.type !== 'application/x-zip-compressed') {
      setUploadError(t('invalidZipType')); e.target.value = ''; return;
    }
    if (file.size > MAX_ZIP_SIZE) { setUploadError(t('zipTooLarge')); e.target.value = ''; return; }
    setUploadError(null);
    setZipFile(file);
  }

  const isEmpty = !isLoading && folders.length === 0 && documents.length === 0;

  return (
    <div>
      {showLoginModal && (
        <LoginRequiredModal
          onClose={() => setShowLoginModal(false)}
          onLogin={() => router.push('/login')}
        />
      )}

      {uploadSuccess && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {uploadSuccess}
        </div>
      )}

      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between gap-3">
        {/* Breadcrumb */}
        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-sm">
          {breadcrumb.map((item, i) => (
            <span key={i} className="flex items-center gap-1 whitespace-nowrap">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />}
              <button
                onClick={() => navigateTo(i)}
                className={i === breadcrumb.length - 1
                  ? 'font-medium text-white'
                  : 'text-zinc-400 hover:text-white transition-colors'}
              >
                {item.name}
              </button>
            </span>
          ))}
        </nav>

        <button
          onClick={() => setShowUpload(!showUpload)}
          className="shrink-0 flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-primary/90"
        >
          <Upload className="h-3.5 w-3.5" />
          {t('uploadButton')}
        </button>
      </div>

      {/* Upload form */}
      {showUpload && (
        <div className="mb-6 rounded-xl border border-white/10 bg-surface/50 p-5 backdrop-blur-sm">
          <div className="mb-4 flex gap-1 rounded-lg bg-white/5 p-1">
            <button
              onClick={() => { setUploadTab('single'); setUploadError(null); }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all ${uploadTab === 'single' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              <FileText className="h-3.5 w-3.5" />
              {t('tabSingle')}
            </button>
            <button
              onClick={() => { setUploadTab('zip'); setUploadError(null); }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all ${uploadTab === 'zip' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'}`}
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

          {uploadTab === 'single' && (
            <form onSubmit={handleSingleUpload} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">{t('uploadTitle')}</label>
                <input type="text" required value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder={t('uploadTitlePlaceholder')}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">{t('uploadDescription')}</label>
                <input type="text" value={uploadDesc} onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder={t('uploadDescPlaceholder')}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">{t('uploadFile')}</label>
                <input type="file" required accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.txt,.csv,.zip" onChange={onFileChange}
                  className="w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-white hover:file:bg-white/20" />
                <p className="mt-1 text-xs text-zinc-500">{t('uploadHint')}</p>
              </div>
              <button type="submit" disabled={isUploading || !uploadFile}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-50">
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {isUploading ? t('uploading') : t('uploadSubmit')}
              </button>
            </form>
          )}

          {uploadTab === 'zip' && (
            <form onSubmit={handleZipUpload} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">{t('zipFile')}</label>
                <input type="file" required accept=".zip" onChange={onZipChange}
                  className="w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-white hover:file:bg-white/20" />
                <p className="mt-1 text-xs text-zinc-500">{t('zipHint')}</p>
              </div>
              <button type="submit" disabled={isUploading || !zipFile}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-50">
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                {isUploading ? t('uploading') : t('zipSubmit')}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isEmpty ? (
        <p className="py-10 text-center text-sm text-zinc-500">{t('noDocuments')}</p>
      ) : (
        <div className="space-y-2">
          {/* Folders */}
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-surface/50 p-4 backdrop-blur-sm transition-all hover:border-white/20"
            >
              <button
                onClick={() => openFolder(folder)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <FolderOpen className="h-5 w-5 shrink-0 text-amber-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{folder.name}</p>
                  {(folder._count?.documents !== undefined || folder._count?.children !== undefined) && (
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {folder._count.documents} {t('documentCount')}
                      {folder._count.children > 0 && ` · ${folder._count.children} klasör`}
                    </p>
                  )}
                </div>
              </button>
              <button
                onClick={() => {
                  if (!user) { setShowLoginModal(true); return; }
                  window.open(folderDownloadUrl(folder.id), '_blank');
                }}
                className={`shrink-0 rounded-lg border p-2 transition-all ${
                  user
                    ? 'border-white/10 bg-white/5 text-zinc-400 hover:border-primary/30 hover:text-primary'
                    : 'border-yellow-500/20 bg-yellow-500/5 text-yellow-500/70 hover:border-yellow-500/40 hover:text-yellow-400'
                }`}
                title={user ? t('downloadFolder') : 'Indirmek icin giris yapin'}
              >
                {user ? <Download className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </button>
              <button
                onClick={() => openFolder(folder)}
                className="shrink-0 text-zinc-600 transition-colors hover:text-white"
                title={t('openFolder')}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* Documents */}
          {documents.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} onDownload={handleDownload} isLoggedIn={!!user} />
          ))}
        </div>
      )}
    </div>
  );
}
