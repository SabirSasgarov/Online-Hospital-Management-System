import { api } from '../apiClient'
import type { CreateStaffUserRequest, StaffUserDto } from '@/types/api'

export interface ListUsersParams {
  role?: 'Nurse' | 'Admin' | 'Doctor' | 'Patient'
}

export const usersApi = {
  list: (params: ListUsersParams = {}) => api.get<StaffUserDto[]>('/user', { ...params }),
  create: (dto: CreateStaffUserRequest) => api.post<StaffUserDto>('/user', dto),
  setActive: (id: string, isActive: boolean) => api.patch<void>(`/user/${id}/active`, undefined, { isActive }),
}
