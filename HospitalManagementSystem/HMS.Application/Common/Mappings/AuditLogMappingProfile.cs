using AutoMapper;
using HMS.Application.AuditLogs.DTOs;

namespace HMS.Application.Common.Mappings
{
    public class AuditLogMappingProfile : Profile
    {
        public AuditLogMappingProfile()
        {
            CreateMap<AuditLog, AuditLogDto>();
        }
    }
}
