using AutoMapper;
using HMS.Application.Doctors.DoctorsDTOs;

namespace HMS.Application.Common.Mappings
{
    public class DoctorMappingProfile : Profile
    {
        public DoctorMappingProfile()
        {
            // ── Entity → Response DTOs ────────────────────────────────────────

            CreateMap<DoctorSchedule, DoctorScheduleDto>()
                .ForMember(d => d.Day, o => o.MapFrom(s => s.Day.ToString()));

            CreateMap<Doctor, DoctorSummaryDto>()
                .ForMember(d => d.FullName,       o => o.MapFrom(s => s.User.FirstName + " " + s.User.LastName))
                .ForMember(d => d.Email,          o => o.MapFrom(s => s.User.Email ?? string.Empty))
                .ForMember(d => d.IsActive,       o => o.MapFrom(s => s.User.IsActive))
                .ForMember(d => d.ScheduleDays,   o => o.MapFrom(s => s.Schedules.Select(sc => sc.Day.ToString()).ToList()));

            CreateMap<Doctor, DoctorDto>()
                .IncludeBase<Doctor, DoctorSummaryDto>()
                .ForMember(d => d.Schedules,          o => o.MapFrom(s => s.Schedules))
                .ForMember(d => d.TotalAppointments,  o => o.MapFrom(s => s.Appointments.Count))
                .ForMember(d => d.ActiveVisits,       o => o.MapFrom(s => s.Visits.Count(v => v.Status == VisitStatus.Ongoing)));

            // ── Request DTOs → Entities ───────────────────────────────────────

            CreateMap<CreateDoctorDto, AppUser>(MemberList.None)
                .ForMember(d => d.EmailConfirmed, o => o.MapFrom(_ => true))
                .ForMember(d => d.IsActive,       o => o.MapFrom(_ => true));

            CreateMap<CreateDoctorDto, Doctor>(MemberList.None)
                .ForMember(d => d.UserId,   o => o.Ignore())
                .ForMember(d => d.Schedules, o => o.Ignore()); // built manually

            CreateMap<CreateDoctorScheduleDto, DoctorSchedule>(MemberList.None);

            CreateMap<UpdateDoctorDto, Doctor>(MemberList.None)
                .ForMember(d => d.Specialization, o => o.MapFrom(s => s.Specialization))
                .ForMember(d => d.Phone,          o => o.MapFrom(s => s.Phone));

            CreateMap<UpdateDoctorDto, AppUser>(MemberList.None)
                .ForMember(d => d.FirstName, o => o.MapFrom(s => s.FirstName))
                .ForMember(d => d.LastName,  o => o.MapFrom(s => s.LastName));
        }
    }
}
