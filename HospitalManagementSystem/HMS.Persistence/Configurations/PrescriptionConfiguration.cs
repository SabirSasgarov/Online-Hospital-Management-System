namespace HMS.Persistence.Configurations
{
    public class PrescriptionConfiguration : IEntityTypeConfiguration<Prescription>
    {
        public void Configure(EntityTypeBuilder<Prescription> builder)
        {
            builder.HasKey(p => p.Id);

            builder.HasOne(p => p.Visit)
                   .WithMany(v => v.Prescriptions)
                   .HasForeignKey(p => p.VisitId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Patient)
                   .WithMany(pt => pt.Prescriptions)
                   .HasForeignKey(p => p.PatientId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Doctor)
                   .WithMany(d => d.Prescriptions)
                   .HasForeignKey(p => p.DoctorId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Property(p => p.Status)
                   .HasConversion<string>()
                   .HasMaxLength(20);

            builder.Property(p => p.Notes).HasMaxLength(1000);

            builder.HasQueryFilter(p => !p.IsDeleted);
        }
    }
}
