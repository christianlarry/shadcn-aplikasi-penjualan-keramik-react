import { createBrowserRouter, Navigate, RouterProvider } from "react-router"
import MainLayout from "../components/layouts/main-layout"

// Import Page
import HomePage from "../components/pages/home/home-page"
import AllProductsPage from "../components/pages/catalog/all-product-page"
import BestSellerPage from "../components/pages/catalog/best-seller-page"
import NewArrivalsPage from "../components/pages/catalog/new-arrivals-page"
import DiscountPage from "../components/pages/catalog/discount-page"
import TileCalculatorPage from "../components/pages/tile-calculator/tile-calculator-page"
import ErrorPage from "@/components/pages/errors/error-page"

const AppRouter = ()=>{

  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage/>,
      children: [
        {
          element: <MainLayout/>,
          children: [
            { index: true, element: <HomePage/> },
            { path: "catalog", element: <Navigate to={"/catalog/all-products"} replace/> },
            { path: "catalog/all-products", element: <AllProductsPage/> },
            { path: "catalog/best-seller", element: <BestSellerPage/> },
            { path: "catalog/new-arrivals", element: <NewArrivalsPage/> },
            { path: "catalog/discount", element: <DiscountPage/> },
          ]
        },
        { path: "tile-calculator", element: <TileCalculatorPage/> }
      ]
    }
  ])

  return (
    <RouterProvider router={router}/>
  )
}

export default AppRouter