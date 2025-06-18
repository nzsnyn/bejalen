'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
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

export default function AdminGallery() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [publicFiles, setPublicFiles] = useState<{ [key: string]: PublicFile[] }>({});
  const [activeTab, setActiveTab] = useState<'database' | 'public'>('database');
  const [isLoadingPublic, setIsLoadingPublic] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'general',
    file: null as File | null
  });
  const router = useRouter();

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'kampoeng-rawa', label: 'Kampoeng Rawa' },
    { value: 'perahu-mesin', label: 'Perahu Mesin' },
    { value: 'rawa-pening', label: 'Rawa Pening' }
  ];

  useEffect(() => {
    const token = Cookies.get('admin-token');
    if (!token) {
      router.push('/admin/login');
    } else {
      try {
        const userData = JSON.parse(token);        setUser(userData);
        setIsAuthenticated(true);
        fetchGalleryItems();
        fetchPublicFiles();
      } catch (error) {
        console.error('Error parsing user data:', error);
        Cookies.remove('admin-token');
        router.push('/admin/login');
      }
    }
    setIsLoading(false);
  }, [router]);
  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setGalleryItems(result.data.items);
        }
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    }
  };

  const fetchPublicFiles = async () => {
    setIsLoadingPublic(true);
    try {
      const response = await fetch('/api/gallery/scan-public');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPublicFiles(result.data.groupedImages);
        }
      }
    } catch (error) {
      console.error('Error fetching public files:', error);
      showNotification('error', 'Failed to scan public folder');
    }
    setIsLoadingPublic(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification('error', 'Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'File size must be less than 5MB');
        return;
      }

      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file || !uploadForm.title) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('category', uploadForm.category);

      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showNotification('success', 'Image uploaded successfully!');
        setShowUploadForm(false);
        setUploadForm({
          title: '',
          description: '',
          category: 'general',
          file: null
        });
        fetchGalleryItems(); // Refresh gallery
      } else {
        showNotification('error', result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification('error', 'Network error occurred');
    }

    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showNotification('success', 'Image deleted successfully!');
        fetchGalleryItems(); // Refresh gallery
      } else {
        showNotification('error', result.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
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
                  Gallery Management
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Upload dan kelola galeri foto website
                </p>
              </div>
            </div>            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {showUploadForm ? 'Cancel' : 'Upload Image'}
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
          
          {/* Upload Form */}
          {showUploadForm && (
            <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Upload New Image
                </h3>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter image title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={uploadForm.category}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter image description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image File *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                    </p>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowUploadForm(false)}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('database')}
                  className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'database'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Database Gallery ({galleryItems.length})
                </button>
                <button
                  onClick={() => setActiveTab('public')}
                  className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'public'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Public Folder ({Object.values(publicFiles).flat().length} files)
                </button>
              </nav>
            </div>
          </div>

          {/* Gallery Content */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {activeTab === 'database' ? (
                /* Database Gallery Tab */
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Database Gallery ({galleryItems.length})
                    </h3>
                    <button
                      onClick={fetchGalleryItems}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                  </div>
                  
                  {galleryItems.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No images in database</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by uploading your first image.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {galleryItems.map((item) => (
                        <div key={item.id} className="relative group">
                          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              width={300}
                              height={300}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-2">
                              <button
                                onClick={() => window.open(item.imageUrl, '_blank')}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className="mt-2">
                            <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                            <p className="text-xs text-gray-500 capitalize">{item.category.replace('-', ' ')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Public Folder Tab */
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Public Folder Files ({Object.values(publicFiles).flat().length} images)
                    </h3>
                    <button
                      onClick={fetchPublicFiles}
                      disabled={isLoadingPublic}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {isLoadingPublic ? 'Scanning...' : 'Scan Folder'}
                    </button>
                  </div>

                  {isLoadingPublic ? (
                    <div className="text-center py-12">
                      <div className="animate-spin mx-auto h-8 w-8 text-blue-600">
                        <svg fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Scanning public folder...</p>
                    </div>
                  ) : Object.keys(publicFiles).length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No images found</h3>
                      <p className="mt-1 text-sm text-gray-500">No image files found in the public folder.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(publicFiles).map(([folderName, files]) => (
                        <div key={folderName}>
                          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            {folderName === 'root' ? 'Root Folder' : folderName} ({files.length} files)
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {files.map((file: PublicFile, index: number) => (
                              <div key={`${folderName}-${index}`} className="relative group">
                                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                  <Image
                                    src={file.url}
                                    alt={file.name}
                                    width={300}
                                    height={300}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                  />
                                </div>
                                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-2">
                                    <button
                                      onClick={() => window.open(file.url, '_blank')}
                                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                    >
                                      View
                                    </button>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(file.url);
                                        showNotification('success', 'URL copied to clipboard!');
                                      }}
                                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                    >
                                      Copy URL
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">{file.name}</h4>
                                  <p className="text-xs text-gray-500">
                                    {file.extension} • {(file.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
