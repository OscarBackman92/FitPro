"use strict";(self.webpackChunkfitpro=self.webpackChunkfitpro||[]).push([[940],{6940:(e,s,r)=>{r.r(s),r.d(s,{default:()=>m});var n=r(5043),t=r(3216),a=r(5475),o=r(7464),l=r(8816),d=r(3768),i=r(579);const m=()=>{var e,s,r;const{setCurrentUser:m}=(0,o.i)(),[c,u]=(0,n.useState)({username:"",password:""}),[g,x]=(0,n.useState)({}),[p,f]=(0,n.useState)(!1),h=(0,t.Zp)(),b=e=>{const{name:s,value:r}=e.target;u((e=>({...e,[s]:r})))};return(0,i.jsx)("div",{className:"flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4",children:(0,i.jsxs)("div",{className:"max-w-md w-full bg-white p-8 rounded-lg shadow-lg",children:[(0,i.jsx)("h2",{className:"text-2xl font-bold text-center text-gray-900 mb-8",children:"Sign In"}),(0,i.jsxs)("form",{onSubmit:async e=>{e.preventDefault(),f(!0),x({});try{console.log("Attempting login with:",{username:c.username});const e=await l.y1.login(c);if(console.log("Login response:",e),!e.user||!e.token)throw new Error("Invalid response format");m(e.user),localStorage.setItem("token",e.token),d.Ay.success("Welcome back!"),h("/dashboard")}catch(r){var s;console.error("Login error:",r),d.Ay.error(r.message||"Failed to sign in"),x((null===(s=r.response)||void 0===s?void 0:s.data)||{non_field_errors:["Invalid username or password"]})}finally{f(!1)}},className:"space-y-6",children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("label",{htmlFor:"username",className:"block text-sm font-medium text-gray-700",children:"Username"}),(0,i.jsx)("input",{id:"username",type:"text",name:"username",value:c.username,onChange:b,className:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 "+(g.username?"border-red-500":""),required:!0}),null===(e=g.username)||void 0===e?void 0:e.map(((e,s)=>(0,i.jsx)("p",{className:"mt-1 text-sm text-red-600",children:e},s)))]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("label",{htmlFor:"password",className:"block text-sm font-medium text-gray-700",children:"Password"}),(0,i.jsx)("input",{id:"password",type:"password",name:"password",value:c.password,onChange:b,className:"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 "+(g.password?"border-red-500":""),required:!0}),null===(s=g.password)||void 0===s?void 0:s.map(((e,s)=>(0,i.jsx)("p",{className:"mt-1 text-sm text-red-600",children:e},s)))]}),null===(r=g.non_field_errors)||void 0===r?void 0:r.map(((e,s)=>(0,i.jsx)("p",{className:"text-sm text-red-600 text-center",children:e},s))),(0,i.jsx)("button",{type:"submit",disabled:p,className:`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${p?"bg-gray-400":"bg-green-600 hover:bg-green-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`,children:p?"Signing in...":"Sign In"}),(0,i.jsx)("div",{className:"text-sm text-center mt-4",children:(0,i.jsx)(a.N_,{to:"/signup",className:"font-medium text-green-600 hover:text-green-500",children:"Don't have an account? Sign up"})})]})]})})}}}]);
//# sourceMappingURL=940.7a218f70.chunk.js.map