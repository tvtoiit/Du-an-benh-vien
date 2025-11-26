import React from "react";
import Header from "../../components/HeaderComponent";
import Footer from "../../components/FooterComponent";

export default function MainLayout({ children }) {
    return (
        <div>
            <Header />

            <main style={{ minHeight: "calc(100vh - 200px)" }}>
                {children}
            </main>

            <Footer />
        </div>
    );
}
