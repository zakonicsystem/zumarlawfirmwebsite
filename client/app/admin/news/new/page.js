import AdminClient from "@/components/admin/AdminClient";

export const metadata = {
  title: "Create News"
};

export default async function AdminNewsFormPage({ searchParams }) {
  const params = await searchParams;
  return <AdminClient view="newsForm" editId={params?.id || ""} />;
}
