using FluentValidation;
using HMS.Application.Prescriptions.Commands;

namespace HMS.Application.Prescriptions.Validators
{
    public class CreatePrescriptionCommandValidator : AbstractValidator<CreatePrescriptionCommand>
    {
        public CreatePrescriptionCommandValidator()
        {
            RuleFor(x => x.Dto.VisitId).NotEmpty();
            RuleFor(x => x.Dto.PatientId).NotEmpty();
            RuleFor(x => x.Dto.DoctorId).NotEmpty();
            RuleFor(x => x.Dto.Medications).NotEmpty().WithMessage("At least one medication is required.");
            RuleForEach(x => x.Dto.Medications).ChildRules(m =>
            {
                m.RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
                m.RuleFor(x => x.Dosage).NotEmpty().MaximumLength(100);
                m.RuleFor(x => x.Frequency).NotEmpty().MaximumLength(100);
                m.RuleFor(x => x.Duration).NotEmpty().MaximumLength(100);
            });
            RuleFor(x => x.Dto.Notes).MaximumLength(1000).When(x => x.Dto.Notes is not null);
        }
    }

    public class ChangePrescriptionStatusCommandValidator : AbstractValidator<ChangePrescriptionStatusCommand>
    {
        private static readonly PrescriptionStatus[] Allowed = [PrescriptionStatus.Completed, PrescriptionStatus.Cancelled];
        public ChangePrescriptionStatusCommandValidator()
        {
            RuleFor(x => x.PrescriptionId).NotEmpty();
            RuleFor(x => x.Dto.Status)
                .Must(s => Allowed.Contains(s))
                .WithMessage("Status must be Completed or Cancelled.");
        }
    }
}
