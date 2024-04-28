import { get, post } from "@/utils/http";

export function getListApi(params?: object): Promise<any> {
  return get("/list/get", params);
}

export function getListApiError(data?: object): Promise<any> {
  return post("/list/error", data);
}
