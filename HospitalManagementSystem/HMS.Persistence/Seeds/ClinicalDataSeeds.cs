using HMS.Domain.Entities;
using HMS.Domain.Enums;
using HMS.Persistence.Context;
using Microsoft.AspNetCore.Identity;

namespace HMS.Persistence.Seeds
{
    /// <summary>
    /// Seeds Appointments, Visits, Prescriptions, LabResults, DischargeSummaries,
    /// Messages and Notifications using the already-seeded doctors and patients.
    /// </summary>
    public static class ClinicalDataSeeds
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            var context = services.GetRequiredService<AppDbContext>();
            var userManager = services.GetRequiredService<UserManager<AppUser>>();
            var logger = services.GetRequiredService<ILogger<AppDomain>>();

            try
            {
                if (context.Appointments.Any()) return;

                // ── Load seeded doctors & patients ────────────────────────────────────
                var doctors = context.Doctors
                    .Include(d => d.User)
                    .ToList();

                var patients = context.Patients
                    .Include(p => p.User)
                    .ToList();

                if (!doctors.Any() || !patients.Any())
                {
                    logger.LogWarning("Skipping clinical data seed — doctors or patients not seeded yet.");
                    return;
                }

                // Helper lookups — use email so they work even if FirstName wasn't set by UserAndRoleSeeds
                Doctor Doc(string email) => doctors.First(d => d.User.Email == email);
                Patient Pat(string email) => patients.First(p => p.User.Email == email);

                var drJames   = Doc("doctor@hms.com");
                var drMaria   = Doc("maria.santos@hms.com");
                var drKevin   = Doc("kevin.park@hms.com");
                var drLisa    = Doc("lisa.brown@hms.com");
                var drAhmed   = Doc("ahmed.hassan@hms.com");

                var emily     = Pat("patient@hms.com");
                var michael   = Pat("michael.chen@hms.com");
                var sarah     = Pat("sarah.williams@hms.com");
                var robert    = Pat("robert.garcia@hms.com");
                var jennifer  = Pat("jennifer.martinez@hms.com");
                var david     = Pat("david.thompson@hms.com");

                var now = DateTime.UtcNow;

                // ── Appointments ──────────────────────────────────────────────────────
                var appointments = new List<Appointment>
                {
                    new() { Patient = emily,    Doctor = drJames,  ScheduledAt = now.AddDays(7),  Type = AppointmentType.Consultation, Status = AppointmentStatus.Scheduled,  Notes = "Regular cardiac check",          CreatedBy = "system", CreatedAt = now },
                    new() { Patient = michael,  Doctor = drMaria,  ScheduledAt = now.AddDays(3),  Type = AppointmentType.FollowUp,     Status = AppointmentStatus.Scheduled,  Notes = "Headache follow-up",             CreatedBy = "system", CreatedAt = now },
                    new() { Patient = sarah,    Doctor = drKevin,  ScheduledAt = now.AddDays(-2), Type = AppointmentType.Consultation, Status = AppointmentStatus.Completed,  Notes = "Knee pain assessment",           CreatedBy = "system", CreatedAt = now },
                    new() { Patient = robert,   Doctor = drJames,  ScheduledAt = now.AddDays(-1), Type = AppointmentType.Emergency,    Status = AppointmentStatus.Completed,  Notes = "Chest pain emergency",           CreatedBy = "system", CreatedAt = now },
                    new() { Patient = jennifer, Doctor = drLisa,   ScheduledAt = now.AddDays(5),  Type = AppointmentType.Checkup,      Status = AppointmentStatus.Scheduled,  Notes = "Annual checkup",                 CreatedBy = "system", CreatedAt = now },
                    new() { Patient = david,    Doctor = drAhmed,  ScheduledAt = now.AddDays(-5), Type = AppointmentType.Consultation, Status = AppointmentStatus.Cancelled,  Notes = "Cancelled by patient",           CreatedBy = "system", CreatedAt = now },
                    new() { Patient = emily,    Doctor = drJames,  ScheduledAt = now.AddDays(14), Type = AppointmentType.FollowUp,     Status = AppointmentStatus.Scheduled,  Notes = "Post-visit follow-up",           CreatedBy = "system", CreatedAt = now },
                    new() { Patient = michael,  Doctor = drMaria,  ScheduledAt = now.AddDays(-7), Type = AppointmentType.Consultation, Status = AppointmentStatus.NoShow,     Notes = "Patient did not attend",         CreatedBy = "system", CreatedAt = now },
                };
                context.Appointments.AddRange(appointments);

                // ── Visits ────────────────────────────────────────────────────────────
                var visitEmily = new Visit
                {
                    Patient = emily, Doctor = drJames,
                    AdmissionDate = now.AddDays(-10),
                    Diagnosis = "Hypertensive crisis with diabetic complications",
                    Treatment = "IV antihypertensives, insulin adjustment, dietary consultation",
                    Status = VisitStatus.Ongoing,
                    CreatedBy = "system", CreatedAt = now
                };

                var visitMichael = new Visit
                {
                    Patient = michael, Doctor = drMaria,
                    AdmissionDate = now.AddDays(-8),
                    Diagnosis = "Acute asthma exacerbation",
                    Treatment = "Nebulised salbutamol, oral prednisolone, monitoring",
                    Status = VisitStatus.Ongoing,
                    CreatedBy = "system", CreatedAt = now
                };

                var visitRobert = new Visit
                {
                    Patient = robert, Doctor = drJames,
                    AdmissionDate = now.AddDays(-14),
                    DischargeDate = now.AddDays(-7),
                    Diagnosis = "Non-ST-elevation myocardial infarction (NSTEMI)",
                    Treatment = "Anticoagulation, dual antiplatelet therapy, cardiology review",
                    Status = VisitStatus.Discharged,
                    CreatedBy = "system", CreatedAt = now
                };

                var visitDavid = new Visit
                {
                    Patient = david, Doctor = drAhmed,
                    AdmissionDate = now.AddDays(-20),
                    DischargeDate = now.AddDays(-15),
                    Diagnosis = "COPD exacerbation with secondary pneumonia",
                    Treatment = "Antibiotics, bronchodilators, oxygen therapy",
                    Status = VisitStatus.Discharged,
                    CreatedBy = "system", CreatedAt = now
                };

                context.Visits.AddRange(visitEmily, visitMichael, visitRobert, visitDavid);

                // ── Prescriptions ─────────────────────────────────────────────────────
                var rxEmily = new Prescription
                {
                    Visit = visitEmily, Patient = emily, Doctor = drJames,
                    IssuedAt = now.AddDays(-10), Status = PrescriptionStatus.Active,
                    Notes = "Monitor BP daily. Follow up in 1 week.",
                    CreatedBy = "system", CreatedAt = now,
                    Medications =
                    [
                        new PrescriptionMedication { Name = "Lisinopril",  Dosage = "10mg",  Frequency = "Once daily",  Duration = "30 days", Instructions = "Take in the morning with water" },
                        new PrescriptionMedication { Name = "Metformin",   Dosage = "500mg", Frequency = "Twice daily", Duration = "30 days", Instructions = "Take with meals" },
                        new PrescriptionMedication { Name = "Amlodipine",  Dosage = "5mg",   Frequency = "Once daily",  Duration = "30 days", Instructions = "Take at the same time each day" }
                    ]
                };

                var rxMichael = new Prescription
                {
                    Visit = visitMichael, Patient = michael, Doctor = drMaria,
                    IssuedAt = now.AddDays(-8), Status = PrescriptionStatus.Active,
                    CreatedBy = "system", CreatedAt = now,
                    Medications =
                    [
                        new PrescriptionMedication { Name = "Salbutamol",    Dosage = "100mcg", Frequency = "As needed",   Duration = "60 days", Instructions = "Use inhaler when breathless" },
                        new PrescriptionMedication { Name = "Prednisolone",  Dosage = "30mg",   Frequency = "Once daily",  Duration = "5 days",  Instructions = "Take in the morning with food" }
                    ]
                };

                var rxRobert = new Prescription
                {
                    Visit = visitRobert, Patient = robert, Doctor = drJames,
                    IssuedAt = now.AddDays(-14), Status = PrescriptionStatus.Active,
                    Notes = "Review in 4 weeks. Avoid NSAIDs.",
                    CreatedBy = "system", CreatedAt = now,
                    Medications =
                    [
                        new PrescriptionMedication { Name = "Aspirin",       Dosage = "81mg",  Frequency = "Once daily",          Duration = "Indefinite",  Instructions = "Take with food" },
                        new PrescriptionMedication { Name = "Atorvastatin",  Dosage = "40mg",  Frequency = "Once daily at night", Duration = "Indefinite",  Instructions = "Take at bedtime" },
                        new PrescriptionMedication { Name = "Ticagrelor",    Dosage = "90mg",  Frequency = "Twice daily",         Duration = "12 months",   Instructions = "Do not crush" }
                    ]
                };

                var rxDavid = new Prescription
                {
                    Visit = visitDavid, Patient = david, Doctor = drAhmed,
                    IssuedAt = now.AddDays(-20), Status = PrescriptionStatus.Completed,
                    CreatedBy = "system", CreatedAt = now,
                    Medications =
                    [
                        new PrescriptionMedication { Name = "Amoxicillin",  Dosage = "500mg",  Frequency = "Three times daily", Duration = "7 days",  Instructions = "Complete the full course" },
                        new PrescriptionMedication { Name = "Tiotropium",   Dosage = "18mcg",  Frequency = "Once daily",        Duration = "30 days", Instructions = "Inhale capsule contents only" }
                    ]
                };

                context.Prescriptions.AddRange(rxEmily, rxMichael, rxRobert, rxDavid);

                // ── Lab Results ───────────────────────────────────────────────────────
                var nurseUser = await userManager.FindByEmailAsync("nurse@hms.com");
                var orderedBy = nurseUser ?? (await userManager.FindByEmailAsync("doctor@hms.com"))!;

                context.LabResults.AddRange(
                    new LabResult { Patient = emily,   Visit = visitEmily,   OrderedById = drJames.UserId, TestName = "HbA1c",            TestedAt = now.AddDays(-9),  Result = "7.2%",             NormalRange = "<5.7%",          Status = LabResultStatus.Abnormal, Notes = "Diabetes management required",          CreatedBy = "system", CreatedAt = now },
                    new LabResult { Patient = emily,   Visit = visitEmily,   OrderedById = drJames.UserId, TestName = "Blood Pressure",   TestedAt = now.AddDays(-9),  Result = "158/96 mmHg",      NormalRange = "<120/80 mmHg",   Status = LabResultStatus.Abnormal, Notes = "Elevated — continue antihypertensives", CreatedBy = "system", CreatedAt = now },
                    new LabResult { Patient = emily,   Visit = visitEmily,   OrderedById = drJames.UserId, TestName = "Serum Creatinine", TestedAt = now.AddDays(-9),  Result = "1.1 mg/dL",        NormalRange = "0.6–1.2 mg/dL",  Status = LabResultStatus.Normal,                                                    CreatedBy = "system", CreatedAt = now },

                    new LabResult { Patient = michael, Visit = visitMichael, OrderedById = drMaria.UserId, TestName = "Spirometry FEV1", TestedAt = now.AddDays(-7),  Result = "72%",              NormalRange = ">80%",           Status = LabResultStatus.Abnormal, Notes = "Moderate airflow limitation",           CreatedBy = "system", CreatedAt = now },
                    new LabResult { Patient = michael, Visit = visitMichael, OrderedById = drMaria.UserId, TestName = "Blood O2 Sat",    TestedAt = now.AddDays(-7),  Result = "94%",              NormalRange = "95–100%",        Status = LabResultStatus.Abnormal, Notes = "Supplemental O2 may be needed",         CreatedBy = "system", CreatedAt = now },

                    new LabResult { Patient = robert,  Visit = visitRobert,  OrderedById = drJames.UserId, TestName = "Troponin I",       TestedAt = now.AddDays(-13), Result = "0.62 ng/mL",       NormalRange = "<0.04 ng/mL",    Status = LabResultStatus.Critical, Notes = "Confirms NSTEMI",                       CreatedBy = "system", CreatedAt = now },
                    new LabResult { Patient = robert,  Visit = visitRobert,  OrderedById = drJames.UserId, TestName = "LDL Cholesterol",  TestedAt = now.AddDays(-13), Result = "4.1 mmol/L",       NormalRange = "<2.6 mmol/L",    Status = LabResultStatus.Abnormal, Notes = "Start high-intensity statin",           CreatedBy = "system", CreatedAt = now },

                    new LabResult { Patient = david,   Visit = visitDavid,   OrderedById = drAhmed.UserId, TestName = "Chest X-Ray",      TestedAt = now.AddDays(-19), Result = "Infiltrate RLL",   NormalRange = "Clear",          Status = LabResultStatus.Abnormal, Notes = "Right lower lobe consolidation",        CreatedBy = "system", CreatedAt = now },
                    new LabResult { Patient = david,   Visit = visitDavid,   OrderedById = drAhmed.UserId, TestName = "CRP",              TestedAt = now.AddDays(-19), Result = "84 mg/L",          NormalRange = "<10 mg/L",       Status = LabResultStatus.Abnormal, Notes = "Elevated inflammatory markers",         CreatedBy = "system", CreatedAt = now }
                );

                // ── Discharge Summaries ───────────────────────────────────────────────
                context.DischargeSummaries.AddRange(
                    new DischargeSummary
                    {
                        Visit = visitRobert, Patient = robert, Doctor = drJames,
                        FollowUpInstructions = "Attend cardiac rehab. Low-sodium diet. Daily BP monitoring. Return immediately if chest pain recurs.",
                        FollowUpDate = DateOnly.FromDateTime(now.AddDays(7)),
                        CreatedBy = "system", CreatedAt = now
                    },
                    new DischargeSummary
                    {
                        Visit = visitDavid, Patient = david, Doctor = drAhmed,
                        FollowUpInstructions = "Complete antibiotic course. Use bronchodilator inhaler daily. Stop smoking immediately. GP review in 2 weeks.",
                        FollowUpDate = DateOnly.FromDateTime(now.AddDays(2)),
                        CreatedBy = "system", CreatedAt = now
                    }
                );

                // ── Messages ──────────────────────────────────────────────────────────
                context.Messages.AddRange(
                    new Message { SenderId = emily.UserId,   ReceiverId = drJames.UserId,  Content = "Doctor, I have been experiencing chest discomfort lately. Should I come in?", SentAt = now.AddDays(-3), IsRead = true },
                    new Message { SenderId = drJames.UserId, ReceiverId = emily.UserId,    Content = "Yes Emily, please schedule an appointment as soon as possible. Run some tests.", SentAt = now.AddDays(-3).AddHours(1), IsRead = true },
                    new Message { SenderId = emily.UserId,   ReceiverId = drJames.UserId,  Content = "Thank you doctor. I have scheduled for next week.", SentAt = now.AddDays(-3).AddHours(2), IsRead = false },
                    new Message { SenderId = michael.UserId, ReceiverId = drMaria.UserId,  Content = "Dr. Santos, my headaches have been more frequent this week.", SentAt = now.AddDays(-1), IsRead = false },
                    new Message { SenderId = drMaria.UserId, ReceiverId = michael.UserId,  Content = "Michael, please come in for a review. I'll order an MRI.", SentAt = now.AddDays(-1).AddHours(2), IsRead = true }
                );

                // ── Notifications ─────────────────────────────────────────────────────
                context.Notifications.AddRange(
                    new Notification { UserId = emily.UserId,   Title = "Appointment Reminder",    Content = "You have an appointment with Dr. James Anderson in 7 days.",    Type = NotificationType.AppointmentReminder, IsRead = false, CreatedAt = now },
                    new Notification { UserId = emily.UserId,   Title = "New Message",             Content = "Dr. James Anderson replied to your message.",                   Type = NotificationType.NewMessage,          IsRead = true,  CreatedAt = now.AddDays(-3).AddHours(1) },
                    new Notification { UserId = michael.UserId, Title = "Appointment Reminder",    Content = "You have an appointment with Dr. Maria Santos in 3 days.",      Type = NotificationType.AppointmentReminder, IsRead = false, CreatedAt = now },
                    new Notification { UserId = robert.UserId,  Title = "Discharge Summary Ready", Content = "Your discharge summary is now available for download.",          Type = NotificationType.DischargeSummaryReady, IsRead = false, CreatedAt = now.AddDays(-7) },
                    new Notification { UserId = robert.UserId,  Title = "Prescription Issued",     Content = "Dr. James Anderson issued a new prescription for your visit.",   Type = NotificationType.PrescriptionIssued,  IsRead = true,  CreatedAt = now.AddDays(-14) },
                    new Notification { UserId = drJames.UserId, Title = "New Message",             Content = "Emily Johnson sent you a message.",                             Type = NotificationType.NewMessage,          IsRead = false, CreatedAt = now.AddDays(-3).AddHours(2) },
                    new Notification { UserId = drMaria.UserId, Title = "New Message",             Content = "Michael Chen sent you a message.",                              Type = NotificationType.NewMessage,          IsRead = false, CreatedAt = now.AddDays(-1) }
                );

                await context.SaveChangesAsync();
                logger.LogInformation("Clinical data seeded.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error seeding clinical data.");
                throw;
            }
        }
    }
}
