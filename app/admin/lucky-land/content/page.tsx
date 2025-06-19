'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface Attraction {
  name: string;
  image: string;
}

interface LuckyLandContent {
  title: string;
  headerImage: string;
  description: string;
  sectionTitle: string;
  attractions: Attraction[];
  websiteInfo: string;
  contactInfo: string;
  isActive: boolean;
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

export default function AdminLuckyLandContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [content, setContent] = useState<LuckyLandContent | null>(null);
  const [editedContent, setEditedContent] = useState<LuckyLandContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [contentVersion, setContentVersion] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [publicImages, setPublicImages] = useState<{ [key: string]: PublicFile[] }>({});
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState<{ field: string, index?: number } | null>(null);
  const router = useRouter();
  // Check for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (content && editedContent && isEditing) {
      const hasChanges = JSON.stringify(content) !== JSON.stringify(editedContent);
      setHasUnsavedChanges(hasChanges);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [content, editedContent, isEditing]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = Cookies.get('admin-token');
    if (!token) {
      router.push('/admin/login');
    } else {
      try {
        const userData = JSON.parse(token);
        setUser(userData);
        setIsAuthenticated(true);
        fetchContent();
      } catch (error) {
        console.error('Error parsing user data:', error);
        Cookies.remove('admin-token');
        router.push('/admin/login');
      }
    }
    setIsLoading(false);
  };

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/lucky-content');
      const data = await response.json();
      
      if (data.success) {
        setContent(data.data.content);
        setContentVersion(data.data.version);
        setLastUpdated(new Date(data.data.updatedAt).toLocaleString());
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      showNotification('error', 'Gagal memuat konten');
    }
  };

  const fetchPublicImages = async () => {
    setIsLoadingImages(true);
    try {
      const response = await fetch('/api/gallery/scan-public');
      const data = await response.json();
      
      if (data.success) {
        // Group images by category/folder
        const groupedImages: { [key: string]: PublicFile[] } = {};
        data.data.files.forEach((file: PublicFile) => {
          const category = file.path.split('/')[1] || 'root';
          if (!groupedImages[category]) {
            groupedImages[category] = [];
          }
          groupedImages[category].push(file);
        });
        setPublicImages(groupedImages);
      }
    } catch (error) {
      console.error('Error fetching public images:', error);
    }
    setIsLoadingImages(false);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: null, message: '' }), 5000);
  };

  const handleEdit = () => {
    if (content) {
      setEditedContent({ ...content });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setEditedContent(null);
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const handleSave = async () => {
    if (!editedContent) return;

    console.log('Saving lucky land content:', JSON.stringify(editedContent, null, 2));

    setIsSaving(true);
    try {
      const response = await fetch('/api/lucky-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editedContent }),
      });

      const result = await response.json();
      console.log('Save result:', result);
      
      if (result.success) {
        setContent(editedContent);
        setIsEditing(false);
        setHasUnsavedChanges(false);
        setContentVersion(result.data.version);
        setLastUpdated(new Date(result.data.updatedAt).toLocaleString());
        showNotification('success', 'Konten Lucky Land berhasil disimpan!');
      } else {
        showNotification('error', `Terjadi kesalahan: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      showNotification('error', 'Terjadi kesalahan saat menyimpan!');
    }
    setIsSaving(false);
  };

  const handleInputChange = (field: keyof LuckyLandContent, value: string | boolean | Attraction[]) => {
    console.log('Input change:', field, value);
    if (editedContent) {
      setEditedContent({
        ...editedContent,
        [field]: value
      });
      setHasUnsavedChanges(true);
    }
  };

  const handleAttractionChange = (index: number, field: keyof Attraction, value: string) => {
    if (editedContent) {
      const newAttractions = [...editedContent.attractions];
      newAttractions[index] = { ...newAttractions[index], [field]: value };
      handleInputChange('attractions', newAttractions);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    if (showImageSelector) {
      if (showImageSelector.field === 'headerImage') {
        handleInputChange('headerImage', imageUrl);
      } else if (showImageSelector.field === 'attraction' && showImageSelector.index !== undefined) {
        handleAttractionChange(showImageSelector.index, 'image', imageUrl);
      }
      setShowImageSelector(null);
    }
  };

  const openImageSelector = (field: string, index?: number) => {
    setShowImageSelector({ field, index });
    if (Object.keys(publicImages).length === 0) {
      fetchPublicImages();
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div className="flex space-x-4">
              <a href="/admin/dashboard" className="hover:text-gray-300">Dashboard</a>
              <a href="/admin/gallery" className="hover:text-gray-300">Gallery</a>
              <a href="/admin/homepage" className="hover:text-gray-300">Homepage</a>
              <a href="/admin/info-paket" className="hover:text-gray-300">Info Paket</a>
              <a href="/admin/info-paket/content" className="hover:text-gray-300">Info Paket Content</a>
              <a href="/admin/perahu-mesin/content" className="hover:text-gray-300">Perahu Mesin</a>
              <a href="/admin/kampoeng-rawa/content" className="hover:text-gray-300">Kampoeng Rawa</a>
              <a href="/admin/lucky-land/content" className="text-blue-400 font-semibold">Lucky Land</a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user?.username}</span>            <button
              onClick={() => {
                Cookies.remove('admin-token');
                router.push('/admin/login');
              }}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Notification */}
      {notification.type && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          notification.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {notification.type === 'success' ? '✅' : '❌'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Lucky Land Content Management
              </h1>
              {user && (
                <p className="text-sm text-gray-600 mt-1">
                  Kelola konten halaman Lucky Land
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Content
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Content Status */}
          {contentVersion && (
            <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Content Information</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Version: {contentVersion} | Last updated: {lastUpdated}</p>
                    {hasUnsavedChanges && <p className="text-amber-700 font-medium mt-1">⚠️ You have unsaved changes</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Form */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                  Basic Information
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editedContent?.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Lucky\nLand"
                      />
                    ) : (
                      <div className="text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-line">
                        {content?.title}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Header Image
                    </label>
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          <select
                            value={editedContent?.headerImage || ''}
                            onChange={(e) => handleInputChange('headerImage', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select an image...</option>
                            {Object.entries(publicImages).map(([category, files]) => (
                              <optgroup key={category} label={category}>
                                {files.map(file => (
                                  <option key={file.path} value={file.path}>
                                    {file.name} ({Math.round(file.size / 1024)}KB)
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => openImageSelector('headerImage')}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Browse
                          </button>
                        </div>
                        {editedContent?.headerImage && (
                          <div className="mt-2">
                            <img
                              src={editedContent.headerImage}
                              alt="Header preview"
                              className="h-32 w-48 object-cover rounded-md border"
                              onError={(e) => {
                                console.error('Image failed to load:', editedContent.headerImage);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <img
                          src={content?.headerImage}
                          alt="Header"
                          className="h-16 w-24 object-cover rounded-md border"
                        />
                        <span className="text-sm text-gray-600">{content?.headerImage}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editedContent?.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Description about Lucky Land..."
                      />
                    ) : (
                      <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                        {content?.description}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editedContent?.sectionTitle || ''}
                        onChange={(e) => handleInputChange('sectionTitle', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Wahana di\nLucky Land"
                      />
                    ) : (
                      <div className="text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-line">
                        {content?.sectionTitle}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Attractions */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                  Attractions
                </h3>
                <div className="space-y-4">
                  {(isEditing ? editedContent?.attractions : content?.attractions)?.map((attraction, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Attraction Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={attraction.name}
                              onChange={(e) => handleAttractionChange(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                              {attraction.name}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image
                          </label>
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="flex space-x-2">
                                <select
                                  value={attraction.image}
                                  onChange={(e) => handleAttractionChange(index, 'image', e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select an image...</option>
                                  {Object.entries(publicImages).map(([category, files]) => (
                                    <optgroup key={category} label={category}>
                                      {files.map(file => (
                                        <option key={file.path} value={file.path}>
                                          {file.name} ({Math.round(file.size / 1024)}KB)
                                        </option>
                                      ))}
                                    </optgroup>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => openImageSelector('attraction', index)}
                                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  Browse
                                </button>
                              </div>
                              {attraction.image && (
                                <div className="mt-2">
                                  <img
                                    src={attraction.image}
                                    alt={`${attraction.name} preview`}
                                    className="h-20 w-20 object-cover rounded-md border"
                                    onError={(e) => {
                                      console.error('Image failed to load:', attraction.image);
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center space-x-3">
                              <img
                                src={attraction.image}
                                alt={attraction.name}
                                className="h-12 w-12 object-cover rounded-md border"
                              />
                              <span className="text-sm text-gray-600">{attraction.image}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website Info Text
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedContent?.websiteInfo || ''}
                        onChange={(e) => handleInputChange('websiteInfo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Info Lebih Lanjut Hubungi :"
                      />
                    ) : (
                      <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                        {content?.websiteInfo}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Info (Phone/WhatsApp)
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedContent?.contactInfo || ''}
                        onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0812-3456-7890"
                      />
                    ) : (
                      <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                        {content?.contactInfo}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Image Selector Modal */}
      {showImageSelector && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Image</h3>
              
              {isLoadingImages ? (
                <div className="text-center py-4">Loading images...</div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {Object.entries(publicImages).map(([category, files]) => (
                    <div key={category} className="mb-6">
                      <h4 className="font-medium text-gray-700 mb-2 capitalize">{category}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {files.map(file => (
                          <div
                            key={file.path}
                            className="cursor-pointer border rounded-lg p-2 hover:border-blue-500 hover:shadow-md transition-all"
                            onClick={() => handleImageSelect(file.path)}
                          >
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-20 object-cover rounded mb-1"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <p className="text-xs text-gray-600 truncate">{file.name}</p>
                            <p className="text-xs text-gray-400">{Math.round(file.size / 1024)}KB</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowImageSelector(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
