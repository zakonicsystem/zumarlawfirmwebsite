import AdminClient from "@/components/admin/AdminClient";

export const metadata = {
  title: "Site Settings"
};

export default function AdminSettingsPage() {
  return <AdminClient view="settings" />;
}
