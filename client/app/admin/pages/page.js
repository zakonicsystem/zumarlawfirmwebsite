import AdminClient from "@/components/admin/AdminClient";

export const metadata = {
  title: "Edit Pages"
};

export default async function AdminPagesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  return <AdminClient view="pages" editId={resolvedSearchParams?.page} />;
}
