const BASE_URL = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api`;

const BASE_USER_URL = `${BASE_URL}/user`;
const USER = {
    _BASE: BASE_USER_URL,
    LOGIN: `${BASE_USER_URL}/login`,
    REGISTER: `${BASE_USER_URL}/register`,
    LOGOUT: `${BASE_USER_URL}/logout`,
    GET_USERS: `${BASE_USER_URL}/get-users`,
    GET_DEVICES: `${BASE_USER_URL}/get-devices`,
    GET_DASHBOARD_DATA: `${BASE_USER_URL}/get-dashboard-data`,
};

export const API_ENDPOINTS = {
    USER
};
