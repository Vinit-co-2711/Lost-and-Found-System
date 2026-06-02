const API_BASE_URL = '/api/items';

// Helper to fetch authorization header
const getHeaders = (contentType = 'application/json') => {
  const headers = {};
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  
  const token = localStorage.getItem('access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const itemApi = {
  /**
   * Fetches logged items. Accessible to all authenticated users.
   */
  async fetchItems(status = null) {
    let url = API_BASE_URL;
    if (status && status !== 'ALL') {
      url += `?status=${status.toUpperCase()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(`Failed to fetch items: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Log a new item. Sends a multipart request containing:
   * - A "file" part (MultipartFile)
   * - An "item" part (JSON metadata Blob of type application/json)
   */
  async createItem(itemData, file) {
    const formData = new FormData();
    
    // 1. Pack the item data into a blob metadata block of type application/json
    const itemBlob = new Blob([JSON.stringify(itemData)], {
      type: 'application/json'
    });
    formData.append('item', itemBlob);

    // 2. Pack the file if selected
    if (file) {
      formData.append('file', file);
    }

    // Set custom content headers without Content-Type to let browser insert correct boundary headers
    const headers = getHeaders(null); 

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg || 'Failed to log report');
    }
    return response.json();
  },

  /**
   * Updates dynamic item status. Restricted to STAFF/ADMIN.
   */
  async updateItemStatus(id, newStatus) {
    const response = await fetch(`${API_BASE_URL}/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg || 'Failed to update item status');
    }
    return response.json();
  }
};
