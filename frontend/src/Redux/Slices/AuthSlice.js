import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helpers/axiosInstance";
//we storing the isloggedin role and data in the localstorage setitem and get item is used to set or get data from localstorage

console.log(localStorage.getItem('data'))
const initialState={
    isLoggedIn:localStorage.getItem('isLoggedIn')|| false,
    role:localStorage.getItem("role")|| "",
    data:localStorage.getItem("data")== "undefined" ? { }: JSON.parse(localStorage.getItem("data"))
};//this is the initial state of the Auth slice
export const createAccount=createAsyncThunk("/auth/signup",async(data)=>{
    try{
        
        const res = await axiosInstance.post("user/register", data);//this is the route given in backend
        console.log("hi");
        toast.promise(res,{
            loading:"wait! creating your account",
            success:(data)=>{
                return data?.data.message;
            },
            error:"Failed to create account"
        });
        return (await res).data;


    }catch(error){
        toast.error(error?.response?.data?.message);//to send the error as alert message

    }
})
export const login=createAsyncThunk("/auth/login",async(data)=>{
    try{
        const res=axiosInstance.post("user/login",data);//this is the route given in backend
        toast.promise(res,{
            loading:"wait! authentication in progress",
            success:(data)=>{
                return data?.data.message;
            },
            error:"Failed to login check credentials"
        });
        return (await res).data;


    }catch(error){
        toast.error(error?.response?.data?.message);//to send the error as alert message

    }
} )
export const logout=createAsyncThunk("/auth/logout",async()=>{
    try{
        const res=axiosInstance.get("user/logout");//this is the route given in backend
        toast.promise(res,{
            loading:"wait! Logging out",
            success:(data)=>{
                return data?.data.message;
            },
            error:"Failed to logout"
        });
        console.log(res);
        return (await res).data;
    }catch(error){
        toast.error(error?.response?.data?.message);//to send the error as alert message

    }
} )
export const updateProfile=createAsyncThunk("/user/update/profile",async(data)=>{//thunk takes only one parameter
    try{
        const res=axiosInstance.put(`user/update/${data[0]}`,data[1]);//this is the route given in backend
        toast.promise(res,{
            loading:"wait! profile update in progress",
            success:"profile updated",
            error:"Failed to update profile"
        });
        return (await res).data[1];


    }catch(error){
        toast.error(error?.response?.data?.message);//to send the error as alert message

    }
} )
export const getUserData=createAsyncThunk("/user/details",async()=>{
    try{
        const res=axiosInstance.get("user/me");//this is the route given in backend
        
        return (await res).data;


    }catch(error){
        toast.error(error?.message);//to send the error as alert message

    }
    //once userdata becomes new and comes the state has to be updated as it has the user data so addcase in extrareducer
} )
export const changePassword=createAsyncThunk("/user/change",async(data)=>{
    try{
        const res=axiosInstance.post("user/change-password",data);//this is the route given in backend
        toast.promise(res,{
            loading:"wait! changing password",
            success:"password updated",
            error:"Failed to update password"
        });
        return (await res).data;


    }catch(error){
        toast.error(error?.message);//to send the error as alert message

    }
})
//creating the Auth slice
const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder//here for everyone the state will be the same auth state obviously
        .addCase(login.fulfilled,(state,action)=>{
            localStorage.setItem("data",JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn",true);
            localStorage.setItem("role",action?.payload?.user?.role);
            //localstorage is updated so incase the app reloads initial state will be set with these
            //now update the current state as u didnt reload
            state.isLoggedIn=true;
            state.data=action?.payload?.user;
            state.role=action?.payload?.user?.role;
        })
        //once logout has happens everything from localstorage remove and restore state
        .addCase(logout.fulfilled,(state)=>{//there is no action only state is updated
            localStorage.clear();
            state.data={};
            state.isLoggedIn=false;
            state.role="";
        })
        .addCase(getUserData.fulfilled,(state,action)=>{
            if(!action?.payload?.user)return;
            localStorage.setItem("data",JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn",true);
            localStorage.setItem("role",action?.payload?.user?.role);
            //localstorage is updated so incase the app reloads initial state will be set with these
            //now update the current state as u didnt reload
            state.isLoggedIn=true;
            state.data=action?.payload?.user;
            state.role=action?.payload?.user?.role;

        })
        .addCase(changePassword.fulfilled,(state,action)=>{
            if(!action?.payload?.user)return;
            localStorage.setItem("data",JSON.stringify(action?.payload?.user));
            state.data=action?.payload?.user;
        })
    }
})
//export const {}=authSlice.actions;
export default authSlice.reducer;