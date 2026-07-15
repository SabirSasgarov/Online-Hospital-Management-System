using HMS.Application.Patients.PatientsDTOs;

namespace HMS.Application.Common.Mappings
{
    public class PatientMappingProfile : Profile
    {
        public PatientMappingProfile()
        {
            CreateMap<Patient, PatientSummaryDto>()
                .ForMember(d => d.FullName,  o => o.MapFrom(s => s.User.FirstName + " " + s.User.LastName))
                .ForMember(d => d.Email,     o => o.MapFrom(s => s.User.Email ?? string.Empty))
                .ForMember(d => d.Gender,    o => o.MapFrom(s => s.Gender.ToString()))
                .ForMember(d => d.IsActive,  o => o.MapFrom(s => s.User.IsActive));

            CreateMap<Patient, PatientDto>()
                .IncludeBase<Patient, PatientSummaryDto>()
                .ForMember(d => d.CurrentBedId,     o => o.MapFrom(s => s.CurrentBed != null ? s.CurrentBed.Id       : (Guid?)null))
                .ForMember(d => d.CurrentBedNumber, o => o.MapFrom(s => s.CurrentBed != null ? s.CurrentBed.BedNumber : null));

            CreateMap<Visit, VisitSummaryDto>()
                .ForMember(d => d.DoctorName, o => o.MapFrom(s => s.Doctor.User.FirstName + " " + s.Doctor.User.LastName))
                .ForMember(d => d.Status,     o => o.MapFrom(s => s.Status.ToString()));

            CreateMap<Prescription, PrescriptionSummaryDto>()
                .ForMember(d => d.DoctorName,      o => o.MapFrom(s => s.Doctor.User.FirstName + " " + s.Doctor.User.LastName))
                .ForMember(d => d.Status,           o => o.MapFrom(s => s.Status.ToString()))
                .ForMember(d => d.MedicationNames,  o => o.MapFrom(s => s.Medications.Select(m => m.Name).ToList()));

            CreateMap<LabResult, LabResultSummaryDto>()
                .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));

            // Admin creates a new patient — maps identity fields to AppUser
            CreateMap<CreatePatientDto, AppUser>(MemberList.None)
                .ForMember(d => d.EmailConfirmed, o => o.MapFrom(_ => true))
                .ForMember(d => d.IsActive,       o => o.MapFrom(_ => true));

            // Admin creates a new patient — maps clinical fields to Patient profile
            CreateMap<CreatePatientDto, Patient>(MemberList.None)
                .ForMember(d => d.UserId, o => o.Ignore());

            // Patient/admin updates contact info — applied onto existing tracked entities
            CreateMap<UpdatePatientDto, Patient>(MemberList.None)
                .ForMember(d => d.Phone,                 o => o.MapFrom(s => s.Phone))
                .ForMember(d => d.Address,               o => o.MapFrom(s => s.Address))
                .ForMember(d => d.EmergencyContactName,  o => o.MapFrom(s => s.EmergencyContactName))
                .ForMember(d => d.EmergencyContactPhone, o => o.MapFrom(s => s.EmergencyContactPhone));

            CreateMap<UpdatePatientDto, AppUser>(MemberList.None)
                .ForMember(d => d.FirstName, o => o.MapFrom(s => s.FirstName))
                .ForMember(d => d.LastName,  o => o.MapFrom(s => s.LastName));

            // Doctor/admin updates clinical data
            CreateMap<UpdateMedicalHistoryDto, Patient>(MemberList.None)
                .ForMember(d => d.BloodType,  o => o.MapFrom(s => s.BloodType))
                .ForMember(d => d.Conditions, o => o.MapFrom(s => s.Conditions))
                .ForMember(d => d.Allergies,  o => o.MapFrom(s => s.Allergies));
        }
    }
}
