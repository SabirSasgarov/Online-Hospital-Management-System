using AutoMapper;
using HMS.Application.Prescriptions.DTOs;

namespace HMS.Application.Common.Mappings
{
    public class PrescriptionMappingProfile : Profile
    {
        public PrescriptionMappingProfile()
        {
            CreateMap<PrescriptionMedication, PrescriptionMedicationDto>();

            CreateMap<Prescription, PrescriptionDto>()
                .ForMember(d => d.PatientName, o => o.MapFrom(s => s.Patient.User.FirstName + " " + s.Patient.User.LastName))
                .ForMember(d => d.DoctorName,  o => o.MapFrom(s => s.Doctor.User.FirstName  + " " + s.Doctor.User.LastName))
                .ForMember(d => d.Status,      o => o.MapFrom(s => s.Status.ToString()));

            CreateMap<CreatePrescriptionDto, Prescription>(MemberList.None);
            CreateMap<CreateMedicationDto, PrescriptionMedication>(MemberList.None);
        }
    }
}
