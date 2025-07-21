using System.Collections.Generic;
using Talent.Common.Models;

namespace Talent.Services.Profile.Models
{
    public class TalentToSnapshot
    {

            public string Id { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string ProfilePhotoUrl { get; set; }
            public string VideoName { get; set; }
            public string CvName { get; set; }
            public string Summary { get; set; }
            public string VisaStatus { get; set; }
            public List<UserSkill> Skills { get; set; }
            public List<UserExperience> Experience { get; set; }
            public LinkedAccounts LinkedAccounts { get; set; }
        
    }
}
