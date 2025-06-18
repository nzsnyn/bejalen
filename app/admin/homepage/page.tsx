'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface HomepageContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  about: {
    title: string;
    description: string;
  };
  rawaPening: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
  };
  destinations: {
    title: string;
    subtitle: string;
  };
}

export default function AdminHomepage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [editedContent, setEditedContent] = useState<HomepageContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [contentVersion, setContentVersion] = useState<number | null>(null);  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [publicImages, setPublicImages] = useState<{ [key: string]: any[] }>({});
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState<{ field: string, section: string } | null>(null);
  const router = useRouter();

  // Check for unsaved changes
  useEffect(() => {
    if (content && editedContent && isEditing) {
      const hasChanges = JSON.stringify(content) !== JSON.stringify(editedContent);
      setHasUnsavedChanges(hasChanges);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [content, editedContent, isEditing]);

  useEffect(() => {
    const token = Cookies.get('admin-token');
    if (!token) {
      router.push('/admin/login');
    } else {
      try {
        const userData = JSON.parse(token);
        setUser(userData);
        setIsAuthenticated(true);
        fetchHomepageContent();
      } catch (error) {
        console.error('Error parsing user data:', error);
        Cookies.remove('admin-token');
        router.push('/admin/login');
      }
    }
    setIsLoading(false);
  }, [router]);
  const fetchHomepageContent = async () => {
    try {
      const response = await fetch('/api/homepage');
      if (response.ok) {
        const data = await response.json();
        setContent(data.data.content);
        setEditedContent(data.data.content);
        
        // Try to get version info if available
        try {
          const versionResponse = await fetch('/api/homepage', { method: 'PATCH' });
          if (versionResponse.ok) {
            const versionData = await versionResponse.json();
            if (versionData.success && versionData.data.length > 0) {
              const latestVersion = versionData.data[0];
              setContentVersion(latestVersion.version);
              setLastUpdated(new Date(latestVersion.updatedAt).toLocaleString());
            }
          }
        } catch (versionError) {
          console.log('Could not fetch version info:', versionError);
        }
      }
    } catch (error) {
      console.error('Error fetching homepage content:', error);
    }
  };

  const handleLogout = () => {
    Cookies.remove('admin-token');
    router.push('/admin/login');
  };  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(content);
    setHasUnsavedChanges(false);
    // Load public images when entering edit mode
    if (Object.keys(publicImages).length === 0) {
      fetchPublicImages();
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmDiscard = window.confirm('Ada perubahan yang belum disimpan. Yakin ingin membatalkan?');
      if (!confirmDiscard) return;
    }
    setIsEditing(false);
    setEditedContent(content);
    setHasUnsavedChanges(false);
  };const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: null, message: '' });
    }, 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/homepage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent
        })
      });

      const result = await response.json();      if (response.ok && result.success) {
        setContent(editedContent);
        setIsEditing(false);
        setHasUnsavedChanges(false);
        setContentVersion(result.data.version);
        setLastUpdated(new Date(result.data.updatedAt).toLocaleString());
        showNotification('success', 'Homepage content berhasil disimpan!');
      } else {
        showNotification('error', `Terjadi kesalahan: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      showNotification('error', 'Terjadi kesalahan saat menyimpan!');
    }
    setIsSaving(false);
  };

  const handleInputChange = (section: keyof HomepageContent, field: string, value: string) => {
    if (editedContent) {
      setEditedContent({
        ...editedContent,
        [section]: {
          ...editedContent[section],
          [field]: value
        }
      });
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

  const handleImageSelect = (imageUrl: string, section: keyof HomepageContent, field: string) => {
    handleInputChange(section, field, imageUrl);
    setShowImageSelector(null);
  };

  const openImageSelector = (section: string, field: string) => {
    setShowImageSelector({ section, field });
    if (Object.keys(publicImages).length === 0) {
      fetchPublicImages();
    }
  };

  // Get all images in a flat array for dropdown
  const getAllImages = () => {
    const allImages: any[] = [];
    Object.entries(publicImages).forEach(([folderName, files]) => {
      files.forEach(file => {
        allImages.push({
          ...file,
          displayName: `${folderName === 'root' ? 'Root' : folderName}/${file.name}`,
          folderName
        });
      });
    });
    return allImages;
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
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
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
                Click on an image to select it for {showImageSelector.field}
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
                        {files.map((file: any, index: number) => (
                          <div 
                            key={`${folderName}-${index}`} 
                            className="relative group cursor-pointer bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                            onClick={() => handleImageSelect(file.url, showImageSelector.section as keyof HomepageContent, showImageSelector.field)}
                          >
                            <div className="aspect-square">
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
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
              </button>              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Homepage Management
                  {hasUnsavedChanges && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Unsaved changes
                    </span>
                  )}
                </h1>                <p className="text-sm text-gray-600 mt-1">
                  Kelola konten halaman utama website
                  {contentVersion && (
                    <span className="ml-2 text-xs text-gray-500">
                      • Version {contentVersion}
                      {lastUpdated && ` • Updated: ${lastUpdated}`}
                    </span>
                  )}
                </p>
              </div>
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
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>                  <button
                    onClick={handleSave}
                    disabled={isSaving || !hasUnsavedChanges}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                      hasUnsavedChanges && !isSaving 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                    } disabled:opacity-50`}
                  >
                    {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'No Changes'}
                  </button>
                </div>
              )}
              <button
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          
          {/* Hero Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Hero Section
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedContent?.hero.title || ''}
                      onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {content?.hero.title}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedContent?.hero.subtitle || ''}
                      onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {content?.hero.subtitle}
                    </p>
                  )}
                </div>                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Image
                  </label>                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <select
                          value={editedContent?.hero.backgroundImage || ''}
                          onChange={(e) => handleInputChange('hero', 'backgroundImage', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">-- Select an image --</option>
                          {getAllImages().map((image, index) => (
                            <option key={index} value={image.url}>
                              {image.displayName} ({(image.size / 1024).toFixed(1)} KB)
                            </option>
                          ))}
                        </select>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={editedContent?.hero.backgroundImage || ''}
                            onChange={(e) => handleInputChange('hero', 'backgroundImage', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Or enter custom path"
                          />
                          <button
                            type="button"
                            onClick={() => openImageSelector('hero', 'backgroundImage')}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            Gallery
                          </button>
                          <button
                            type="button"
                            onClick={fetchPublicImages}
                            disabled={isLoadingImages}
                            className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                          >
                            {isLoadingImages ? '...' : '↻'}
                          </button>
                        </div>
                      </div>
                      {editedContent?.hero.backgroundImage && (
                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <p className="text-sm text-gray-600 mb-2">Preview:</p>                          <div className="relative w-full h-32 bg-gray-100 rounded overflow-hidden">
                            <img
                              src={editedContent.hero.backgroundImage}
                              alt="Background preview"
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
                  ) : (
                    <div className="space-y-3">
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                        {content?.hero.backgroundImage}
                      </p>
                      {content?.hero.backgroundImage && (
                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <p className="text-sm text-gray-600 mb-2">Preview:</p>                          <div className="relative w-full h-32 bg-gray-100 rounded overflow-hidden">
                            <img
                              src={content.hero.backgroundImage}
                              alt="Background preview"
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
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                About Section
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedContent?.about.title || ''}
                      onChange={(e) => handleInputChange('about', 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {content?.about.title}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedContent?.about.description || ''}
                      onChange={(e) => handleInputChange('about', 'description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {content?.about.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Rawa Pening Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Rawa Pening Section
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedContent?.rawaPening.title || ''}
                      onChange={(e) => handleInputChange('rawaPening', 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {content?.rawaPening.title}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedContent?.rawaPening.subtitle || ''}
                      onChange={(e) => handleInputChange('rawaPening', 'subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {content?.rawaPening.subtitle}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedContent?.rawaPening.description || ''}
                      onChange={(e) => handleInputChange('rawaPening', 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {content?.rawaPening.description}
                    </p>
                  )}
                </div>                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <select
                          value={editedContent?.rawaPening.image || ''}
                          onChange={(e) => handleInputChange('rawaPening', 'image', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">-- Select an image --</option>
                          {getAllImages().map((image, index) => (
                            <option key={index} value={image.url}>
                              {image.displayName} ({(image.size / 1024).toFixed(1)} KB)
                            </option>
                          ))}
                        </select>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={editedContent?.rawaPening.image || ''}
                            onChange={(e) => handleInputChange('rawaPening', 'image', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Or enter custom path"
                          />
                          <button
                            type="button"
                            onClick={() => openImageSelector('rawaPening', 'image')}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            Gallery
                          </button>
                          <button
                            type="button"
                            onClick={fetchPublicImages}
                            disabled={isLoadingImages}
                            className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                          >
                            {isLoadingImages ? '...' : '↻'}
                          </button>
                        </div>
                      </div>
                      {editedContent?.rawaPening.image && (
                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <p className="text-sm text-gray-600 mb-2">Preview:</p>                          <div className="relative w-full h-32 bg-gray-100 rounded overflow-hidden">
                            <img
                              src={editedContent.rawaPening.image}
                              alt="Rawa Pening preview"
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
                  ) : (
                    <div className="space-y-3">
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                        {content?.rawaPening.image}
                      </p>
                      {content?.rawaPening.image && (
                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <p className="text-sm text-gray-600 mb-2">Preview:</p>                          <div className="relative w-full h-32 bg-gray-100 rounded overflow-hidden">
                            <img
                              src={content.rawaPening.image}
                              alt="Rawa Pening preview"
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
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Destinations Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Destinations Section
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedContent?.destinations.title || ''}
                      onChange={(e) => handleInputChange('destinations', 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {content?.destinations.title}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedContent?.destinations.subtitle || ''}
                      onChange={(e) => handleInputChange('destinations', 'subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {content?.destinations.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Preview & Actions
              </h3>              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => window.open('/', '_blank')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview Homepage
                  </button>
                  <button
                    onClick={fetchHomepageContent}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Content
                  </button>                  {isEditing && (
                    <button
                      onClick={() => {
                        setEditedContent(content);
                        showNotification('success', 'Changes reset to original values');
                      }}
                      className="inline-flex items-center px-4 py-2 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset Changes
                    </button>
                  )}
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Note
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Changes made here will update the homepage content. Make sure to preview changes before saving.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
