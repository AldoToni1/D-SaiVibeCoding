import React from 'react';
import { useMenu } from '../contexts/MenuContext';
import { Card } from './ui/card';
import { Eye, TrendingUp, Clock, Loader, RotateCcw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconBg: string;
  iconColor: string;
}

function StatCard({ icon, label, value, iconBg, iconColor }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className={`${iconBg} p-3 rounded-lg`}>
          <div className={iconColor}>{icon}</div>
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
}

const CHART_COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];

export function Analytics() {
  const { analytics, menuItems, isLoading, resetAnalytics } = useMenu();

  const topItems = React.useMemo(() => {
    return Object.entries(analytics.itemViews)
      .map(([itemId, views]) => {
        // First try to find item by ID in menuItems
        const item = menuItems.find((i) => i.id === itemId);
        const name = item?.name || analytics.itemNames?.[itemId] || 'Unknown';
        return {
          id: itemId,
          name,
          views,
        };
      })
      .filter((item) => item.name !== 'Unknown') // Filter keluar Unknown items
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }, [analytics.itemViews, analytics.itemNames, menuItems]);

  const totalItemViews = React.useMemo(() => {
    return Object.values(analytics.itemViews).reduce((sum, views) => sum + views, 0);
  }, [analytics.itemViews]);

  const totalViews = totalItemViews;

  const uniqueItemsViewed = React.useMemo(() => {
    return Object.keys(analytics.itemViews).length;
  }, [analytics.itemViews]);

  const formattedDate = React.useMemo(() => {
    const date = new Date(analytics.lastViewed);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [analytics.lastViewed]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="text-center py-12">
            <Loader className="size-8 mx-auto mb-2 animate-spin text-orange-600" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <button
          onClick={resetAnalytics}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
        >
          <RotateCcw className="size-4" />
          Reset Analytics
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Eye className="size-6" />}
          label="Total Views"
          value={totalViews}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
        <StatCard
          icon={<TrendingUp className="size-6" />}
          label="Items Viewed"
          value={uniqueItemsViewed}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={<Clock className="size-6" />}
          label="Last Viewed"
          value={formattedDate}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
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
                    <Cell key={`cell-${entry.id}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="space-y-2">
              {topItems.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
    </div>
  );
}
