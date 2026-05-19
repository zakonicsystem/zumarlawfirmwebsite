import AdminClient from "@/components/admin/AdminClient";

export const metadata = {
  title: "Create Blog"
};

export default async function AdminBlogFormPage({ searchParams }) {
  const params = await searchParams;
  return <AdminClient view="blogForm" editId={params?.id || ""} />;
}
