import React from 'react'

const AuthLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <main className='flex justify-center items-center min-h-screen flex-col'>
        {children}
    </main>
  )
}

export default AuthLayout