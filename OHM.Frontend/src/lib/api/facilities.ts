import { api } from '../apiClient'
import type {
  ApiBedStatus, ApiRoomType, AssignPatientToBedRequest, BedDto, CreateBedRequest, CreateRoomRequest,
  CreateWardRequest, PaginatedResult, RoomDto, RoomSummaryDto, UpdateBedStatusRequest, UpdateRoomRequest,
  UpdateWardRequest, WardDto, WardSummaryDto,
} from '@/types/api'

export interface ListWardsParams { search?: string; page?: number; pageSize?: number }
export interface ListRoomsParams { wardId?: string; search?: string; type?: ApiRoomType; page?: number; pageSize?: number }
export interface ListBedsParams { roomId?: string; wardId?: string; status?: ApiBedStatus; page?: number; pageSize?: number }

export const wardsApi = {
  list: (params: ListWardsParams = {}) => api.get<PaginatedResult<WardSummaryDto>>('/ward', { ...params }),
  getById: (id: string) => api.get<WardDto>(`/ward/${id}`),
  create: (dto: CreateWardRequest) => api.post<{ id: string }>('/ward', dto),
  update: (id: string, dto: UpdateWardRequest) => api.put<void>(`/ward/${id}`, dto),
  remove: (id: string) => api.delete<void>(`/ward/${id}`),
}

export const roomsApi = {
  list: (params: ListRoomsParams = {}) => api.get<PaginatedResult<RoomSummaryDto>>('/room', { ...params }),
  getById: (id: string) => api.get<RoomDto>(`/room/${id}`),
  create: (dto: CreateRoomRequest) => api.post<{ id: string }>('/room', dto),
  update: (id: string, dto: UpdateRoomRequest) => api.put<void>(`/room/${id}`, dto),
  remove: (id: string) => api.delete<void>(`/room/${id}`),
}

export const bedsApi = {
  list: (params: ListBedsParams = {}) => api.get<PaginatedResult<BedDto>>('/bed', { ...params }),
  getById: (id: string) => api.get<BedDto>(`/bed/${id}`),
  create: (dto: CreateBedRequest) => api.post<{ id: string }>('/bed', dto),
  updateStatus: (id: string, dto: UpdateBedStatusRequest) => api.patch<void>(`/bed/${id}/status`, dto),
  assign: (id: string, dto: AssignPatientToBedRequest) => api.post<void>(`/bed/${id}/assign`, dto),
  release: (id: string) => api.post<void>(`/bed/${id}/release`),
  remove: (id: string) => api.delete<void>(`/bed/${id}`),
}
