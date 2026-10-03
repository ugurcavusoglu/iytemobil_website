'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
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

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: Math.min(i * 0.04, 0.4) } }),
};

const inputClass =
  'w-full rounded-2xl border border-border bg-surface-light px-4 py-3 text-sm text-text-primary placeholder-text-disabled outline-none transition-colors focus:border-primary/50';
const fileInputClass =
  'w-full text-sm text-text-secondary file:mr-3 file:rounded-full file:border-0 file:bg-surface-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-text-primary hover:file:bg-surface-container';
const submitClass =
  'flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50';

function DownloadButton({ isLoggedIn, title, onClick }: { isLoggedIn: boolean; title: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
        isLoggedIn
          ? 'border-border-light bg-surface-light text-text-secondary hover:border-primary hover:bg-primary hover:text-white'
          : 'border-yellow-500/20 bg-yellow-500/5 text-yellow-500/70 hover:border-yellow-500/40 hover:text-yellow-400'
      }`}
      title={title}
    >
      {isLoggedIn ? <Download className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
    </button>
  );
}

function DocumentRow({ doc, onDownload, isLoggedIn }: { doc: Document; onDownload: (doc: Document) => void; isLoggedIn: boolean }) {
  const t = useTranslations('documents');
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-border bg-surface p-4 transition-colors hover:border-border-light md:p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-light">
        <FileText className="h-5 w-5 text-primary" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate font-semibold text-text-primary">{doc.title}</h4>
          {doc.status === 'PENDING' && (
            <span className="shrink-0 rounded-full bg-yellow-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-yellow-400">
              {t('statusPending')}
            </span>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
          {doc.showUploader && doc.user?.name && <span>{doc.user.name}</span>}
          <span>{formatSize(doc.fileSize)}</span>
          <span>{formatDate(doc.createdAt)}</span>
          <span>{doc.downloadCount} {t('downloads')}</span>
        </div>
      </div>
      <DownloadButton
        isLoggedIn={isLoggedIn}
        title={isLoggedIn ? t('downloadButton') : 'İndirmek için giriş yapın'}
        onClick={() => onDownload(doc)}
      />
    </div>
  );
}

function LoginRequiredModal({ onClose, onLogin }: { onClose: () => void; onLogin: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm rounded-3xl border border-border-light bg-surface p-7 shadow-2xl"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/10">
          <Lock className="h-6 w-6 text-yellow-400" />
        </div>
        <h3 className="mb-2 text-center text-xl font-black tracking-tight text-text-primary">Giriş Gerekli</h3>
        <p className="mb-7 text-center text-sm text-text-secondary">
          Bu belgeyi indirmek için giriş yapman gerekiyor.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-border-light py-3 text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary"
          >
            Vazgeç
          </button>
          <button
            onClick={onLogin}
            className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Giriş Yap
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function DocumentsView({ departmentId }: { departmentId: string }) {
  const t = useTranslations('documents');
  const { user } = useAuth();
  const router = useRouter();

  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([{ id: null, name: t('rootFolder') }]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {uploadSuccess}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between gap-3">
        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-full border border-border bg-surface px-4 py-2.5 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {breadcrumb.map((item, i) => (
            <span key={i} className="flex items-center gap-1 whitespace-nowrap">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-text-disabled" />}
              <button
                onClick={() => navigateTo(i)}
                className={i === breadcrumb.length - 1
                  ? 'font-semibold text-text-primary'
                  : 'text-text-secondary transition-colors hover:text-text-primary'}
              >
                {item.name}
              </button>
            </span>
          ))}
        </nav>

        <button
          onClick={() => setShowUpload(!showUpload)}
          aria-label={t('uploadButton')}
          className="flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary-dark md:px-5"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">{t('uploadButton')}</span>
        </button>
      </div>

      {showUpload && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 rounded-3xl border border-border bg-surface p-5 md:p-7"
        >
          <div className="mb-5 flex gap-1 rounded-full bg-surface-container p-1">
            <button
              onClick={() => { setUploadTab('single'); setUploadError(null); }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-semibold transition-all ${uploadTab === 'single' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <FileText className="h-4 w-4" />
              {t('tabSingle')}
            </button>
            <button
              onClick={() => { setUploadTab('zip'); setUploadError(null); }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-semibold transition-all ${uploadTab === 'zip' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <Archive className="h-4 w-4" />
              {t('tabZip')}
            </button>
          </div>

          {uploadError && (
            <div className="mb-5 flex items-start gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadTab === 'single' && (
            <form onSubmit={handleSingleUpload} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-text-secondary">{t('uploadTitle')}</label>
                <input type="text" required value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder={t('uploadTitlePlaceholder')}
                  className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-text-secondary">{t('uploadDescription')}</label>
                <input type="text" value={uploadDesc} onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder={t('uploadDescPlaceholder')}
                  className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-text-secondary">{t('uploadFile')}</label>
                <input type="file" required accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.txt,.csv,.zip" onChange={onFileChange}
                  className={fileInputClass} />
                <p className="mt-2 text-xs text-text-muted">{t('uploadHint')}</p>
              </div>
              <button type="submit" disabled={isUploading || !uploadFile} className={submitClass}>
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {isUploading ? t('uploading') : t('uploadSubmit')}
              </button>
            </form>
          )}

          {uploadTab === 'zip' && (
            <form onSubmit={handleZipUpload} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-text-secondary">{t('zipFile')}</label>
                <input type="file" required accept=".zip" onChange={onZipChange}
                  className={fileInputClass} />
                <p className="mt-2 text-xs text-text-muted">{t('zipHint')}</p>
              </div>
              <button type="submit" disabled={isUploading || !zipFile} className={submitClass}>
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                {isUploading ? t('uploading') : t('zipSubmit')}
              </button>
            </form>
          )}
        </motion.div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex animate-pulse items-center gap-4 rounded-3xl border border-border bg-surface p-5">
              <div className="h-11 w-11 shrink-0 rounded-2xl bg-surface-light" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 rounded-full bg-surface-light" />
                <div className="h-3 w-1/3 rounded-full bg-surface-light" />
              </div>
            </div>
          ))}
        </div>
      ) : isEmpty ? (
        <div className="rounded-3xl border border-border bg-surface px-6 py-16 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-surface-light">
            <FolderOpen className="h-7 w-7 text-text-muted" />
          </div>
          <p className="font-semibold text-text-secondary">{t('noDocuments')}</p>
        </div>
      ) : (
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-2">
          {folders.map((folder, i) => (
            <motion.div
              key={folder.id}
              custom={i}
              variants={rowVariants}
              className="flex w-full items-center gap-3 rounded-3xl border border-border bg-surface p-4 transition-colors hover:border-border-light md:p-5"
            >
              <button
                onClick={() => openFolder(folder)}
                className="flex min-w-0 flex-1 items-center gap-4 text-left"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10">
                  <FolderOpen className="h-5 w-5 text-amber-400" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-text-primary">{folder.name}</p>
                  {(folder._count?.documents !== undefined || folder._count?.children !== undefined) && (
                    <p className="mt-0.5 text-xs text-text-muted">
                      {folder._count.documents} {t('documentCount')}
                      {folder._count.children > 0 && ` · ${folder._count.children} klasör`}
                    </p>
                  )}
                </div>
              </button>
              <DownloadButton
                isLoggedIn={!!user}
                title={user ? t('downloadFolder') : 'İndirmek için giriş yapın'}
                onClick={() => {
                  if (!user) { setShowLoginModal(true); return; }
                  window.open(folderDownloadUrl(folder.id), '_blank');
                }}
              />
              <button
                onClick={() => openFolder(folder)}
                className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-disabled transition-colors hover:bg-surface-light hover:text-text-primary sm:flex"
                title={t('openFolder')}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          ))}

          {documents.map((doc, i) => (
            <motion.div key={doc.id} custom={folders.length + i} variants={rowVariants}>
              <DocumentRow doc={doc} onDownload={handleDownload} isLoggedIn={!!user} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
