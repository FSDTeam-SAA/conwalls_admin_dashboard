import React from 'react'
// import LoginContainer from './_components/login-container'
import LoginForm from './_components/login-form'

const LoginPage = () => {
  return (
    <div>
      {/* <LoginContainer/> */}
      <div className="h-screen bg-[linear-gradient(180deg,_#F1FFC5_0%,_#F6FFDA_54.81%,_#FFFFFF_99.04%)]">
            <div className="w-full h-full lg:h-[86%] flex items-center justify-center">
              <LoginForm />
            </div>
          </div>
    </div>
  )
}

export default LoginPage