using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GNKH2021.Model;

namespace GNKH2021.Data
{
    public class GNKH2021Context : DbContext
    {
        public GNKH2021Context (DbContextOptions<GNKH2021Context> options)
            : base(options)
        {
        }

        public DbSet<GNKH2021.Model.Person> Person { get; set; }
    }
}
