import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Bejalen',
  description: 'Admin panel for Bejalen',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
