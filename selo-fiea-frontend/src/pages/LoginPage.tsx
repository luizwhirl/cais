// selo-fiea-frontend/src/pages/LoginPage.tsx

import { Link } from "react-router-dom"; 
import { AuthForm } from "../components/AuthForm";
import { Footer } from "../components/Footer";
import { LoginHeader } from "../components/LoginHeader";

export function LoginPage() {

    return (
        <>
            <LoginHeader />
            <main className="hero-bg flex items-center justify-center min-h-screen py-12 px-4">
                <div className="w-full max-w-md">
                    <AuthForm />
                    
                    <p className="text-center text-gray-600 text-sm mt-6">
                        É um administrador do sistema? 
                        <Link to="/admin-register" className="font-medium text-blue-600 hover:underline">
                            Cadastre-se aqui
                        </Link>
                    </p>
                </div>
            </main>
            <Footer />
        </>
    )
}