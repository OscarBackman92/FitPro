"use strict";(self.webpackChunkfitpro=self.webpackChunkfitpro||[]).push([[118],{4118:(e,s,r)=>{r.r(s),r.d(s,{default:()=>i});var a=r(5043),t=r(3216),n=r(5475),o=r(8816),l=r(3768),d=r(579);const i=()=>{var e;const[s,r]=(0,a.useState)({username:"",email:"",password1:"",password2:""}),[i,c]=(0,a.useState)({}),[m,u]=(0,a.useState)(!1),p=(0,t.Zp)(),h=e=>{const{name:s,value:a}=e.target;r((e=>({...e,[s]:a})))};return(0,d.jsx)("div",{className:"flex flex-col items-center justify-center min-h-screen bg-gray-100",children:(0,d.jsxs)("div",{className:"max-w-md w-full bg-white p-8 rounded-lg shadow-lg",children:[(0,d.jsx)("h2",{className:"text-2xl font-bold text-center text-green-600 mb-6",children:"Create Account"}),(0,d.jsxs)("form",{onSubmit:async e=>{if(e.preventDefault(),u(!0),c({}),s.password1!==s.password2)return c({password2:"Passwords must match"}),void u(!1);if(s.password1.length<8)return c({password1:"Password must be at least 8 characters long."}),void u(!1);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email))return c({email:"Please enter a valid email address."}),void u(!1);try{await(0,o.kz)(s),l.Ay.success("Registration successful! Please check your email to verify your account."),p("/signin")}catch(a){var r;console.error("Registration error response:",a.response);const e=(null===(r=a.response)||void 0===r?void 0:r.data)||{non_field_errors:["Registration failed. Please try again."]};c(e),l.Ay.error(e.non_field_errors?e.non_field_errors.join(", "):"Registration failed")}finally{u(!1)}},className:"space-y-6",children:[[{name:"username",label:"Username",type:"text",placeholder:"Choose a username"},{name:"email",label:"Email",type:"email",placeholder:"Enter your email"},{name:"password1",label:"Password",type:"password",placeholder:"Choose a password"},{name:"password2",label:"Confirm Password",type:"password",placeholder:"Confirm your password"}].map((e=>(0,d.jsxs)("div",{children:[(0,d.jsx)("label",{htmlFor:e.name,className:"block text-sm font-medium text-gray-700",children:e.label}),(0,d.jsx)("input",{type:e.type,name:e.name,id:e.name,value:s[e.name],onChange:h,placeholder:e.placeholder,className:`mt-1 block w-full rounded-md shadow-sm\n                  ${i[e.name]?"border-red-500":"border-gray-300"}\n                  focus:ring-green-500 focus:border-green-500\n                `}),i[e.name]&&(0,d.jsx)("p",{className:"mt-1 text-sm text-red-500",children:i[e.name]})]},e.name))),null===(e=i.non_field_errors)||void 0===e?void 0:e.map(((e,s)=>(0,d.jsx)("div",{className:"text-sm text-red-500 text-center",children:e},s))),(0,d.jsx)("button",{type:"submit",disabled:m,className:`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white\n              ${m?"bg-gray-400 cursor-not-allowed":"bg-green-600 hover:bg-green-700"}\n              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500\n            `,children:m?"Creating Account...":"Create Account"}),(0,d.jsx)("div",{className:"text-center mt-4",children:(0,d.jsx)(n.N_,{to:"/signin",className:"text-sm text-green-600 hover:text-green-500",children:"Already have an account? Sign in"})})]})]})})}}}]);
//# sourceMappingURL=118.3ea8a8c5.chunk.js.map