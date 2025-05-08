using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
        }

        public async Task<bool> AddUpdateExperience(ExperienceViewModel newExperience, string userId)
        {
            try
            {
                if (userId != null)
                {
                    User existingTalent = (await _userRepository.GetByIdAsync(userId));

                    existingTalent.UpdatedBy = userId;
                    existingTalent.UpdatedOn = DateTime.Now;

                    bool isNewExperience = true;
                    var newExperiences = new List<UserExperience>();
                    foreach (var item in existingTalent.Experience)
                    {
                        if (item.Id == newExperience.Id)
                        {
                            UpdateExperienceFromView(newExperience, item);
                            isNewExperience = false;
                        }
                        newExperiences.Add(item);
                    }

                    if (isNewExperience)
                    {
                        var experience = new UserExperience
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                        };
                        UpdateExperienceFromView(newExperience, experience);
                        newExperiences.Add(experience);
                    }

                    existingTalent.Experience = newExperiences;
                    await _userRepository.Update(existingTalent);
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }

        }

        public async Task<bool> DeleteExperience(ExperienceViewModel experience, string userId)
        {
            try
            {
                if (userId != null)
                {
                    User existingTalent = (await _userRepository.GetByIdAsync(userId));

                    existingTalent.UpdatedBy = userId;
                    existingTalent.UpdatedOn = DateTime.Now;

                    bool experienceFound = false;
                    var newExperiences = new List<UserExperience>();
                    foreach (var item in existingTalent.Experience)
                    {
                        if (item.Id == experience.Id)
                        {
                            experienceFound = true;
                        }
                        else
                        {
                            newExperiences.Add(item);
                        }

                    }
                    if (experienceFound)
                    {
                        existingTalent.Experience = newExperiences;
                        await _userRepository.Update(existingTalent);
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> AddUpdateLanguage(AddLanguageViewModel newLanguage, string userId)
        {
            try
            {
                if (userId != null)
                {
                    User existingTalent = (await _userRepository.GetByIdAsync(userId));

                    existingTalent.UpdatedBy = userId;
                    existingTalent.UpdatedOn = DateTime.Now;

                    bool isNewLanguage = true;
                    var newLanguages = new List<UserLanguage>();
                    foreach (var item in existingTalent.Languages)
                    {
                        if (item.Id == newLanguage.Id)
                        {
                            UpdateLanguageFromView(newLanguage, item);
                            isNewLanguage = false;
                        }
                        newLanguages.Add(item);
                    }

                    if (isNewLanguage)
                    {
                        var language = new UserLanguage
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            IsDeleted = false,
                            UserId = existingTalent.Id
                        };
                        UpdateLanguageFromView(newLanguage, language);
                        newLanguages.Add(language);
                    }

                    existingTalent.Languages = newLanguages;
                    await _userRepository.Update(existingTalent);
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> DeleteLanguage(AddLanguageViewModel language, string userId)
        {
            try
            {
                if (userId != null)
                {
                    User existingTalent = (await _userRepository.GetByIdAsync(userId));

                    existingTalent.UpdatedBy = userId;
                    existingTalent.UpdatedOn = DateTime.Now;

                    bool languageFound = false;
                    var newLanguages = new List<UserLanguage>();
                    foreach (var item in existingTalent.Languages)
                    {
                        if (item.Id == language.Id)
                        {
                            item.IsDeleted = true;
                            languageFound = true;
                        }
                        newLanguages.Add(item);
                    }
                    if (languageFound)
                    {
                        existingTalent.Languages = newLanguages;
                        await _userRepository.Update(existingTalent);
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> AddUpdateSkill(AddSkillViewModel newSkill, string userId)
        {
            try
            {
                if (userId != null)
                {
                    User existingTalent = (await _userRepository.GetByIdAsync(userId));

                    existingTalent.UpdatedBy = userId;
                    existingTalent.UpdatedOn = DateTime.Now;

                    bool isNewSkill = true;
                    var newSkills = new List<UserSkill>();
                    foreach (var item in existingTalent.Skills)
                    {
                        if (item.Id == newSkill.Id)
                        {
                            UpdateSkillFromView(newSkill, item);
                            isNewSkill = false;
                        }
                        newSkills.Add(item);
                    }

                    if (isNewSkill)
                    {
                        var skill = new UserSkill
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            IsDeleted = false,
                            UserId = existingTalent.Id
                        };
                        UpdateSkillFromView(newSkill, skill);
                        newSkills.Add(skill);
                    }

                    existingTalent.Skills = newSkills;
                    await _userRepository.Update(existingTalent);
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> DeleteSkill(AddSkillViewModel skill, string userId)
        {
            try
            {
                if (userId != null)
                {
                    User existingTalent = (await _userRepository.GetByIdAsync(userId));

                    existingTalent.UpdatedBy = userId;
                    existingTalent.UpdatedOn = DateTime.Now;

                    bool skillFound = false;
                    var newSkills = new List<UserSkill>();
                    foreach (var item in existingTalent.Skills)
                    {
                        if (item.Id == skill.Id)
                        {
                            item.IsDeleted = true;
                            skillFound = true;
                        }
                        newSkills.Add(item);
                    }
                    if (skillFound)
                    {
                        existingTalent.Skills = newSkills;
                        await _userRepository.Update(existingTalent);
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            try
            {
                User profile = null;
                profile = (await _userRepository.GetByIdAsync(Id));

                if (profile != null)
                {
                    var languages = profile.Languages.FindAll(x => !x.IsDeleted).Select(x => ViewModelFromLanguage(x)).ToList();
                    var skills = profile.Skills.FindAll(x => !x.IsDeleted).Select(x => ViewModelFromSkill(x)).ToList();
                    var experience = profile.Experience.Select(x => ViewModelFromExperience(x)).ToList();

                    var result = new TalentProfileViewModel
                    {
                        Id = profile.Id,
                        FirstName = profile.FirstName,
                        LastName = profile.LastName,
                        Email = profile.Email,
                        Phone = profile.Phone,
                        Address = profile.Address,
                        Nationality = profile.Nationality,
                        VisaStatus = profile.VisaStatus,
                        VisaExpiryDate = profile.VisaExpiryDate,
                        ProfilePhoto = profile.ProfilePhoto,
                        ProfilePhotoUrl = profile.ProfilePhotoUrl,
                        Summary = profile.Summary,
                        Description = profile.Description,
                        LinkedAccounts = profile.LinkedAccounts,
                        JobSeekingStatus = profile.JobSeekingStatus,
                        Languages = languages,
                        Skills = skills,
                        Experience = experience,
                    };
                    return result;
                }
                return null;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel talentUser, string updaterId)
        {
            try
            {
                if (talentUser.Id != null)
                {
                    User existingTalent = (await _userRepository.GetByIdAsync(talentUser.Id));
                    existingTalent.FirstName = talentUser.FirstName;
                    existingTalent.LastName = talentUser.LastName;
                    existingTalent.Email = talentUser.Email;
                    existingTalent.Phone = talentUser.Phone;
                    existingTalent.Address = talentUser.Address;
                    existingTalent.Nationality = talentUser.Nationality;
                    existingTalent.VisaStatus = talentUser.VisaStatus;
                    existingTalent.VisaExpiryDate = talentUser.VisaExpiryDate;
                    existingTalent.ProfilePhoto = talentUser.ProfilePhoto;
                    existingTalent.ProfilePhotoUrl = talentUser.ProfilePhotoUrl;
                    existingTalent.Summary = talentUser.Summary;
                    existingTalent.Description = talentUser.Description;
                    existingTalent.LinkedAccounts = talentUser.LinkedAccounts;
                    existingTalent.JobSeekingStatus = talentUser.JobSeekingStatus;

                    existingTalent.UpdatedBy = updaterId;
                    existingTalent.UpdatedOn = DateTime.Now;

                    var newSkills = new List<UserSkill>();
                    foreach (var item in talentUser.Skills)
                    {
                        var skill = existingTalent.Skills.SingleOrDefault(x => x.Id == item.Id);
                        if (skill == null)
                        {
                            skill = new UserSkill
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false,
                                UserId = existingTalent.Id
                            };
                        }
                        UpdateSkillFromView(item, skill);
                        newSkills.Add(skill);
                    }
                    existingTalent.Skills = newSkills;
                    // TODO add logic to update languages and experience similar to skills
                    await _userRepository.Update(existingTalent);
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetPresignedFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _userRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        protected void UpdateLanguageFromView(AddLanguageViewModel model, UserLanguage original)
        {
            original.LanguageLevel = model.Level;
            original.Language = model.Name;
        }

        protected void UpdateExperienceFromView(ExperienceViewModel model, UserExperience original)
        {
            original.Company = model.Company;
            original.Position = model.Position;
            original.Responsibilities = model.Responsibilities;
            original.Start = model.Start;
            original.End = model.End;
        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        protected AddLanguageViewModel ViewModelFromLanguage(UserLanguage language)
        {
            return new AddLanguageViewModel
            {
                Id = language.Id,
                Name = language.Language,
                Level = language.LanguageLevel,
                CurrentUserId = language.UserId,
            };
        }

        protected ExperienceViewModel ViewModelFromExperience(UserExperience experience)
        {
            return new ExperienceViewModel
            {
                Id = experience.Id,
                Company = experience.Company,
                Position = experience.Position,
                Responsibilities = experience.Responsibilities,
                Start = experience.Start,
                End = experience.End,
            };
        }
        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
