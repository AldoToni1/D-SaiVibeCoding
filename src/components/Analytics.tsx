import { useMenu } from '../contexts/MenuContext';
import { Card } from './ui/card';
import { Eye, TrendingUp, Clock, Loader } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function Analytics() {
  const { analytics, menuItems, isLoading } = useMenu();

  const topItems = Object.entries(analytics.itemViews)
    .map(([itemId, views]) => {
      const item = menuItems.find((i) => i.id === itemId);
      return {
        name: item?.name || 'Unknown',
        views,
      };
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const lastViewedDate = new Date(analytics.lastViewed);
  const formattedDate = lastViewedDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];

  return (
    <div className="space-y-6">
      {isLoading ? (
        <Card className="p-6">
          <div className="text-center py-12">
            <Loader className="size-8 mx-auto mb-2 animate-spin text-orange-600" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Eye className="size-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-semibold text-gray-900">{analytics.totalViews}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <TrendingUp className="size-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Item Views</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {Object.values(analytics.itemViews).reduce((a, b) => a + b, 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Clock className="size-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Viewed</p>
                  <p className="text-sm font-semibold text-gray-900">{formattedDate}</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Most Viewed Items</h2>
            <p className="text-sm text-gray-600 mb-6">Menu items yang paling sering dilihat oleh customer</p>

            {topItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Belum ada data views. Buka public menu untuk mulai tracking.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topItems}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#f97316" radius={[8, 8, 0, 0]}>
                      {topItems.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                <div className="space-y-2">
                  {topItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full font-semibold text-sm">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                      <span className="text-gray-600">{item.views} views</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-2">📊 About Analytics</h3>
            <p className="text-sm text-gray-600">
              Analytics data sekarang disimpan di Supabase dengan real-time tracking dari semua customer. Data juga
              disinkronkan ke localStorage untuk performa lebih baik.
            </p>
          </Card>
        </>
      )}
    </div>
  );
}
