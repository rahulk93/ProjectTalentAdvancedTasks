import * as Yup from 'yup';

export const individualDetailsSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().email('Email is not valid').required('Email required'),
    phone: Yup.string().matches(TalentUtil.phoneRegExp, 'Phone number is not valid'),
});

export const companyDetailsSchema = Yup.object().shape({
    name: Yup.string().required('Name required'),
    email: Yup.string().email('Email is not valid').required('Email required'),
    phone: Yup.string().matches(TalentUtil.phoneRegExp, 'Phone number is not valid'),
});