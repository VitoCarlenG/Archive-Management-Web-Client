import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:8083',
    timeout: 120000
})