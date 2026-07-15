namespace HMS.Persistence.Configurations
{
    public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.HasKey(a => a.Id);

            builder.HasOne(a => a.Patient)
                   .WithMany(p => p.Appointments)
                   .HasForeignKey(a => a.PatientId)
                   .OnDelete(DeleteBehavior.Restrict); // keep appointments even if patient is soft-deleted

            builder.HasOne(a => a.Doctor)
                   .WithMany(d => d.Appointments)
                   .HasForeignKey(a => a.DoctorId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Property(a => a.Type)
                   .HasConversion<string>()
                   .HasMaxLength(20);

            builder.Property(a => a.Status)
                   .HasConversion<string>()
                   .HasMaxLength(20);

            builder.Property(a => a.Notes).HasMaxLength(1000);

            // conflict-detection queries
            builder.HasIndex(a => new { a.DoctorId, a.ScheduledAt });

            builder.HasQueryFilter(a => !a.IsDeleted);
        }
    }
}
