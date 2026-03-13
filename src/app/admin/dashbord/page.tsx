import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Database, TrendingUp } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <AdminSidebar>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Users</CardTitle>
            <Users className="h-4 w-4 text-[#407bc4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">1,284</div>
            <p className="text-[10px] text-emerald-500 font-bold mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Citations Generated</CardTitle>
            <FileText className="h-4 w-4 text-[#f58e58]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">42,891</div>
            <p className="text-[10px] text-emerald-500 font-bold mt-1">+8% from yesterday</p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Active Projects</CardTitle>
            <Database className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">3,456</div>
            <p className="text-[10px] text-zinc-400 font-bold mt-1">Steady growth</p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Server Load</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">24%</div>
            <p className="text-[10px] text-emerald-500 font-bold mt-1">Healthy</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="border-none bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New user registered: user_{i}@example.com</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{i} hour ago</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminSidebar>
  )
}
