// [[...signUp]]/page.jsx
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => (
  <div className=" h-[90vh] flex items-center justify-center bg-slate-950 text-gray-100">
    <div className="">
      <SignUp
        appearance={{
          elements: {
    
            formButtonPrimary: "bg-cyan-600 text-white hover:bg-cyan-700 transition-colors duration-200",
          },
        }}
        path="/auth/sign-up"     // Set sign-up path
        routing="path"
        signInUrl="/events" 
      />
    </div>
  </div>
);

export default SignUpPage;
