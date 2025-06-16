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
    GET_PROFILE_DATA: `${BASE_USER_URL}/get-profile-data`,
    IS_LOGGED_IN: `${BASE_USER_URL}/is-logged-in`,
};

const BASE_PROTOTYPE_URL = `${BASE_URL}/prototype`;
const PROTOTYPE = {
    _BASE: BASE_PROTOTYPE_URL,
    GET_LAST_INTERNAL_READINGS: `${BASE_PROTOTYPE_URL}/get-last-internal-readings`,
    GET_LAST_EXTERNAL_READINGS: `${BASE_PROTOTYPE_URL}/get-last-external-readings`,
};

export const API_ENDPOINTS = {
    USER,
    PROTOTYPE,
    GEOCODING: `${BASE_URL}/geocoding`
};
