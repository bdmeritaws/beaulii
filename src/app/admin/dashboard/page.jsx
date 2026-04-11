"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/AdminAuth";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Eye,
  Package,
  ShoppingCart,
  Settings,
} from "lucide-react";

const stats = [
  { title: "Total Revenue", value: "$2,45,890", change: "+12.5%", positive: true, icon: DollarSign },
  { title: "Total Orders", value: "1,234", change: "+8.2%", positive: true, icon: ShoppingBag },
  { title: "Total Customers", value: "5,678", change: "+15.3%", positive: true, icon: Users },
  { title: "Page Views", value: "45,890", change: "-2.4%", positive: false, icon: Eye },
];

const recentOrders = [
  { id: "#ORD-001", customer: "Rahul Sharma", product: "Dark Patch Reducer Cream", amount: "$3,999", status: "Pending" },
  { id: "#ORD-002", customer: "Priya Patel", product: "Flawless Skin Combo", amount: "$2,999", status: "Processing" },
  { id: "#ORD-003", customer: "Amit Kumar", product: "Foot Care Cream", amount: "$1,999", status: "Delivered" },
  { id: "#ORD-004", customer: "Sneha Gupta", product: "Stretch Mark Cream", amount: "$3,999", status: "Pending" },
  { id: "#ORD-005", customer: "Vikram Singh", product: "Dark Patch Reducer Cream", amount: "$3,999", status: "Shipped" },
];

const topProducts = [
  { name: "Dark Patch Reducer Cream", sales: 234, revenue: "$9,35,766" },
  { name: "Flawless Skin Combo", sales: 189, revenue: "$5,66,811" },
  { name: "Foot Care Cream", sales: 156, revenue: "$3,11,844" },
  { name: "Stretch Mark Cream", sales: 123, revenue: "$4,91,877" },
];

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const { admin, loading, isAuthenticated, logout } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [loading, isAuthenticated, router]);

  if (!mounted) return null;

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5a2a0f]"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#5a2a0f]/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="text-[#5a2a0f]" size={24} />
                  </div>
                  <span
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.positive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-500 text-sm">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                  <Link href="/admin/orders" className="text-sm text-[#5a2a0f] hover:underline">
                    View All
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-[#5a2a0f]">{order.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{order.amount}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "Shipped"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "Processing"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Top Products</h2>
                  <Link href="/admin/products" className="text-sm text-[#5a2a0f] hover:underline">
                    View All
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {topProducts.map((product, index) => (
                  <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} sales</p>
                    </div>
                    <p className="font-semibold text-[#5a2a0f]">{product.revenue}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/admin/products/new"
                className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center hover:border-[#5a2a0f] hover:bg-[#5a2a0f]/5 transition"
              >
                <Package className="mx-auto text-gray-400 mb-2" size={24} />
                <span className="text-sm font-medium text-gray-600">Add Product</span>
              </Link>
              <Link
                href="/admin/orders"
                className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center hover:border-[#5a2a0f] hover:bg-[#5a2a0f]/5 transition"
              >
                <ShoppingCart className="mx-auto text-gray-400 mb-2" size={24} />
                <span className="text-sm font-medium text-gray-600">Manage Orders</span>
              </Link>
              <Link
                href="/admin/customers"
                className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center hover:border-[#5a2a0f] hover:bg-[#5a2a0f]/5 transition"
              >
                <Users className="mx-auto text-gray-400 mb-2" size={24} />
                <span className="text-sm font-medium text-gray-600">View Customers</span>
              </Link>
              <Link
                href="/admin/settings"
                className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center hover:border-[#5a2a0f] hover:bg-[#5a2a0f]/5 transition"
              >
                <Settings className="mx-auto text-gray-400 mb-2" size={24} />
                <span className="text-sm font-medium text-gray-600">Settings</span>
              </Link>
            </div>
          </div>
        </div>
  );
}
