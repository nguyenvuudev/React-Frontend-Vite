import React, { useEffect, useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import LoginPage from './pages/login'
import ContactPage from './pages/contact'
import BookPage from './pages/book'
import { Outlet } from "react-router-dom"
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './components/Home'
import RegisterPage from './pages/register'
import { callFetchAccount } from './services/api'
import { useDispatch, useSelector } from 'react-redux'
import { doGetAccountAction } from './redux/account/accountSlice'
import LoadingPage from './components/Loading'
import NotFound404 from './components/NotFound404'
import AdminPage from './pages/admin'
import ProtectedRoute from './components/ProtectedRoute'
import LayoutAdmin from './components/Admin/LayoutAdmin'
import './styles/reset.scss'
import ManageUserPage from './pages/admin/user'


const Layout = () => {
  return (
    <div className="layout-app">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch()
  const isLoading = useSelector(state => state.account.isLoading)

  const getAccount = async () => {
    if (window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
     return // Ko gọi API 
    const res = await callFetchAccount()
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data))
    }
  }

  useEffect(() => {
    getAccount()
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound404 />,

      children: [
        {
          index: true,
          element: <HomePage />
        },

        {
          path: "user",
          element: <ContactPage />,
        },

        {
          path: "book",
          element: <BookPage />,
        },
      ],
    },

    {
      path: "/admin",
      element: < LayoutAdmin/>,
      errorElement: <NotFound404 />,

      children: [
        {
          index: true,
          element:
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
        },
        {
          path: "user",
          element:
            <ProtectedRoute>
              <ManageUserPage />
            </ProtectedRoute>
        },

        {
          path: "contact",
          element: <ContactPage />,
        },

        {
          path: "book",
          element: <BookPage />,
        },
      ],
    },

    {
      path: "/login",
      element: <LoginPage />,
    },

    {
      path: "/register",
      element: <RegisterPage />,
    },
  ])


  return (
    <>
      {isLoading === false
        || window.location.pathname === '/login'
        || window.location.pathname === '/register'
        || window.location.pathname === '/'
        ?
        <RouterProvider router={router} />
        :
        <LoadingPage />
      }
    </>
  )
}
