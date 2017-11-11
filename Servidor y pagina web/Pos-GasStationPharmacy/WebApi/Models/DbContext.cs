using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using WebApi.Models;

namespace WebApi.Models
{
    public class DatabaseContext : DbContext
    {
        private readonly string schema;


        public DatabaseContext(string schema) : base(nameOrConnectionString: "DefaultConnectionString")
        {
            this.schema = schema;
        }
        public virtual DbSet<rol> rol { get; set; }
        public virtual DbSet<empleado> empleado { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema(this.schema);
            base.OnModelCreating(modelBuilder);
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}