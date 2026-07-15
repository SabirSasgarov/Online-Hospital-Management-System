namespace HMS.Persistence.Configurations
{
    public class VisitConfiguration : IEntityTypeConfiguration<Visit>
    {
        public void Configure(EntityTypeBuilder<Visit> builder)
        {
            builder.HasKey(v => v.Id);

            builder.HasOne(v => v.Patient)
                   .WithMany(p => p.Visits)
                   .HasForeignKey(v => v.PatientId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(v => v.Doctor)
                   .WithMany(d => d.Visits)
                   .HasForeignKey(v => v.DoctorId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Nullable — outpatient visits have no bed
            builder.HasOne(v => v.Bed)
                   .WithMany()
                   .HasForeignKey(v => v.BedId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.SetNull);

            builder.Property(v => v.Diagnosis).IsRequired().HasMaxLength(500);
            builder.Property(v => v.Treatment).HasMaxLength(1000);

            builder.Property(v => v.Status)
                   .HasConversion<string>()
                   .HasMaxLength(20);

            // Useful for listing a patient's visit history chronologically
            builder.HasIndex(v => new { v.PatientId, v.AdmissionDate });

            builder.HasQueryFilter(v => !v.IsDeleted);
        }
    }
}
