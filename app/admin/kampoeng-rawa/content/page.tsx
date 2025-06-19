'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface Attraction {
  name: string;
  image: string;
}

interface KampoengRawaContent {
  title: string;
  headerImage: string;
  description: string;
  sectionTitle: string;
  attractions: Attraction[];
  websiteInfo: string;
  websiteUrl: string;
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

export default function AdminKampoengRawaContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [content, setContent] = useState<KampoengRawaContent | null>(null);
  const [editedContent, setEditedContent] = useState<KampoengRawaContent | null>(null);
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
        fetchContent();
      } catch (error) {
        console.error('Error parsing user data:', error);
        Cookies.remove('admin-token');
        router.push('/admin/login');
      }
    }
    setIsLoading(false);
  }, [router]);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/kampoeng-content');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setContent(result.data.content);
          setContentVersion(result.data.version);
          setLastUpdated(new Date(result.data.updatedAt).toLocaleString());
        }
      }
    } catch (error) {
      console.error('Error fetching kampoeng rawa content:', error);
      showNotification('error', 'Gagal mengambil data konten');
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
    }
    setIsLoadingImages(false);
  };

  const getAllImages = () => {
    const allImages: PublicFile[] = [];
    Object.values(publicImages).forEach(images => {
      allImages.push(...images);
    });
    return allImages;
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: null, message: '' });
    }, 5000);
  };

  const handleLogout = () => {
    Cookies.remove('admin-token');
    router.push('/admin/login');
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

    console.log('Saving content:', JSON.stringify(editedContent, null, 2));

    setIsSaving(true);
    try {
      const response = await fetch('/api/kampoeng-content', {
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
        showNotification('success', 'Konten Kampoeng Rawa berhasil disimpan!');
      } else {
        showNotification('error', `Terjadi kesalahan: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      showNotification('error', 'Terjadi kesalahan saat menyimpan!');
    }
    setIsSaving(false);
  };
  const handleInputChange = (field: keyof KampoengRawaContent, value: string | boolean | Attraction[]) => {
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
    <div className="min-h-screen bg-gray-100">
      {/* Image Selector Modal */}
      {showImageSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Select Image</h3>
                <button
                  onClick={() => setShowImageSelector(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {isLoadingImages ? (
                <div className="text-center py-8">
                  <div className="text-lg">Loading images...</div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {getAllImages().map((file, index) => (
                    <div
                      key={index}
                      className="cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      onClick={() => handleImageSelect(file.url)}
                    >
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.path.includes('/') ? file.path.split('/')[0] : 'Root'}</p>
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
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
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
                Kampoeng Rawa Content Management
              </h1>
              {user && (
                <p className="text-sm text-gray-600 mt-1">
                  Kelola konten halaman Kampoeng Rawa
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
          
          {/* Breadcrumb */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  Dashboard
                </button>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Kampoeng Rawa Content</span>
                </div>
              </li>
            </ol>
          </nav>
          
          {/* Content Status */}
          {contentVersion && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
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
                        placeholder="Kampoeng\nRawa"
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
                            {getAllImages().map((file, index) => (
                              <option key={index} value={file.url}>
                                {file.name} ({file.path.includes('/') ? file.path.split('/')[0] : 'Root'})
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => openImageSelector('headerImage')}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            Browse
                          </button>
                        </div>
                        {editedContent?.headerImage && (
                          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <p className="text-sm text-gray-600 mb-2">Preview:</p>
                            <div className="relative w-full h-64 bg-gray-100 rounded overflow-hidden">
                              <img
                                src={editedContent.headerImage}
                                alt="Header image preview"
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
                        <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                          {content?.headerImage}
                        </div>
                        {content?.headerImage && (
                          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                            <div className="relative w-full h-64 bg-gray-100 rounded overflow-hidden">
                              <img
                                src={content.headerImage}
                                alt="Current header image"
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
                        placeholder="Description about Kampoeng Rawa..."
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
                        placeholder="Yang Menarik di\nKampoeng Rawa"
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
                <div className="space-y-6">
                  {(isEditing ? editedContent?.attractions : content?.attractions)?.map((attraction, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-800 mb-4">Attraction {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={attraction.name}
                              onChange={(e) => handleAttractionChange(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Attraction name"
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
                                  {getAllImages().map((file, imgIndex) => (
                                    <option key={imgIndex} value={file.url}>
                                      {file.name} ({file.path.includes('/') ? file.path.split('/')[0] : 'Root'})
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => openImageSelector('attraction', index)}
                                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  Browse
                                </button>
                              </div>
                              {attraction.image && (
                                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                  <div className="relative w-full h-32 bg-gray-100 rounded overflow-hidden">
                                    <img
                                      src={attraction.image}
                                      alt="Attraction image preview"
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
                              <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                                {attraction.image}
                              </div>
                              {attraction.image && (
                                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                                  <div className="relative w-full h-32 bg-gray-100 rounded overflow-hidden">
                                    <img
                                      src={attraction.image}
                                      alt="Current attraction image"
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
                  ))}
                </div>
              </div>
            </div>

            {/* Website Info */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                  Website Information
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
                        placeholder="Info Lebih Lanjut Kunjungi :"
                      />
                    ) : (
                      <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                        {content?.websiteInfo}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={editedContent?.websiteUrl || ''}
                        onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://kampoengrawa.com/"
                      />
                    ) : (
                      <div className="text-gray-900 bg-gray-50 p-3 rounded-md">
                        {content?.websiteUrl}
                      </div>
                    )}
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
