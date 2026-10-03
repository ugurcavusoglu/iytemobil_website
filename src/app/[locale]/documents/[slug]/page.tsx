import { DepartmentDocumentsWrapper } from '@/components/documents/DepartmentDocumentsWrapper';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function DepartmentDocumentsPage({ params }: Props) {
  const { slug } = await params;

  return <DepartmentDocumentsWrapper slug={slug} />;
}
