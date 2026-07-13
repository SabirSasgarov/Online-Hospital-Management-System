namespace HMS.Persistence.Context
{
	public class AppDbContext(DbContextOptions<AppDbContext> options, ICurrentUserService currentUserService)
	: IdentityDbContext<AppUser, AppRole, Guid,
		IdentityUserClaim<Guid>, IdentityUserRole<Guid>, IdentityUserLogin<Guid>,
		IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>(options), IAppDbContext
	{
		public DbSet<Patient> Patients => Set<Patient>();
		public DbSet<Doctor> Doctors => Set<Doctor>();
		public DbSet<Appointment> Appointments => Set<Appointment>();
		public DbSet<Ward> Wards => Set<Ward>();
		public DbSet<Room> Rooms => Set<Room>();
		public DbSet<Bed> Beds => Set<Bed>();
		public DbSet<Visit> Visits => Set<Visit>();
		public DbSet<Prescription> Prescriptions => Set<Prescription>();
		public DbSet<LabResult> LabResults => Set<LabResult>();
		public DbSet<DischargeSummary> DischargeSummaries => Set<DischargeSummary>();
		public DbSet<Message> Messages => Set<Message>();
		public DbSet<Notification> Notifications => Set<Notification>();
		public DbSet<AuditLog> AuditLogs => Set<AuditLog>();



		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);
			builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
		}
		public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
		{
			var now = DateTime.UtcNow;
			var user = currentUserService.UserName ?? "system";

			foreach (var entry in ChangeTracker.Entries<Domain.Common.AuditableEntity>())
			{
				switch (entry.State)
				{
					case EntityState.Added:
						entry.Entity.CreatedAt = now;
						entry.Entity.CreatedBy = user;
						break;
					case EntityState.Modified:
						entry.Entity.ModifiedAt = now;
						entry.Entity.ModifiedBy = user;
						break;
				}
			}
			return base.SaveChangesAsync(cancellationToken);
		}
	}
}
