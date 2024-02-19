import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
const _BASE_URL = import.meta.env.VITE_BASE_URL_APIS;
const _MYTOKEN = import.meta.env.VITE_KEY_TOKEN;
const noParam = () => {
  const cf = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "auth-token": _MYTOKEN,
    },
  };
  return cf;
};

const usParam = (param: any) => {
  const cf = {
    params: param,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "auth-token": _MYTOKEN,
    },
  };
  return cf;
};

const apis = axios.create({ baseURL: _BASE_URL });

// Request interceptors
apis.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    //console.log(config);
    return config;
  },
  (error: any) => {
    Promise.reject(error);
  }
);

// Response interceptors
apis.interceptors.response.use(
  async (response: AxiosResponse) => {
    // do something request interceptors
    // console.log(response.data);
    return response;
  },
  (error: any) => {
    // do something
    return Promise.reject(error);
  }
);

const albumApis = {
  get: (url: string) => {
    const fn = {
      finish: async () => {
        return apis.get(url, noParam());
      },
      params: (params: any) => {
        const fn = {
          finish: async () => {
            return apis.get(url, usParam(params));
          },
        };
        return fn;
      },
    };
    return fn;
  },
  post: (url: string) => {
    const fn = {
      data: (data: any) => {
        const jsData: any = JSON.stringify(data);
        const fn = {
          finish: async () => {
            return apis.post(url, jsData, noParam());
          },
        };
        return fn;
      },
    };
    return fn;
  },
};

export default albumApis;
