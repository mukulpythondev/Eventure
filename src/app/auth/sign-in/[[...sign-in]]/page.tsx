// [[...signUp]]/page.jsx
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <div className="flex items-center justify-center h-[90vh] bg-slate-950 text-gray-100">
    <div className="">
      <SignIn
        appearance={{
          elements: {
    
            formButtonPrimary: "bg-cyan-600 text-white hover:bg-cyan-700 transition-colors duration-200",
          },
        }}
      />
    </div>
  </div>
);

export default SignInPage;
