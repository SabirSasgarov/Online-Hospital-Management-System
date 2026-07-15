namespace HMS.Persistence.Configurations
{
    public class DoctorScheduleConfiguration : IEntityTypeConfiguration<DoctorSchedule>
    {
        public void Configure(EntityTypeBuilder<DoctorSchedule> builder)
        {
            builder.HasKey(s => s.Id);

            builder.HasOne(s => s.Doctor)
                   .WithMany(d => d.Schedules)
                   .HasForeignKey(s => s.DoctorId)
                   .OnDelete(DeleteBehavior.Cascade); // removing a doctor removes their schedule

            // Store DayOfWeek as a readable string ("Monday", "Tuesday", ...)
            builder.Property(s => s.Day)
                   .HasConversion<string>()
                   .HasMaxLength(10);

            // TimeOnly maps to PostgreSQL "time without time zone"
            builder.Property(s => s.StartTime).HasColumnType("time without time zone");
            builder.Property(s => s.EndTime).HasColumnType("time without time zone");

            // A doctor shouldn't have two entries for the same day
            builder.HasIndex(s => new { s.DoctorId, s.Day }).IsUnique();
        }
    }
}
