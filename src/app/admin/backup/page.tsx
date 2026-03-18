import { getSecurityOverview } from "@/lib/admin"
import AdminBackupPageClient from "./backup-client"

export default async function AdminBackupPage() {
  const security = await getSecurityOverview() // We can still use this metadata if it has backup info

  return <AdminBackupPageClient securityData={security} />
}
