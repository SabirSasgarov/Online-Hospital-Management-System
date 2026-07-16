using AutoMapper;
using HMS.Application.LabResults.DTOs;

namespace HMS.Application.Common.Mappings
{
    public class LabResultMappingProfile : Profile
    {
        public LabResultMappingProfile()
        {
            CreateMap<LabResult, LabResultDto>()
                .ForMember(d => d.PatientName, o => o.MapFrom(s => s.Patient.User.FirstName + " " + s.Patient.User.LastName))
                .ForMember(d => d.OrderedBy,   o => o.MapFrom(s => s.OrderedBy.FirstName   + " " + s.OrderedBy.LastName))
                .ForMember(d => d.Status,      o => o.MapFrom(s => s.Status.ToString()));

            CreateMap<CreateLabResultDto, LabResult>(MemberList.None);
        }
    }
}
