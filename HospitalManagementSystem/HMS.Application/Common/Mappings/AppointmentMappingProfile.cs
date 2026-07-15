using HMS.Application.Appointments.AppointmentsDTOs;

namespace HMS.Application.Common.Mappings
{
    public class AppointmentMappingProfile : Profile
    {
        public AppointmentMappingProfile()
        {
            // ── Entity → Response ─────────────────────────────────────────────
            CreateMap<Appointment, AppointmentSummaryDto>()
                .ForMember(d => d.PatientName,          o => o.MapFrom(s => s.Patient.User.FirstName + " " + s.Patient.User.LastName))
                .ForMember(d => d.DoctorName,           o => o.MapFrom(s => s.Doctor.User.FirstName  + " " + s.Doctor.User.LastName))
                .ForMember(d => d.DoctorSpecialization, o => o.MapFrom(s => s.Doctor.Specialization))
                .ForMember(d => d.Type,                 o => o.MapFrom(s => s.Type.ToString()))
                .ForMember(d => d.Status,               o => o.MapFrom(s => s.Status.ToString()));

            CreateMap<Appointment, AppointmentDto>()
                .IncludeBase<Appointment, AppointmentSummaryDto>()
                .ForMember(d => d.PatientEmail, o => o.MapFrom(s => s.Patient.User.Email ?? string.Empty))
                .ForMember(d => d.DoctorEmail,  o => o.MapFrom(s => s.Doctor.User.Email  ?? string.Empty));

            // ── Request → Entity ──────────────────────────────────────────────
            CreateMap<CreateAppointmentDto, Appointment>(MemberList.None);

            CreateMap<UpdateAppointmentDto, Appointment>(MemberList.None)
                .ForMember(d => d.ScheduledAt, o => o.MapFrom(s => s.ScheduledAt))
                .ForMember(d => d.Type,        o => o.MapFrom(s => s.Type))
                .ForMember(d => d.Notes,       o => o.MapFrom(s => s.Notes));
        }
    }
}
