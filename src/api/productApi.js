import axiosClient from './axiosClient';

const productApi = {
  getAll: (params) => axiosClient.get('/products', { params }),

  getById: (id) => axiosClient.get(`/products/${id}`),

  create: (data, files) => {
    const formData = new FormData();
    // API expects `product` as JSON string part
    formData.append('product', JSON.stringify(data));

    if (files && files.length) {
      Array.from(files).forEach((f) => formData.append('files', f));
    }

    // Let axios set the multipart boundary header automatically
    return axiosClient.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },

  delete: (id) => axiosClient.delete(`/products/${id}`),
};

export default productApi;
