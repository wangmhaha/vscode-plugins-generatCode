// utils/request.d.ts
interface RequestOptions {
  method: string;
  data?: any;
  params?: any;
}

declare function request<T>(url: string, options: RequestOptions): Promise<T>;
export default request;
