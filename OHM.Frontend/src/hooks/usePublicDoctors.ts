import { useQuery } from '@tanstack/react-query'
import { publicApi } from '@/lib/api/public'

export function usePublicDoctors(pageSize = 8) {
  return useQuery({
    queryKey: ['publicDoctors', pageSize],
    queryFn: () => publicApi.doctors({ pageSize }),
  })
}
