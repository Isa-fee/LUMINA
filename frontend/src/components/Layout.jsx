import { Outlet } from "react-router-dom"

import Header from "./Header"
import Footer from "./Footer"

import "../styles/Layout.css"


function Layout() {

    return (
        <div className="app-layout">

            <Header />

            <div className="app-conteudo">
                <Outlet />
            </div>

            <Footer />

        </div>
    )
}


export default Layout