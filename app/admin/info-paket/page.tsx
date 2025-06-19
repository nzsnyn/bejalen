'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface TourPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  includes: string[];
  excludes: string[];
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PublicFile {
  type: 'file';
  name: string;
  path: string;
  url: string;
  size: number;
  extension: string;
  modifiedAt: string;
}

export default function AdminInfoPaket() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [publicImages, setPublicImages] = useState<{ [key: string]: PublicFile[] }>({});
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState<{ packageId: string } | null>(null);
  const router = useRouter();

  const [newPackage, setNewPackage] = useState<Partial<TourPackage>>({
    title: '',
    description: '',
    price: 0,
    duration: '',
    includes: [],
    excludes: [],
    image: '',
    isActive: true
  });

  useEffect(() => {
    const token = Cookies.get('admin-token');
    if (!token) {
      router.push('/admin/login');
    } else {
      try {
        const userData = JSON.parse(token);
        setUser(userData);
        setIsAuthenticated(true);
        fetchPackages();
        fetchPublicImages();
      } catch (error) {
        console.error('Error parsing user data:', error);
        Cookies.remove('admin-token');
        router.push('/admin/login');
      }
    }
    setIsLoading(false);
  }, [router]);
  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/info-paket?admin=true');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPackages(result.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const fetchPublicImages = async () => {
    setIsLoadingImages(true);
    try {
      const response = await fetch('/api/gallery/scan-public');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPublicImages(result.data.groupedImages);
        }
      }
    } catch (error) {
      console.error('Error fetching public images:', error);
      showNotification('error', 'Failed to load images from public folder');
    }
    setIsLoadingImages(false);
  };

  const getAllImages = () => {
    return Object.values(publicImages).flat();
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: null, message: '' });
    }, 3000);
  };

  const handleLogout = () => {
    Cookies.remove('admin-token');
    router.push('/admin/login');
  };

  const handleImageSelect = (imageUrl: string, packageId: string) => {
    if (packageId === 'new') {
      setNewPackage(prev => ({ ...prev, image: imageUrl }));
    } else {
      setEditingPackage(prev => prev ? { ...prev, image: imageUrl } : null);
    }
    setShowImageSelector(null);
  };

  const openImageSelector = (packageId: string) => {
    setShowImageSelector({ packageId });
    if (Object.keys(publicImages).length === 0) {
      fetchPublicImages();
    }
  };

  const handleEdit = (pkg: TourPackage) => {
    setEditingPackage({ ...pkg });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditingPackage(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editingPackage) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/info-paket/${editingPackage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingPackage)
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setPackages(prev => prev.map(pkg => pkg.id === editingPackage.id ? editingPackage : pkg));
        setIsEditing(false);
        setEditingPackage(null);
        showNotification('success', 'Package updated successfully!');
      } else {
        showNotification('error', result.error || 'Failed to update package');
      }
    } catch (error) {
      console.error('Error updating package:', error);
      showNotification('error', 'Network error occurred');
    }
    setIsSaving(false);
  };

  const handleAdd = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/info-paket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPackage)
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setPackages(prev => [...prev, result.data]);
        setShowAddForm(false);
        setNewPackage({
          title: '',
          description: '',
          price: 0,
          duration: '',
          includes: [],
          excludes: [],
          image: '',
          isActive: true
        });
        showNotification('success', 'Package added successfully!');
      } else {
        showNotification('error', result.error || 'Failed to add package');
      }
    } catch (error) {
      console.error('Error adding package:', error);
      showNotification('error', 'Network error occurred');
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) {
      return;
    }

    try {
      const response = await fetch(`/api/info-paket/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setPackages(prev => prev.filter(pkg => pkg.id !== id));
        showNotification('success', 'Package deleted successfully!');
      } else {
        showNotification('error', result.error || 'Failed to delete package');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      showNotification('error', 'Network error occurred');
    }
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
    <div className="min-h-screen bg-gray-100">
      {/* Image Selector Modal */}
      {showImageSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Select Image from Public Folder</h3>
              <button
                onClick={() => setShowImageSelector(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Click on an image to select it for package image
              </p>
              <button
                onClick={fetchPublicImages}
                disabled={isLoadingImages}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isLoadingImages ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            <div className="overflow-y-auto max-h-96">
              {isLoadingImages ? (
                <div className="text-center py-12">
                  <div className="animate-spin mx-auto h-8 w-8 text-blue-600">
                    <svg fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Loading images...</p>
                </div>
              ) : Object.keys(publicImages).length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No images found</h3>
                  <p className="mt-1 text-sm text-gray-500">No image files found in the public folder.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(publicImages).map(([folderName, files]) => (
                    <div key={folderName}>
                      <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        {folderName === 'root' ? 'Root Folder' : folderName} ({files.length} files)
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {files.map((file: PublicFile, index: number) => (
                          <div 
                            key={`${folderName}-${index}`} 
                            className="relative group cursor-pointer bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                            onClick={() => handleImageSelect(file.url, showImageSelector.packageId)}
                          >
                            <div className="aspect-square">
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                            <div className="p-2">
                              <p className="text-xs text-gray-600 truncate">{file.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.type && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${
          notification.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'
        } border px-4 py-3 rounded shadow-lg`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setNotification({ type: null, message: '' })}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="mr-4 inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Info Paket Management
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Kelola paket wisata dan tour packages
                </p>
              </div>
            </div>            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/info-paket/content')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Manage Content
              </button>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {showAddForm ? 'Cancel' : 'Add Package'}
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          {/* Add Form */}
          {showAddForm && (
            <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Add New Package
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={newPackage.title}
                        onChange={(e) => setNewPackage(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Package title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={newPackage.duration}
                        onChange={(e) => setNewPackage(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 2 days 1 night"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (IDR)
                    </label>
                    <input
                      type="number"
                      value={newPackage.price}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newPackage.description}
                      onChange={(e) => setNewPackage(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Package description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image
                    </label>
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <select
                          value={newPackage.image || ''}
                          onChange={(e) => setNewPackage(prev => ({ ...prev, image: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select an image...</option>                          {getAllImages().map((file, index) => (
                            <option key={index} value={file.url}>
                              {file.name} ({file.path.includes('/') ? file.path.split('/')[0] : 'Root'})
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => openImageSelector('new')}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          Browse
                        </button>
                      </div>
                      {newPackage.image && (
                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <p className="text-sm text-gray-600 mb-2">Preview:</p>
                          <div className="relative w-full h-32 bg-gray-100 rounded overflow-hidden">
                            <img
                              src={newPackage.image}
                              alt="Package preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAdd}
                      disabled={isSaving}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSaving ? 'Adding...' : 'Add Package'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Packages List */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Tour Packages ({packages.length})
              </h3>
              
              {packages.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No packages</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding your first tour package.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                      {isEditing && editingPackage?.id === pkg.id ? (
                        /* Edit Mode */
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                              <input
                                type="text"
                                value={editingPackage.title}
                                onChange={(e) => setEditingPackage(prev => prev ? { ...prev, title: e.target.value } : null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                              <input
                                type="text"
                                value={editingPackage.duration}
                                onChange={(e) => setEditingPackage(prev => prev ? { ...prev, duration: e.target.value } : null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (IDR)</label>
                            <input
                              type="number"
                              value={editingPackage.price}
                              onChange={(e) => setEditingPackage(prev => prev ? { ...prev, price: Number(e.target.value) } : null)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                              value={editingPackage.description}
                              onChange={(e) => setEditingPackage(prev => prev ? { ...prev, description: e.target.value } : null)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                            <div className="space-y-3">
                              <div className="flex space-x-2">
                                <select
                                  value={editingPackage.image || ''}
                                  onChange={(e) => setEditingPackage(prev => prev ? { ...prev, image: e.target.value } : null)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select an image...</option>
                                  {getAllImages().map((file, index) => (
                                    <option key={index} value={file.url}>
                                      {file.name} ({file.path.includes('/') ? file.path.split('/')[0] : 'Root'})
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => openImageSelector(pkg.id)}
                                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  Browse
                                </button>
                              </div>
                              {editingPackage.image && (
                                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                  <div className="relative w-full h-32 bg-gray-100 rounded overflow-hidden">
                                    <img
                                      src={editingPackage.image}
                                      alt="Package preview"
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={handleCancelEdit}
                              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSave}
                              disabled={isSaving}
                              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                            >
                              {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* View Mode */
                        <div className="flex items-start space-x-4">
                          {pkg.image && (
                            <div className="flex-shrink-0">
                              <img
                                src={pkg.image}
                                alt={pkg.title}
                                className="w-20 h-20 object-cover rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-lg font-medium text-gray-900 truncate">{pkg.title}</h4>
                                {pkg.duration && (
                                  <p className="text-sm text-gray-500">{pkg.duration}</p>
                                )}
                                {pkg.price > 0 && (
                                  <p className="text-sm font-medium text-green-600">
                                    IDR {pkg.price.toLocaleString()}
                                  </p>
                                )}
                                {pkg.description && (
                                  <p className="text-sm text-gray-600 mt-2">{pkg.description}</p>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <button
                                  onClick={() => handleEdit(pkg)}
                                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(pkg.id)}
                                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
