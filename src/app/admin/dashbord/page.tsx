import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Database, TrendingUp, ArrowUpRight, Clock } from "lucide-react"

const MOCK_ACTIVITIES = [
  { id: 1, type: "user", user: "Somchai K.", action: "joined as Premium", time: "2 mins ago" },
  { id: 2, type: "citation", user: "Jane Doe", action: "generated 12 APA citations", time: "15 mins ago" },
  { id: 3, type: "project", user: "Vachira P.", action: "created new project 'Thesis'", time: "1 hour ago" },
  { id: 4, type: "system", user: "Auto-Backup", action: "database backup completed", time: "3 hours ago" },
  { id: 5, type: "user", user: "Michael S.", action: "updated profile settings", time: "5 hours ago" },
]

export default function AdminDashboardPage() {
  return (
    <AdminSidebar>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Dashboard</h2>
          <p className="text-zinc-500 font-medium mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group relative border-none bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Users</CardTitle>
              <div className="p-2 rounded-lg bg-[#407bc4]/10">
                <Users className="h-4 w-4 text-[#407bc4]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">1,542</div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-emerald-500">
                <ArrowUpRight className="h-3 w-3" />
                <span>+12.5% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative border-none bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Citations</CardTitle>
              <div className="p-2 rounded-lg bg-[#f58e58]/10">
                <FileText className="h-4 w-4 text-[#f58e58]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">48,912</div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-emerald-500">
                <ArrowUpRight className="h-3 w-3" />
                <span>+8.2% since yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative border-none bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Projects</CardTitle>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Database className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">3,890</div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-zinc-400">
                <Clock className="h-3 w-3" />
                <span>Updated 5 mins ago</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative border-none bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Server Status</CardTitle>
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">99.9%</div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-emerald-500">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>All systems operational</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
            <div>
              <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">Real-time stream of system events.</p>
            </div>
            <button className="text-xs font-bold text-[#407bc4] hover:underline">View All</button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {MOCK_ACTIVITIES.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-black text-zinc-400">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {activity.user} <span className="font-medium text-zinc-500">{activity.action}</span>
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5 font-medium flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {activity.time}
                    </p>
                  </div>
                  <div className={`h-1.5 w-1.5 rounded-full ${activity.type === 'system' ? 'bg-purple-500' : 'bg-[#407bc4]'}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminSidebar>
  )
}
