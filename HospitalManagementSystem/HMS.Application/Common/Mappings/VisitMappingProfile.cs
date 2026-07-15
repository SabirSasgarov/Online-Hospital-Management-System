using HMS.Application.Patients.PatientsDTOs;
using HMS.Application.Visits.VisitsDTOs;

namespace HMS.Application.Common.Mappings
{
    public class VisitMappingProfile : Profile
    {
        public VisitMappingProfile()
        {
            // ── Entity → Response ─────────────────────────────────────────
            // Summary used by paginated list
            CreateMap<Visit, VisitSummaryDto>()
                .ForMember(d => d.DoctorName, o => o.MapFrom(s => s.Doctor.User.FirstName + " " + s.Doctor.User.LastName))
                .ForMember(d => d.Status,     o => o.MapFrom(s => s.Status.ToString()));

            // Full detail (Prescription/LabResult summary maps live in PatientMappingProfile)
            CreateMap<Visit, VisitDto>()
                .ForMember(d => d.PatientName,          o => o.MapFrom(s => s.Patient.User.FirstName + " " + s.Patient.User.LastName))
                .ForMember(d => d.DoctorName,           o => o.MapFrom(s => s.Doctor.User.FirstName  + " " + s.Doctor.User.LastName))
                .ForMember(d => d.DoctorSpecialization, o => o.MapFrom(s => s.Doctor.Specialization))
                .ForMember(d => d.BedNumber,            o => o.MapFrom(s => s.Bed != null ? s.Bed.BedNumber : null))
                .ForMember(d => d.Status,               o => o.MapFrom(s => s.Status.ToString()));

            // ── Request → Entity ──────────────────────────────────────────
            CreateMap<CreateVisitDto, Visit>(MemberList.None);

            CreateMap<UpdateVisitDto, Visit>(MemberList.None)
                .ForAllMembers(o => o.Condition((_, _, srcMember) => srcMember != null));
        }
    }
}
