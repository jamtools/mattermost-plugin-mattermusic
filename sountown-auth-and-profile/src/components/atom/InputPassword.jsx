import { Field, ErrorMessage } from 'formik';
import { EyeOpen, EyeClose } from "@/components/icons/IconEyes"
import { useState } from "react"

const InputPassword = ({ name, placeholder, error, touched }) => {
  const [ isOpenPassword, setIsOpenPassword ] = useState(false)
  return (
    <>
      <div className="relative">
        <Field
          id={name}
          type={isOpenPassword ? 'text' : 'password'}
          name={name}
          placeholder={placeholder}
          className={`
            border border-gray rounded-lg px-5 py-4 focus:outline w-full bg-black 
            ${!error && touched && 'border-primary'}
            ${error && touched && 'border-danger'}
          `}
        />
        <div onClick={() => setIsOpenPassword(val => !val)} className="absolute top-1/2 -translate-y-1/2 right-5 cursor-pointer">
          {isOpenPassword ? <EyeOpen/> : <EyeClose/> }
        </div>
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-xs md:text-sm text-danger mt-2 h-5"
      />
    </>
  )
}

export default InputPassword