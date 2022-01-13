import { CompanySignup, MemberSignup, Signup } from 'components/sign';
import React from 'react';

const SignupPage = (props) => {
    const { match } = props || {};
    const { params } = match || {};
    return params?.type === 'member' ? (
        <MemberSignup {...props} />
    ) : params?.type === 'company' ? (
        <CompanySignup {...props} type="new" />
    ) : (
        <Signup {...props} type="new" />
    );
};

export default SignupPage;
