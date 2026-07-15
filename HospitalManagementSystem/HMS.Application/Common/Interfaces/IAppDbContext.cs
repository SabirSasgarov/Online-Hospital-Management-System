namespace HMS.Application.Common.Interfaces
{
    public interface IAppDbContext
    {
        DbSet<Patient> Patients { get; }
        DbSet<Doctor> Doctors { get; }
        DbSet<Appointment> Appointments { get; }
        DbSet<Ward> Wards { get; }
        DbSet<Room> Rooms { get; }
        DbSet<Bed> Beds { get; }
        DbSet<Visit> Visits { get; }
        DbSet<Prescription> Prescriptions { get; }
        DbSet<PrescriptionMedication> PrescriptionMedications { get; }
        DbSet<LabResult> LabResults { get; }
        DbSet<DischargeSummary> DischargeSummaries { get; }
        DbSet<Message> Messages { get; }
        DbSet<Notification> Notifications { get; }
        DbSet<AuditLog> AuditLogs { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
