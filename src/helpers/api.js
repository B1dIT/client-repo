import axios from 'axios'

// set backend (Server) URL (endpoint)
const BASE_URL = "https://vbcw.onrender.com";
const backendUrl = `${BASE_URL}/vocabs/`;
const authUrl = `${BASE_URL}/api/auth/`;

// Vocab API calls
export const viewAllWords = async () => {
    try {
        const response = await axios.get(backendUrl);
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export const deleteWords = async (id) => { 
    try {
        const token = localStorage.getItem('token')
        const response = await axios.delete(backendUrl + id {
            header: {
                Authorization:`Bearer ${token}`
            }
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export const viewByVocabById = async (id) => {
    try {
        const response = await axios.get(backendUrl + id);
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export const updateVocab = async (id, updatedVocab) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(backendUrl + id, updatedVocab {
          headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

// Auth API calls
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(authUrl + 'register', userData);
        return response;
    } catch (err) {
        console.error('Register API Error:', err);
        throw err;
    }
}

export const loginUser = async (credentials) => {
    try {
        console.log('API: Calling login with URL:', authUrl + 'login');
        console.log('API: Credentials:', credentials);
        
        const response = await axios.post(authUrl + 'login', credentials);
        
        console.log('API: Login response:', response);
        return response;
    } catch (err) {
        console.error('Login API Error:', err);
        console.error('Error details:', err.response?.data);
        throw err;
    }
}

export const createVocab = async (newVocab) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(backendUrl, newVocab {
        Authorization :  `Bearer ${token}`        
        }
        return response.data;
    } catch (err) {
        console.error('Create Vocab API Error:', err);
        throw err;
    }
}

export const updatedUser = async (id, updatedUser) => {
    try {
        const response = await axios.put(authUrl + 'users/' + id, updatedUser);
        return response.data;
    } catch (err) {
        console.error('Update User API Error:', err);
        throw err;
    }
}

export async function getAllUsers() {
  const token = localStorage.getItem('token');
  return await axios.get(`${BASE_URL}/api/users/`, {  
    headers: {
      Authorization: `Bearer ${token}`
    }
}
)}

export const searchWords = async (query) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`https://vbcw.onrender.com/vocabs/search?keyword=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};
