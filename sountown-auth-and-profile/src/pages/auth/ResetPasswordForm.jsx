import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import lock from "@/assets/images/lock.png"

import InputBasic from '@/components/atom/InputBasic';
import AuthLayout from '@/layouts/AuthLayout';

const FormSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required')
});

const ResetPasswordForm = () => {

  const [isSubmitted, setIsSubmitted] = useState({status: false, email: ''})

  const submitForm = (values, { setSubmitting }) => {
    setTimeout(() => {
      setIsSubmitted({
        status: true,
        email: values.email
      })
      setSubmitting(false);
    }, 1000);
  }

  return (
    <AuthLayout title="Reset Password" titleIcon={lock} description="To reset your password, enter the email address you used to sign up">
      <Formik
        initialValues={{ email: ''}}
        validationSchema={FormSchema}
        onSubmit={submitForm}
      >
        {({
          errors,
          touched,
          isSubmitting
        }) => (
          <Form>

          {isSubmitted.status && (
            <div className="space-y-5 mb-10 text-sm">
              <p>If the account exists, a password reset email will be sent to: <span className="text-primary">{isSubmitted.email}</span></p>
              <p>Please check your inbox.</p>
            </div>
          )}

            <div className="mb-5 md:mb-10">
              <label htmlFor="email" className="block font-medium text-base md:text-2xl mb-3 md:mb-5">
                Email Address
              </label>
              <InputBasic
                name="email"
                type="email"
                placeholder="Enter your email address"
                error={errors.email}
                touched={touched.email}
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-primary hover:bg-opacity-90 disabled:hover:bg-opacity-100 transition py-4 px-6 rounded-lg text-white text-center text-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="reset-password"
            >
              Reset My Password 
            </button>
          </Form>
        )}
      </Formik>

      <div className="w-full text-center mt-3 text-sm md:text-base">
        <Link to={"/login"} className="text-primary ml-2 hover:underline">
          Back to Login pages
        </Link>
      </div>
    </AuthLayout>
  )
};


export default ResetPasswordForm