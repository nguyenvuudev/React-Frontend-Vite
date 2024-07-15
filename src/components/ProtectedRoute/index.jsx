import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import NotAuthorized403 from "../NotAuthorized403"

const RoleBaseRoute = (prop) => {
  const isAdminRoute = window.location.pathname.startsWith('/admin')
  const user = useSelector(state => state.account.user)
  const userRole = user.role
  
  if (isAdminRoute && userRole === 'ADMIN') {
    return (<> {props.children}</>)
  } else {
    return (<NotAuthorized403 />)
  }
}


const ProtectedRoute = (props) => {
  const isAuthenticated = useSelector(state => state.account.isAuthenticated)
  return (
    <>
      {isAuthenticated === true ?
        <RoleBaseRoute>
          <> {props.children}</>
        </RoleBaseRoute>
        :
        <Navigate to='/login' replace />
      }
    </>
  )
}

export default ProtectedRoute