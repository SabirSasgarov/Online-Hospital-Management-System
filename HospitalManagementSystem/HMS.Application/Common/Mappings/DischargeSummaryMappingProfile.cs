using AutoMapper;
using HMS.Application.DischargeSummaries.DTOs;

namespace HMS.Application.Common.Mappings
{
    public class DischargeSummaryMappingProfile : Profile
    {
        public DischargeSummaryMappingProfile()
        {
            CreateMap<DischargeSummary, DischargeSummaryDto>()
                .ForMember(d => d.PatientName,   o => o.MapFrom(s => s.Patient.User.FirstName + " " + s.Patient.User.LastName))
                .ForMember(d => d.DoctorName,    o => o.MapFrom(s => s.Doctor.User.FirstName  + " " + s.Doctor.User.LastName))
                .ForMember(d => d.Diagnosis,     o => o.MapFrom(s => s.Visit.Diagnosis))
                .ForMember(d => d.Treatment,     o => o.MapFrom(s => s.Visit.Treatment))
                .ForMember(d => d.AdmissionDate, o => o.MapFrom(s => s.Visit.AdmissionDate))
                .ForMember(d => d.DischargeDate, o => o.MapFrom(s => s.Visit.DischargeDate));

            CreateMap<CreateDischargeSummaryDto, DischargeSummary>(MemberList.None);
            CreateMap<UpdateDischargeSummaryDto, DischargeSummary>(MemberList.None)
                .ForAllMembers(o => o.Condition((_, _, srcMember) => srcMember != null));
        }
    }
}
