// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  // Зар авах
  getListing: async (id: string) => {
    const res = await fetch(`${API_BASE}/api/listings/${id}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
  },

  // Зарын статус шинэчлэх
  updateListingStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_BASE}/api/listings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Статус шинэчлэхэд алдаа');
    return res.json();
  },

  // Зар идэвхжүүлэх (approve)
  approveListing: async (id: string) => {
    return api.updateListingStatus(id, 'active');
  },

  // Зар татгалзах (reject)
  rejectListing: async (id: string) => {
    return api.updateListingStatus(id, 'rejected');
  },

  // Зар устгах
  deleteListing: async (id: string) => {
    const res = await fetch(`${API_BASE}/api/listings/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Зар устгахад алдаа');
    return res.json();
  },
};