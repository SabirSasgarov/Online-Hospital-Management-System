import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { announcementsApi, type ListAnnouncementsParams } from '@/lib/api/announcements'
import type { CreateAnnouncementRequest, UpdateAnnouncementRequest } from '@/types/api'

/** Public — used by the unauthenticated home page's Announcements feed. */
export function usePublicAnnouncements(pageSize = 6) {
  return useQuery({
    queryKey: ['publicAnnouncements', pageSize],
    queryFn: () => announcementsApi.listPublic({ pageSize }),
  })
}

/** Admin CMS — includes drafts. */
export function useAnnouncements(params: ListAnnouncementsParams = {}) {
  return useQuery({
    queryKey: ['announcements', params],
    queryFn: () => announcementsApi.list(params),
  })
}

export function useCreateAnnouncement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateAnnouncementRequest) => announcementsApi.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcements'] })
      qc.invalidateQueries({ queryKey: ['publicAnnouncements'] })
    },
  })
}

export function useUpdateAnnouncement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAnnouncementRequest }) => announcementsApi.update(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcements'] })
      qc.invalidateQueries({ queryKey: ['publicAnnouncements'] })
    },
  })
}

export function useDeleteAnnouncement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => announcementsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcements'] })
      qc.invalidateQueries({ queryKey: ['publicAnnouncements'] })
    },
  })
}
