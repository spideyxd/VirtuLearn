import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helpers/axiosInstance";

const initialState={
    allUsersCount:0,
    subscribedUsersCount:0,

};
export const getStatsData=createAsyncThunk("stats/get",async()=>{
    try{
        const response=axiosInstance.get("/admin/stats/users");
        toast.promise(response,{
            loading:"getting the data",
            success:"data returned",
            error:"failed to load data"
        })
        return (await response).data;

    }
    catch(error){
        toast.error(error?.response?.data?.message)
    }



})
const statSlice=createSlice({
    name:"stat",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getStatsData.fulfilled,(state,action)=>{
            state.allUsersCount=action?.payload?.allUsersCount;
            state.subscribedUsersCount=action?.payload?.subscribedUsersCount;
        })
    }

});
export default statSlice.reducer;