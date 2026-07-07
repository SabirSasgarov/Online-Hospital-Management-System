namespace HMS.Persistence.Context
{
	public class AppDbContext(DbContextOptions<AppDbContext> options, ICurrentUserService currentUserService)
	: IdentityDbContext<AppUser, AppRole, Guid,
		IdentityUserClaim<Guid>, IdentityUserRole<Guid>, IdentityUserLogin<Guid>,
		IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>(options), IAppDbContext
	{








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
