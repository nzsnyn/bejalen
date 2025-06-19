'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('admin-token');
        if (!token) {
            router.push('/admin/login');
        } else {
            try {
                const userData = JSON.parse(token);
                setUser(userData);
                setIsAuthenticated(true);
                fetchStats();
            } catch (error) {
                console.error('Error parsing user data:', error);
                Cookies.remove('admin-token');
                router.push('/admin/login');
            }
        }
        setIsLoading(false);
    }, [router]);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/dashboard');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleLogout = () => {
        Cookies.remove('admin-token');
        router.push('/admin/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">      {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Admin Dashboard
                            </h1>
                            {user && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Welcome back, {user.name || user.username}!
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>      {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Welcome Section */}
                    <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
                        <div className="px-4 py-5 sm:p-6">
                            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                                Dashboard Admin - Data Management
                            </h2>
                            <p className="text-sm text-gray-500">
                                Kelola semua data website melalui folder-folder di bawah ini. Klik pada folder untuk mengakses pengelolaan data.
                            </p>
                        </div>
                    </div>

                    {/* Folder Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">                        {/* Tour Packages */}
                        <div className="group cursor-pointer" onClick={() => router.push('/admin/info-paket')}>
                            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-900 text-center">Tour Packages</span>
                                <span className="text-xs text-gray-500 mt-1">{stats ? stats.totalPackages : '-'} items</span>
                            </div>
                        </div>

                        {/* Info Paket Content */}
                        <div className="group cursor-pointer" onClick={() => router.push('/admin/info-paket/content')}>
                            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-900 text-center">Info Paket Content</span>
                                <span className="text-xs text-gray-500 mt-1">Promo Image</span>
                            </div>
                        </div>

                        {/* Bookings */}
                        <div className="group cursor-pointer" onClick={() => window.alert('Feature coming soon: Bookings Management')}>
                            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-900 text-center">Bookings</span>
                                <span className="text-xs text-gray-500 mt-1">{stats ? stats.totalBookings : '-'} items</span>
                            </div>
                        </div>                        {/* Gallery */}
                        <div className="group cursor-pointer" onClick={() => router.push('/admin/gallery')}>
                            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-pink-200 transition-colors">
                                    <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-900 text-center">Gallery</span>
                                <span className="text-xs text-gray-500 mt-1">{stats ? stats.totalGalleryItems : '-'} items</span>
                            </div>
                        </div>

                        {/* Contacts */}
                        <div className="group cursor-pointer" onClick={() => window.alert('Feature coming soon: Contacts Management')}>
                            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-yellow-200 transition-colors">
                                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-900 text-center">Contacts</span>
                                <span className="text-xs text-gray-500 mt-1">{stats ? stats.totalContacts : '-'} items</span>
                            </div>
                        </div>                        {/* Homepage Content */}
                        <div className="group cursor-pointer" onClick={() => router.push('/admin/homepage')}>
                            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
                                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v8" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-900 text-center">Homepage</span>
                                <span className="text-xs text-gray-500 mt-1">Content</span>
                            </div>
                        </div>                        {/* Kampoeng Rawa */}
                        <div className="group cursor-pointer" onClick={() => router.push('/admin/kampoeng-rawa/content')}>
                            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-red-200 transition-colors">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-900 text-center">Kampoeng Rawa</span>
                                <span className="text-xs text-gray-500 mt-1">Content</span>
                            </div>
                        </div>{/* Perahu Mesin */}
                        <div className="group cursor-pointer" onClick={() => router.push('/admin/perahu-mesin/content')}>
                            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-teal-200 transition-colors">
                                    <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-900 text-center">Perahu Mesin</span>
                                <span className="text-xs text-gray-500 mt-1">Content</span>
                            </div>                        </div>

                        {/* Lucky Land */}
                        <div className="group cursor-pointer" onClick={() => router.push('/admin/lucky-land/content')}>
                            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-yellow-200 transition-colors">
                                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-900 text-center">Lucky Land</span>
                                <span className="text-xs text-gray-500 mt-1">Content</span>
                            </div>
                        </div>

                        {/* Rawa Pening */}
                        <div className="group cursor-pointer" onClick={() => window.alert('Feature coming soon: Rawa Pening Management')}>
                            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-cyan-200 transition-colors">
                                    <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-900 text-center">Rawa Pening</span>
                                <span className="text-xs text-gray-500 mt-1">Content</span>
                            </div>
                        </div>

                        {/* Admin Users */}
                        <div className="group cursor-pointer" onClick={() => window.alert('Feature coming soon: Admin Users Management')}>
                            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-colors">
                                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-900 text-center">Admin Users</span>
                                <span className="text-xs text-gray-500 mt-1">Management</span>
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="group cursor-pointer" onClick={() => window.alert('Feature coming soon: Settings Management')}>
                            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
                                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-900 text-center">Settings</span>
                                <span className="text-xs text-gray-500 mt-1">Configuration</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
